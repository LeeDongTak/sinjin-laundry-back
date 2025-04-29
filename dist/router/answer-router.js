"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const answer_controller_1 = require("../controller/answer-controller");
const sessionMiddleWare_1 = require("../controller/sessionMiddleWare");
const answerRouter = (app) => {
    app.post('/answer/:questionId', sessionMiddleWare_1.sessionMiddleWare, answer_controller_1.createAnswer);
    app.put('/answer/:answerId', sessionMiddleWare_1.sessionMiddleWare, answer_controller_1.updateAnswer);
    app.delete('/answer/:questionId', sessionMiddleWare_1.sessionMiddleWare, answer_controller_1.deleteAnswer);
};
exports.default = answerRouter;
