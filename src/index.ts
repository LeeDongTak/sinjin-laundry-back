import express, { Application } from 'express';
import cors from 'cors';
import compression from 'compression';
import questionRouter from './router/question-router';

const app: Application = express();
const port: number = 3000;

// express 미들웨어 설정

// cors 설정
app.use(cors());

// body json 파싱
app.use(express.json());

// http 압축
app.use(compression());

questionRouter(app);

app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`);
});
