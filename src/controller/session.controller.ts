import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { ResponseUtil } from "../utils/response.utils";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import { DataSource, Repository } from "typeorm";

export class SessionController {
  private UserRepository: Repository<UserModel>;
  private sessions: Record<
    string,
    {
      sessionId: string;
      username: string;
      valid: boolean;
    }
  > = {};

  constructor(private db: DataSource) {
    this.UserRepository = this.db.manager.getRepository(UserModel);
  }

  getSession(sessionId: string) {
    return this.sessions[sessionId] && this.sessions[sessionId].valid
      ? this.sessions[sessionId]
      : null;
  }

  invalidateSession(sessionId: string) {
    if (this.sessions[sessionId]) {
      this.sessions[sessionId].valid = false;
    }
    return this.sessions[sessionId];
  }

  createSession(username: string) {
    const sessionId = String(Object.keys(this.sessions).length + 1);
    const session = { sessionId, username, valid: true };
    this.sessions[sessionId] = session;
    return session;
  }

  async createSessionHandler(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;
    const userEntity = await this.UserRepository.findOne({
      where: { username: username },
    })

    if (!userEntity || userEntity.password !== password) {
      return ResponseUtil.sendError(res, 401, "Invalid username or password", null);
    }

    const session = this.createSession(username);
    const accessToken = signJWT({
      username: username,
      password: password,
      sessionId: session.sessionId,
    }, "1h");

    const refreshToken = signJWT(
      {
        sessionId: session.sessionId,
      },
      "1y"
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 300000,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 3.154e10,
      httpOnly: true,
    });

    return ResponseUtil.sendResponse(res, 200, "Session created", {
      user: {
        username: username,
        name: "admin",
      },
      token: accessToken,
      // accessToken: accessToken,
      // refreshToken: refreshToken,
    })
  };

  async getSessionHandler(req: Request, res: Response): Promise<Response> {
    if (!req.cookies.accessToken) {
      return ResponseUtil.sendError(res, 401, "Session not found", null);
    }

    const accessToken = req.cookies.accessToken;
    const { payload } = verifyJWT(accessToken);

    if (!payload || typeof payload !== "object" || !payload.username) {
      return ResponseUtil.sendError(res, 401, "Invalid session payload", null);
    }

    const sessionData = this.getSession(payload.sessionId);

    if (!sessionData || !sessionData.valid) {
      return ResponseUtil.sendError(res, 401, "Invalid session", null);
    }

    const responseData = {
      username: payload.username,
      name: "admin",
    };

    return ResponseUtil.sendResponse(res, 200, "Session found", responseData);
  }
  

  async deleteSessionHandler(req: Request, res: Response): Promise<Response> {

    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    //@ts-ignore
    this.invalidateSession(req.user.sessionId);

    return ResponseUtil.sendResponse(res, 200, "Session deleted", null);
  }

  async logoutHandler(req: Request, res: Response): Promise<Response> {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return ResponseUtil.sendResponse(res, 200, "Logout successful", null);
  };
}
