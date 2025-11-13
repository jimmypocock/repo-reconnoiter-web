"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createConsumer, Consumer, Subscription } from "@rails/actioncable";
import { apiFetch } from "@/lib/api";
import type {
  CreateComparisonRequest,
  CreateComparisonResponse,
  ComparisonStatusResponse,
  ComparisonWebSocketMessage,
  ComparisonStep,
} from "@/types/api";

interface ProgressState {
  step?: ComparisonStep;
  message?: string;
  percentage: number;
  current?: number;
  total?: number;
}

interface UseComparisonCreateReturn {
  createComparison: (query: string) => Promise<void>;
  progress: ProgressState;
  isCreating: boolean;
  error: string | null;
  comparisonId: number | null;
  cancel: () => void;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/cable";
const POLLING_INTERVAL = 2000; // 2 seconds
const WS_TIMEOUT = 5000; // 5 seconds to establish WebSocket

/**
 * Hook for creating comparisons with real-time progress updates
 * Uses WebSocket (primary) with REST polling fallback
 */
export function useComparisonCreate(): UseComparisonCreateReturn {
  const { data: session } = useSession();
  const router = useRouter();

  const [progress, setProgress] = useState<ProgressState>({
    percentage: 0,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonId, setComparisonId] = useState<number | null>(null);

  // Refs for cleanup
  const sessionIdRef = useRef<string | null>(null);
  const cableRef = useRef<Consumer | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const usingPollingRef = useRef(false);

  /**
   * Clean up all connections and timers
   */
  const cleanup = useCallback(() => {
    // Clear WebSocket subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    // Disconnect cable
    if (cableRef.current) {
      cableRef.current.disconnect();
      cableRef.current = null;
    }

    // Clear polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Clear WebSocket timeout
    if (wsTimeoutRef.current) {
      clearTimeout(wsTimeoutRef.current);
      wsTimeoutRef.current = null;
    }

    sessionIdRef.current = null;
    usingPollingRef.current = false;
  }, []);

  /**
   * Handle progress update (from WebSocket or polling)
   */
  const handleProgress = useCallback(
    (data: ComparisonWebSocketMessage) => {
      if (data.type === "progress") {
        setProgress({
          step: data.step,
          message: data.message,
          percentage: data.percentage,
          current: data.current,
          total: data.total,
        });
      } else if (data.type === "complete") {
        setProgress({ percentage: 100, message: data.message });
        setComparisonId(data.comparison_id);
        setIsCreating(false);
        cleanup();

        // Navigate to comparison page after brief delay
        setTimeout(() => {
          router.push(`/comparisons/${data.comparison_id}`);
        }, 500);
      } else if (data.type === "error") {
        setError(data.message);
        setIsCreating(false);
        cleanup();
      }
    },
    [cleanup, router]
  );

  /**
   * Start REST polling (fallback method)
   */
  const startPolling = useCallback(
    (sessionId: string) => {
      if (usingPollingRef.current) return; // Already polling

      console.log("Starting REST polling for session:", sessionId);
      usingPollingRef.current = true;

      const poll = async () => {
        try {
          const status = await apiFetch<ComparisonStatusResponse>(
            `/comparisons/status/${sessionId}`
          );

          if (status.status === "processing") {
            handleProgress({
              type: "progress",
              step: status.step!,
              message: status.message || "Processing...",
              percentage: status.percentage || 0,
              current: status.current,
              total: status.total,
              timestamp: new Date().toISOString(),
            });
          } else if (status.status === "complete") {
            handleProgress({
              type: "complete",
              comparison_id: status.comparison_id!,
              redirect_url: status.redirect_url!,
              message: status.message || "Complete!",
              timestamp: new Date().toISOString(),
            });
          } else if (status.status === "error") {
            handleProgress({
              type: "error",
              message: status.error || "An error occurred",
              timestamp: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error("Polling error:", err);
          // Continue polling even on error (might be temporary network issue)
        }
      };

      // Poll immediately, then every interval
      poll();
      pollingIntervalRef.current = setInterval(poll, POLLING_INTERVAL);
    },
    [handleProgress]
  );

  /**
   * Attempt WebSocket connection
   */
  const attemptWebSocket = useCallback(
    (sessionId: string) => {
      if (!session?.railsJwt) {
        console.warn("No JWT token available for WebSocket");
        startPolling(sessionId);
        return;
      }

      try {
        console.log("Attempting WebSocket connection...");

        // Create cable connection with JWT token
        const cable = createConsumer(`${WS_URL}?token=${session.railsJwt}`);
        cableRef.current = cable;

        // Set timeout to fall back to polling if WebSocket doesn't connect
        wsTimeoutRef.current = setTimeout(() => {
          if (!usingPollingRef.current && isCreating) {
            console.log("WebSocket timeout - falling back to polling");
            cleanup();
            startPolling(sessionId);
          }
        }, WS_TIMEOUT);

        // Subscribe to comparison status channel
        const subscription = cable.subscriptions.create(
          {
            channel: "ComparisonStatusChannel",
            session_id: sessionId,
          },
          {
            connected() {
              console.log("WebSocket connected!");
              // Clear timeout - WebSocket is working
              if (wsTimeoutRef.current) {
                clearTimeout(wsTimeoutRef.current);
                wsTimeoutRef.current = null;
              }
            },

            disconnected() {
              console.log("WebSocket disconnected");
              // Only start polling if still creating and not already polling
              if (isCreating && !usingPollingRef.current && sessionIdRef.current) {
                startPolling(sessionIdRef.current);
              }
            },

            received(data: ComparisonWebSocketMessage) {
              console.log("WebSocket message:", data);
              handleProgress(data);
            },

            rejected() {
              console.log("WebSocket subscription rejected - falling back to polling");
              cleanup();
              startPolling(sessionId);
            },
          }
        );

        subscriptionRef.current = subscription;
      } catch (err) {
        console.error("WebSocket error:", err);
        startPolling(sessionId);
      }
    },
    [session, isCreating, handleProgress, cleanup, startPolling]
  );

  /**
   * Create a new comparison
   */
  const createComparison = useCallback(
    async (query: string) => {
      // Reset state
      setError(null);
      setProgress({ percentage: 0 });
      setComparisonId(null);
      setIsCreating(true);
      cleanup();

      try {
        // Create comparison via API
        const request: CreateComparisonRequest = { query };
        const response = await apiFetch<CreateComparisonResponse>("/comparisons", {
          method: "POST",
          body: JSON.stringify(request),
        });

        // Store session ID
        sessionIdRef.current = response.session_id;

        // Attempt WebSocket, with automatic fallback to polling
        attemptWebSocket(response.session_id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create comparison";
        setError(errorMessage);
        setIsCreating(false);
        cleanup();
      }
    },
    [cleanup, attemptWebSocket]
  );

  /**
   * Cancel the current comparison
   */
  const cancel = useCallback(() => {
    cleanup();
    setIsCreating(false);
    setProgress({ percentage: 0 });
    setError(null);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    createComparison,
    progress,
    isCreating,
    error,
    comparisonId,
    cancel,
  };
}
