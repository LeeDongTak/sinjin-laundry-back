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
exports.readQuestionDetailBySecret = exports.readQuestionDetail = exports.readQuestion = exports.createQuestion = void 0;
const question_dao_1 = require("../dao/question-dao");
const crypto_1 = __importDefault(require("crypto"));
// 질문 등록
const createQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question_title, question_content, question_name, is_secret, secret_password, user_email, user_phone, user_site, } = req.body;
        // 에러처리
        if (!question_title) {
            res.status(400).send({
                isSuccess: false,
                message: '제목을 입력해 주세요',
            });
            return;
        }
        if (!question_content) {
            res.status(400).send({
                isSuccess: false,
                message: '내용을 입력해 주세요',
            });
            return;
        }
        if (!question_name) {
            res.status(400).send({
                isSuccess: false,
                message: '작성자를 입력해 주세요',
            });
            return;
        }
        if (is_secret && !secret_password) {
            res.status(400).send({
                isSuccess: false,
                message: '비밀글에는 비밀번호를 입력해 주세요',
            });
            return;
        }
        if (!user_email && !user_phone) {
            res.status(400).send({
                isSuccess: false,
                message: '이메일 혹은 전화번호를 입력해 주세요',
            });
            return;
        }
        if (is_secret && secret_password.length > 6) {
            res.status(400).send({
                isSuccess: false,
                message: '비밀번호는 6자리 이하로 적어주세요',
            });
            return;
        }
        const hashedPassword = secret_password
            ? crypto_1.default
                .createHash('sha224')
                .update('' + secret_password)
                .digest('base64')
            : null;
        const createQuestionData = yield (0, question_dao_1.insertQuestion)(question_title, question_content, question_name, is_secret ? 1 : 0, hashedPassword, user_email, user_phone, user_site);
        const { insertId } = createQuestionData;
        if (!createQuestionData) {
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
exports.createQuestion = createQuestion;
// 질문 리스트 조회
const readQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageMum } = req.params;
    const is_answer = req.query.is_answer;
    // 에러처리
    if (!pageMum || pageMum === ' ') {
        res.status(400).send({
            isSuccess: false,
            message: 'pageNum을 보내주세요',
        });
        return;
    }
    const isNumber = /^\d+$/.test(pageMum);
    if (!isNumber) {
        res.status(400).send({
            isSuccess: false,
            message: 'pageNum은 숫자로 보내주세요',
        });
        return;
    }
    try {
        const readQuestionData = yield (0, question_dao_1.selectQuestion)(pageMum, is_answer);
        if (!readQuestionData || !readQuestionData.total || !readQuestionData.question) {
            res.status(500).send({
                isSuccess: false,
                message: '서버에 문제가 발생하였습니다.',
            });
            return;
        }
        res.status(200).send({
            isSuccess: true,
            data: readQuestionData,
            message: '요청에 성공하였습니다.',
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.readQuestion = readQuestion;
// 질문 상세 내용 조회 (비밀글 x)
const readQuestionDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.session.user;
    const { questionId } = req.params;
    // 에러처리
    if (!questionId || questionId === ' ') {
        res.status(400).send({
            isSuccess: false,
            message: 'questionId를 보내주세요',
        });
        return;
    }
    try {
        const readQuestionDetailBySecret = yield (0, question_dao_1.selectDetailBySecretType)(questionId);
        const { is_secret } = JSON.parse(JSON.stringify(Object.assign({}, readQuestionDetailBySecret)))[0];
        if (is_secret === 1 && !user) {
            res.status(400).send({
                isSuccess: false,
                message: '비밀글 입니다. 비밀번호를 입력해 주세요',
            });
            return;
        }
        const readQuestionDetailData = yield (0, question_dao_1.selectQuestionDetail)(questionId);
        // if (!readQuestionDetailData) {
        //   res.status(500).send({
        //     isSuccess: false,
        //     message: '서버에 문제가 발생하였습니다.',
        //   });
        //   return;
        // }
        if (!readQuestionDetailData) {
            res.status(500).send({
                isSuccess: false,
                message: '서버에 문제가 발생하였습니다.',
            });
            return;
        }
        const { question, answer } = JSON.parse(JSON.stringify(Object.assign({}, readQuestionDetailData)))[0];
        const result = Object.assign(Object.assign({}, question), { answer });
        res.status(200).send({
            isSuccess: true,
            data: result,
            message: '요청에 성공하였습니다.',
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.readQuestionDetail = readQuestionDetail;
// 비밀글 질문 상세내용 조회
const readQuestionDetailBySecret = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { questionId } = req.params;
    const { secret_password } = req.body;
    // 에러처리
    if (!questionId || questionId === ' ') {
        res.status(400).send({
            isSuccess: false,
            message: 'questionId를 보내주세요',
        });
        return;
    }
    if (!secret_password || secret_password === ' ') {
        res.status(400).send({
            isSuccess: false,
            message: '비밀번호를 보내주세요',
        });
        return;
    }
    if (secret_password.length !== 6) {
        res.status(400).send({
            isSuccess: false,
            message: '비밀번호는 6자리로 입력해 주세요',
        });
        return;
    }
    try {
        const hashedPassword = crypto_1.default
            .createHash('sha224')
            .update('' + secret_password)
            .digest('base64');
        const readQuestionSecretDetail = yield (0, question_dao_1.selectQuestionSecretDetail)(questionId, hashedPassword);
        const { is_secret } = JSON.parse(JSON.stringify(Object.assign({}, readQuestionSecretDetail)))[0].question;
        if (is_secret === 3) {
            res.status(400).send({
                isSuccess: false,
                data: is_secret,
                message: '비밀번호가 다릅니다. 올바른 비밀번호를 입력해 주세요.',
            });
            return;
        }
        if (!readQuestionSecretDetail) {
            res.status(500).send({
                isSuccess: false,
                message: '서버에 문제가 발생하였습니다.',
            });
            return;
        }
        const { question, answer } = JSON.parse(JSON.stringify(Object.assign({}, readQuestionSecretDetail)))[0];
        const result = Object.assign(Object.assign({}, question), { answer });
        res.status(200).send({
            isSuccess: true,
            data: result,
            message: '요청에 성공하였습니다.',
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.readQuestionDetailBySecret = readQuestionDetailBySecret;
