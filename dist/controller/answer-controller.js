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
exports.deleteAnswer = exports.updateAnswer = exports.createAnswer = void 0;
const answer_dao_1 = require("../dao/answer-dao");
// 답변 등록
const createAnswer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.session.user;
        const { questionId } = req.params;
        const { answer_content } = req.body;
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
        if (!answer_content) {
            res.status(400).send({
                isSuccess: false,
                message: '내용을 입력해 주세요',
            });
            return;
        }
        const createAnswerData = yield (0, answer_dao_1.insertAnswer)(user, questionId, answer_content);
        const { insertId } = createAnswerData;
        if (!createAnswerData) {
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
exports.createAnswer = createAnswer;
// 답변 수정
const updateAnswer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.session.user;
        const { answerId } = req.params;
        const { answer_content } = req.body;
        // 에러처리
        if (!user) {
            res.status(400).send({
                isSuccess: false,
                message: '로그인을 해주세요',
            });
            return;
        }
        if (!answerId) {
            res.status(400).send({
                isSuccess: false,
                message: '질문id를 입력해 주세요',
            });
            return;
        }
        if (!answer_content) {
            res.status(400).send({
                isSuccess: false,
                message: '내용을 입력해 주세요',
            });
            return;
        }
        const updateAnswerData = yield (0, answer_dao_1.updateAnswerDao)(answerId, answer_content);
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
exports.updateAnswer = updateAnswer;
// 답변 삭제
const deleteAnswer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updateAnswerData = yield (0, answer_dao_1.deleteAnswerDao)(questionId);
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
exports.deleteAnswer = deleteAnswer;
