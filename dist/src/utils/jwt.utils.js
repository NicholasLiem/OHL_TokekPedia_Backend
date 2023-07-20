"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.signJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAxwKzpbItLLgJ+clmsVavHuS7UCGFjh9uvzLEXNodjuNaEyJP
PiLtkvakI76JfIlRGicCHLRGQLG3waIh3F4T+SF+2yWU8xKqMVSS0ogPi+K3n2m/
cX1plZ6QWtb9F2as1XB/P+55UBUOFRVKLQ8AuAJi0ZBu0GkE8QDguHX8+YO/qvv/
ClyZObLYlHuFkeZtbCirg59HR3qjQRNlBV7qXKgKrbbnvTENmETBJ/BVJ0mkrvZt
7y14CvbwQMGYdgzgMu/RBKmgHWgaZR9X3i7zMKB7LguM34nhvC2dSRxsJZf2VcBH
3qQwpwno51VQOSvG4V4SuJpnLcahJdgf5bvQTQIDAQABAoIBACONfAKR/jgK+N1C
+bGcxtRCEKSUGIP3YZWOwD3GSZmJTEI20ulK3B5xKYmpNG6nKXH+ngX6vsI3/Zf+
GwZ/WBodvcfwwtdZ8kW10jUCUaSv8BXukmD4ArDUDv3rgnN3yFCpNFJ7i/ieilGB
6Cp8j6hP5M+DegiJenSDr6HEklkQu3/SQSTa5H9Lp2m8dQYFv1e/Fw3LzumQBpMp
nqnEMcTtrIMVJVm3I8zG6MbK4uuBcS7+mZ9MtVBOoaBUrLZdWI6h7MnvPTl52xpv
AKXUnnpxSqFaA0d/Oq4AGNs4qg34CgxqhXa7qTXdO3WpemzdIF0Sa5LaU24f2Sbk
RKuiZBECgYEA84NmSusxB6bsrMv4MeHZUiXvNKnpsPX9W5iuGwQGgwZ2JlG/0/jZ
pWvkB262CxIp4ArhJtBH6VdXeVtLmkg4GhejN/D/fu1+FIFXnpHRy6mNaR3KQQBY
ixBOnePhbesgmA2eDygPf5yBjWMp012qip5bhi+4/FBA99JHQR1VJMcCgYEA0Tcd
VduPxSC4jiWpkyFtol6pF2kVbffzsypyXk9MbnvnKxle4naqMyxn82k1Ld4aVJfX
3caCczdtvnZr/9yfLvk47oejU3ZA3BOpvp2AIdz3fyhhYYeAWzFG1upmsiqta024
AIkTgxcpQgBuqAMifNkIe3OsXaYWVrPq4LWHpksCgYAdwUiWjvaGwNbapnHFZptv
dkMsZDax8NzsfFOJ6YwCJp/5PrP56sZteCl83wJPiACl565rV7fxw0JlCcrLJ1fz
mD/RbhlKISruxn82WQsRn74vwfwcxTYMiAmTMW0ySTDKY5+Uqoh6R11tMVjDAwb7
uS3lz58C9at6nK8oPbVRsQKBgQCunr3RZ4y8D+96VV0P/JqxJyki7QaB3q59IDSN
GsrEfI4ZnvdfNYQhajLpKyrDudloOcRmysUevWjPy6+gwtfqMQGftX5Qrya7iX3o
JzVHDlNUwrNk39/2PU7PGp3Un2JXaWrmp4Ktq6s393xkpxkl80/tGkMHdxS2ET09
iMZLuQKBgQCOKaeVLCxP7+tImvaj/fHl1anu80cFYjCr5Zt1hZ0uOQrAaMyyyNym
kMdFwaq5z5De5HztXJUT8TwqI20n9dtPF30ukA8lVfbu9TaZ8ruhNfX6zR9bMWes
gpppXtlN0YUWQc5Gu97gX5sMYF09h0SJBIFuCIOyIxBUlb7NPo5AdA==
-----END RSA PRIVATE KEY-----`;
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxwKzpbItLLgJ+clmsVav
HuS7UCGFjh9uvzLEXNodjuNaEyJPPiLtkvakI76JfIlRGicCHLRGQLG3waIh3F4T
+SF+2yWU8xKqMVSS0ogPi+K3n2m/cX1plZ6QWtb9F2as1XB/P+55UBUOFRVKLQ8A
uAJi0ZBu0GkE8QDguHX8+YO/qvv/ClyZObLYlHuFkeZtbCirg59HR3qjQRNlBV7q
XKgKrbbnvTENmETBJ/BVJ0mkrvZt7y14CvbwQMGYdgzgMu/RBKmgHWgaZR9X3i7z
MKB7LguM34nhvC2dSRxsJZf2VcBH3qQwpwno51VQOSvG4V4SuJpnLcahJdgf5bvQ
TQIDAQAB
-----END PUBLIC KEY-----`;
function signJWT(payload, expiresIn) {
    return jsonwebtoken_1.default.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: expiresIn });
}
exports.signJWT = signJWT;
function verifyJWT(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey, { algorithms: ['RS256'] });
        return { payload: decoded, expired: false };
    }
    catch (e) {
        return { payload: null, expired: true };
    }
}
exports.verifyJWT = verifyJWT;
