import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";

// Import types
interface DecodedPayload {
  permissions?: any;
  apartment?: { id?: string };
  building?: string;
  [key: string]: any;
}

interface AuthRequest extends Request {
  decoded?: DecodedPayload;
}

/**
 * Middleware to authenticate requests using a JWT token.
 */
const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers["x-auth-token"] as string | undefined;
  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
    return;
  }
  try {
    req.decoded = jwt.verify(token, config.get("jwtSecret")) as DecodedPayload;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
