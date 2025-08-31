import { Request, Response, NextFunction } from "express";

/**
 * Middleware to authorize access for users with moderator or admin permissions.
 */
const moderator = (
  req: ModeratorRequest,
  res: Response,
  next: NextFunction
): void => {
  const permissions = req.decoded?.permissions;
  if (permissions?.admin) {
    next();
    return;
  }
  if (!permissions?.moderator) {
    res.status(403).json({ msg: "Access denied: not a moderator" });
    return;
  }
  next();
};

export default moderator;
