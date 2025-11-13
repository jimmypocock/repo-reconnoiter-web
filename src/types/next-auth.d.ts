import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extended session with Rails user data and JWT
   */
  interface Session {
    user: {
      id: number;
      github_id: number;
      github_username: string;
      email: string;
      avatar_url: string;
      name?: string;
      admin: boolean;
    };
    railsJwt: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extended JWT with Rails user data and JWT token
   */
  interface JWT {
    user?: {
      id: number;
      github_id: number;
      github_username: string;
      email: string;
      avatar_url: string;
      name?: string;
      admin: boolean;
    };
    railsJwt?: string;
    error?: string;
  }
}
