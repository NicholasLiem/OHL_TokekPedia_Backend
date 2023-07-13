import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt.utils';
import { ResponseUtil } from '../utils/response.utils';

export function checkToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
  
    if (!token) {
      return ResponseUtil.sendError(res, 401, "Invalid token", null);
    }
  
    const { payload, expired } = verifyJWT(token);
  
    if (!payload || expired) {
      return ResponseUtil.sendError(res, 401, "Invalid token", null);
    }

    // @ts-ignore
    req.tokenPayload = payload;
    return next();
  }