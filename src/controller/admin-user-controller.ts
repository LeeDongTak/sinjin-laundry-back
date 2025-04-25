import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createUser, selectCheckAdminId, selectUser } from '../dao/admin-user-dao';
import bcrypt from 'bcrypt';
declare module 'express-session' {
  interface SessionData {
    user: string;
  }
}

export const adminSignup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { admin_id, password } = req.body;
    if (!admin_id || !password) {
      res.status(400).send({
        isSuccess: false,
        message: '아이디,페스워드를 입력해 주세요',
      });
      return;
    }

    const checkAdminId = await selectCheckAdminId(admin_id);
    console.log(checkAdminId);
    if (!checkAdminId || checkAdminId.length !== 0) {
      res.status(400).send({ isSuccess: false, message: '아이디가 이미 존재합니다.' });
      return;
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const createUserData = await createUser(admin_id, hashPassword);

      if (!createUserData) {
        res.status(500).send({
          isSuccess: false,
          message: '서버에 문제가 발생하였습니다.',
        });
        return;
      }
      const { insertId } = createUserData as { insertId: number };
      res.status(200).send({
        isSuccess: true,
        id: insertId,
        message: '요청에 성공하였습니다.',
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

// 로그인
export const adminSignin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { admin_id, password } = req.body;
    if (!admin_id || !password) {
      res.status(400).send({ isSuccess: false, message: '아이디와 페스워드를 입력해 주세요' });
      return;
    }

    const selectUserData = await selectUser(admin_id);

    if (!selectUserData) {
      res.status(400).send({ isSuccess: false, message: '아이디나 페스워드가 올바르지 않습니다.' });
      return;
    }

    const validPassword = await bcrypt.compare(password, selectUserData.password);

    if (!validPassword) {
      res.status(400).send({ isSuccess: false, message: '아이디나 페스워드가 올바르지 않습니다.' });
      return;
    }

    (req.session.user = '' + selectUserData.id),
      res.send({
        isSuccess: true,
        massage: '로그인에 성공하였습니다',
      });
    return;
  } catch (error) {
    next(error);
  }
};

// 로그아웃
export const adminSignout: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.destroy(err => {
      if (err) {
        res.status(500).send({ isSuccess: false, message: '로그아웃을 실패하였습니다' });
        return;
      }
      res.status(200).send({ isSuccess: true, message: '로그아웃 성공' });
      return;
    });
  } catch (error) {
    next(error);
  }
};
