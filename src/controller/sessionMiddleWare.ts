import { Request, Response, NextFunction } from 'express';

export const sessionMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  // 헤더에서 토큰 꺼내기
  const user = req.session.user;

  // 토큰이 없는 경우
  if (!user) {
    next({
      isSuccess: false,
      code: 403,
      message: '로그인이 되어 있지 않습니다.',
    });
    return;
  }

  // 토큰이 있는 경우, 토큰 검증
  try {
    next();
  } catch (error) {
    res.status(403).send({
      isSuccess: false,
      code: 403,
      message: '토큰 검증 실패',
    });
  }
};
