import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../utils/response.utils";

export function requireUser(req: Request, res: Response, next: NextFunction) {
    
    // @ts-ignore
    if (!req.user) {
        return ResponseUtil.sendError(res, 401, "Unauthorized Access", null);
    }

    return next();
}