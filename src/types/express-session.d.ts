import "express-session";

declare module "express-session" {
  interface SessionData {
    nonce?: string;
    user?: {
      address: string;
      chainId: number;
    };
  }
}

