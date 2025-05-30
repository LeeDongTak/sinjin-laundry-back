"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const compression_1 = __importDefault(require("compression"));
const question_router_1 = __importDefault(require("./router/question-router"));
const admin_user_router_1 = __importDefault(require("./router/admin-user-router"));
const answer_router_1 = __importDefault(require("./router/answer-router"));
const app = (0, express_1.default)();
const port = 4000;
// express 미들웨어 설정
// cors 설정
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
// body json 파싱
app.use(express_1.default.json());
// http 압축
app.use((0, compression_1.default)());
// session 설정
app.use((0, express_session_1.default)({
    secret: `${process.env.SESSION_KEY}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    },
}));
(0, question_router_1.default)(app);
(0, admin_user_router_1.default)(app);
(0, answer_router_1.default)(app);
app.listen(port, () => {
    console.log(`Express app listening at port: ${port}`);
});
