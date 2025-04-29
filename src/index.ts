import express, { Application } from 'express';
import cors from 'cors';
import session from 'express-session';
import compression from 'compression';
import questionRouter from './router/question-router';
import adminUserRouter from './router/admin-user-router';
import answerRouter from './router/answer-router';

const app: Application = express();
const port: number = 4000;

// express 미들웨어 설정

// cors 설정
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// body json 파싱
app.use(express.json());

// http 압축
app.use(compression());

// session 설정
app.use(
  session({
    secret: `${process.env.SESSION_KEY}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    },
  }),
);

questionRouter(app);
adminUserRouter(app);
answerRouter(app);

app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`);
});
