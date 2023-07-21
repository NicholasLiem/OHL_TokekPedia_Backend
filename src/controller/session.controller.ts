import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { ResponseUtil } from "../utils/response.utils";
import { signJWT } from "../utils/jwt.utils";
import { DataSource, Repository } from "typeorm";

export class SessionController {
  private UserRepository: Repository<UserModel>;

  constructor(private db: DataSource) {
    this.UserRepository = this.db.manager.getRepository(UserModel);
  }

  /**
   * @openapi
   * components:
   *  schemas:
   *    LoginRequest:
   *      type: object
   *      required:
   *        - username
   *        - password
   *      properties:
   *        username: 
   *          type: string
   *          default: admin
   *        password:
   *          type: string
   *          default: admin
   *    LoginResponse:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          default: success
   *        message:
   *          type: string
   *          default: Session created
   *        data:
   *          type: object
   *          properties:
   *            user:
   *              type: object
   *              properties:
   *                username:
   *                  type: string
   *                name:
   *                  type: string
   *            token:
   *              type: string
   *    InvalidCredentialsResponse:
   *      type: object
   *      properties:
   *        status:
   *          type: string
   *          default: error
   *        message:
   *          type: string
   *          default: Invalid username or password
   *        data:
   *          type: null
   *          nullable: true
   */
  async createSessionHandler(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;
    const userEntity = await this.UserRepository.findOne({
      where: { username: username },
    });

    if (!userEntity || userEntity.password !== password) {
      return ResponseUtil.sendError(res, 401, 'Invalid username or password', null);
    }

    const token = signJWT(
      {
        username: username,
        password: password,
        name: userEntity.name,
      },
      '1y'
    );

    return ResponseUtil.sendResponse(res, 200, 'Session created', {
      user: {
        username: username,
        name: userEntity.name,
      },
      token: token,
    });
  }

  async getSessionHandler(req: Request, res: Response): Promise<Response> {
    // @ts-ignore
    const username = req.payload.username

    const userEntity = await this.UserRepository.findOne({
      where: { username: username },
    })

    if (!userEntity) {
      return ResponseUtil.sendError(res, 401, "Invalid username or password", {
        username: null,
        password: null
      });
    }

    return ResponseUtil.sendResponse(res, 200, "Session created", {
        username: username,
        name: userEntity.name,
    })
  }
  
}
