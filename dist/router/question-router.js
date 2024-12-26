"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const question_controller_1 = require("../controller/question-controller");
const questionRouter = (app) => {
    app.get('/question/:pageMum', question_controller_1.readQuestion);
    app.get('/question/detail/:questionId', question_controller_1.readQuestionDetail);
    app.post('/question/secret/detail/:questionId', question_controller_1.readQuestionDetailBySecret);
    app.post('/question', question_controller_1.createQuestion);
};
exports.default = questionRouter;
