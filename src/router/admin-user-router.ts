import { Application } from 'express';
import { adminSignin, adminSignout, adminSignup } from '../controller/admin-user-controller';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { pool } from '../mysql';
import { RowDataPacket } from 'mysql2';

const adminUserRouter = (app: Application) => {
  app.post('/admin-signup', adminSignup);
  app.post('/admin-signin', adminSignin);
  app.post('/admin-signout', adminSignout);
};

export default adminUserRouter;
