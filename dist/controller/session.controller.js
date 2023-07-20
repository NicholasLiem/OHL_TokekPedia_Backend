"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const user_model_1 = require("../models/user.model");
const response_utils_1 = require("../utils/response.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
class SessionController {
    constructor(db) {
        this.db = db;
        this.UserRepository = this.db.manager.getRepository(user_model_1.UserModel);
    }
    createSessionHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const userEntity = yield this.UserRepository.findOne({
                where: { username: username },
            });
            if (!userEntity || userEntity.password !== password) {
                return response_utils_1.ResponseUtil.sendError(res, 401, 'Invalid username or password', null);
            }
            const token = (0, jwt_utils_1.signJWT)({
                username: username,
                password: password,
                name: userEntity.name,
            }, '1y');
            return response_utils_1.ResponseUtil.sendResponse(res, 200, 'Session created', {
                user: {
                    username: username,
                    name: userEntity.name,
                },
                token: token,
            });
        });
    }
    getSessionHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const username = req.payload.username;
            const userEntity = yield this.UserRepository.findOne({
                where: { username: username },
            });
            if (!userEntity) {
                return response_utils_1.ResponseUtil.sendError(res, 401, "Invalid username or password", {
                    username: null,
                    password: null
                });
            }
            return response_utils_1.ResponseUtil.sendResponse(res, 200, "Session created", {
                username: username,
                name: userEntity.name,
            });
        });
    }
}
exports.SessionController = SessionController;
