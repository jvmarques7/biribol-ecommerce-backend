import { JwtPayload } from "./jwt-payload";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

declare namespace Express {
  export interface Request {
    user?: {
      id: string
      perfis: string[]
    }
  }
}
  