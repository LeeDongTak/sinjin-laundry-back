import { Application } from 'express';
import {
  createQuestion,
  readQuestion,
  readQuestionDetail,
  readQuestionDetailBySecret,
} from '../controller/question-controller';

const questionRouter = (app: Application) => {
  app.get('/question/:pageMum', readQuestion);
  app.get('/question/detail/:questionId', readQuestionDetail);
  app.post('/question/secret/detail/:questionId', readQuestionDetailBySecret);
  app.post('/question', createQuestion);
};

export default questionRouter;
