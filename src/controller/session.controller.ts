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

  async createSessionHandler(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;
    const userEntity = await this.UserRepository.findOne({
      where: { username: username },
    })

    if (!userEntity || userEntity.password !== password) {
      return ResponseUtil.sendError(res, 401, "Invalid username or password", null);
    }

    const token = signJWT({
      username: username,
      password: password,
      name: userEntity.name,
      }, "1y");

    return ResponseUtil.sendResponse(res, 200, "Session created", {
      user: {
        username: username,
        name: userEntity.name,
      },
      token: token,
    })
  };

  async getSessionHandler(req: Request, res: Response): Promise<Response> {
    // @ts-ignore
    const { username } = req.tokenPayload;
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
      user: {
        username: username,
        name: userEntity.name,
      },
    })
  }
  
}
