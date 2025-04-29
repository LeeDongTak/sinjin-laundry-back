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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.adminSignout = exports.adminSignin = exports.adminSignup = void 0;
const admin_user_dao_1 = require("../dao/admin-user-dao");
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_id, password } = req.body;
        if (!admin_id || !password) {
            res.status(400).send({
                isSuccess: false,
                message: '아이디,페스워드를 입력해 주세요',
            });
            return;
        }
        const checkAdminId = yield (0, admin_user_dao_1.selectCheckAdminId)(admin_id);
        if (!checkAdminId || checkAdminId.length !== 0) {
            res.status(400).send({ isSuccess: false, message: '아이디가 이미 존재합니다.' });
            return;
        }
        else {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashPassword = yield bcrypt_1.default.hash(password, salt);
            const createUserData = yield (0, admin_user_dao_1.createUser)(admin_id, hashPassword);
            if (!createUserData) {
                res.status(500).send({
                    isSuccess: false,
                    message: '서버에 문제가 발생하였습니다.',
                });
                return;
            }
            const { insertId } = createUserData;
            res.status(200).send({
                isSuccess: true,
                id: insertId,
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
// 로그인
const adminSignin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_id, password } = req.body;
        if (!admin_id || !password) {
            res.status(400).send({ isSuccess: false, message: '아이디와 페스워드를 입력해 주세요' });
            return;
        }
        const selectUserData = yield (0, admin_user_dao_1.selectUser)(admin_id);
        if (!selectUserData) {
            res.status(400).send({ isSuccess: false, message: '아이디나 페스워드가 올바르지 않습니다.' });
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(password, selectUserData.password);
        if (!validPassword) {
            res.status(400).send({ isSuccess: false, message: '아이디나 페스워드가 올바르지 않습니다.' });
            return;
        }
        (req.session.user = '' + selectUserData.id),
            (req.session.name = '' + selectUserData.name),
            res.send({
                isSuccess: true,
                massage: '로그인에 성공하였습니다',
            });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.adminSignin = adminSignin;
// 로그아웃
const adminSignout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy(err => {
            if (err) {
                res.status(500).send({ isSuccess: false, message: '로그아웃을 실패하였습니다' });
                return;
            }
            res.status(200).send({ isSuccess: true, message: '로그아웃 성공' });
            return;
        });
    }
    catch (error) {
        next(error);
    }
});
exports.adminSignout = adminSignout;
// 질문 삭제
const deleteQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.session.user;
        const { questionId } = req.params;
        // 에러처리
        if (!user) {
            res.status(400).send({
                isSuccess: false,
                message: '로그인을 해주세요',
            });
            return;
        }
        if (!questionId) {
            res.status(400).send({
                isSuccess: false,
                message: '질문id를 입력해 주세요',
            });
            return;
        }
        const updateAnswerData = yield (0, admin_user_dao_1.deleteQuestionDao)(questionId);
        const { insertId } = updateAnswerData;
        if (!updateAnswerData) {
            res.status(500).send({
                isSuccess: false,
                message: '서버에 문제가 발생하였습니다.',
            });
            return;
        }
        res.status(200).send({
            isSuccess: true,
            id: insertId,
            message: '요청에 성공하였습니다.',
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.deleteQuestion = deleteQuestion;
