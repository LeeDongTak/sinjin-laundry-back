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
exports.adminSignup = exports.adminSignin = void 0;
const admin_user_dao_1 = require("../dao/admin-user-dao");
const adminSignin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const { admin_id, password } = req.body;
    //   if (admin_id === adminUser.username && password === adminUser.password) {
    //     req.session.user = { username };
    //     return res.json({ success: true });
    //   }
    //   res.status(401).json({ success: false, message: 'Invalid credentials' });
    // } catch (error) {}
});
exports.adminSignin = adminSignin;
const adminSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_id, password } = req.body;
        if (!admin_id || !password) {
            res.status(400).send({
                isSuccess: false,
                message: '아이디,페스워드를 입력해 주세요',
            });
            const createUserData = yield (0, admin_user_dao_1.createUser)(admin_id, password);
            if (!createUserData) {
                res.status(500).send({
                    isSuccess: false,
                    message: '서버에 문제가 발생하였습니다.',
                });
                return;
            }
            res.status(200).send({
                isSuccess: true,
                id: createUserData,
                message: '요청에 성공하였습니다.',
            });
            return;
        }
    }
    catch (error) {
        next(error);
    }
});
exports.adminSignup = adminSignup;
