// Type declarations for Klario server

// Extend Express Request to include superAdmin
declare global {
  namespace Express {
    interface Request {
      superAdmin?: import('@shared/superadmin-schema').SuperAdmin;
    }
  }
}

// Fix Vite server options type compatibility
declare module 'vite' {
  interface ServerOptions {
    allowedHosts?: boolean | true | string[];
  }
}

export {};