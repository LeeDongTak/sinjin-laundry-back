import { Application } from 'express';
import { createAnswer, deleteAnswer, updateAnswer } from '../controller/answer-controller';
import { sessionMiddleWare } from '../controller/sessionMiddleWare';

const answerRouter = (app: Application) => {
  app.post('/answer/:questionId', sessionMiddleWare, createAnswer);
  app.put('/answer/:answerId', sessionMiddleWare, updateAnswer);
  app.delete('/answer/:questionId', sessionMiddleWare, deleteAnswer);
};

export default answerRouter;
