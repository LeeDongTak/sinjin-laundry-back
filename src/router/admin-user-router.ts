import { Application } from 'express';
import { adminSignin, adminSignout, adminSignup, deleteQuestion } from '../controller/admin-user-controller';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { pool } from '../mysql';
import { RowDataPacket } from 'mysql2';
import { sessionMiddleWare } from '../controller/sessionMiddleWare';

const adminUserRouter = (app: Application) => {
  app.post('/admin-signup', adminSignup);
  app.post('/admin-signin', adminSignin);
  app.post('/admin-signout', adminSignout);
  app.delete('/question/:questionId', sessionMiddleWare, deleteQuestion);

  app.get('/session', (req, res) => {
    const name = req.session.name;
    if (name) {
      res.json({ authenticated: true, user: name });
    } else {
      res.json({ authenticated: false });
    }
  });
};

export default adminUserRouter;
