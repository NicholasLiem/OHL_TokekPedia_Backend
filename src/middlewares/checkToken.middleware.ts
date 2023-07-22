import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/jwt.utils';
import { ResponseUtil } from '../utils/response.utils';
import dotEnv from 'dotenv';

dotEnv.config()
/**
 * @openapi
 * components:
 *  schemas:
 *    InvalidTokenResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: error
 *        message:
 *          type: string
 *          default: Invalid token, no token
 *        data:
 *          type: null
 *          nullable: true
 */
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
  if (!payload || payload.username !== process.env.ADMIN_USERNAME || payload.password !== process.env.ADMIN_PASSWORD || payload.secret_key !== process.env.JWT_SECRET) {
      return ResponseUtil.sendError(res, 403, "Unauthorized", null);
  }

  //@ts-ignore
  req.payload = payload;
  return next();
}
