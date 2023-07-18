import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt.utils';
import { ResponseUtil } from '../utils/response.utils';

export function checkToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
      return ResponseUtil.sendError(res, 401, "Invalid token, no token", null);
  }

  let bearerToken: string;
  if (token.startsWith("Bearer ")) {
      bearerToken = token.split(" ")[1];
  } else {
      bearerToken = token;
  }

  const { payload, expired } = verifyJWT(bearerToken);

  //@ts-ignore
  if (!payload || payload.username !== 'admin' || payload.password !== 'admin') {
      return ResponseUtil.sendError(res, 403, "Unauthorized", null);
  }

  //@ts-ignore
  req.payload = payload;
  return next();
}
