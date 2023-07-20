"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const response_utils_1 = require("../utils/response.utils");
function checkToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return response_utils_1.ResponseUtil.sendError(res, 401, "Invalid token, no token", null);
    }
    let bearerToken;
    if (token.startsWith("Bearer ")) {
        bearerToken = token.split(" ")[1];
    }
    else {
        bearerToken = token;
    }
    const { payload, expired } = (0, jwt_utils_1.verifyJWT)(bearerToken);
    //@ts-ignore
    if (!payload || payload.username !== 'admin' || payload.password !== 'admin') {
        return response_utils_1.ResponseUtil.sendError(res, 403, "Unauthorized", null);
    }
    //@ts-ignore
    req.payload = payload;
    return next();
}
exports.checkToken = checkToken;
