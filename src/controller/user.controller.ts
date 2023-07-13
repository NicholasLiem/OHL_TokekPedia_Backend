import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { DataSource } from 'typeorm';
import { ResponseUtil } from '../utils/response.utils';


export const register = async (req: Request, res: Response, db: DataSource) => {
    const { username, password, name } = req.body;
    try {
      
        if (username == null || password == null || name == null) {
            return ResponseUtil.sendError(res, 400, 'Missing parameters', req.body);
        }

        const userEntity = await db.manager.findOne(UserModel, { where: { username: username } });
        if (userEntity) {
            return ResponseUtil.sendError(res, 409, 'Username already exists', req.body);
        }

        const user = new UserModel(username, password, name)
        await db.manager.save(user)
        return ResponseUtil.sendResponse(res, 200, 'User registered successfully', user);

    } catch (error) {
        return ResponseUtil.sendError(res, 500, 'Internal Server Error', error);
    }
}