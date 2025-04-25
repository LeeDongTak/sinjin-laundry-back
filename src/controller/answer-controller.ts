import { Request, Response, NextFunction, RequestHandler } from 'express';
import { deleteAnswerDao, insertAnswer, updateAnswerDao } from '../dao/answer-dao';

// 답변 등록
export const createAnswer: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.session.user;
    const { questionId } = req.params;
    const { answer_content } = req.body;

    // 에러처리
    if (!user) {
      res.status(400).send({
        isSuccess: false,
        message: '로그인을 해주세요',
      });
      return;
    }
    if (!questionId) {
      res.status(400).send({
        isSuccess: false,
        message: '질문id를 입력해 주세요',
      });
      return;
    }
    if (!answer_content) {
      res.status(400).send({
        isSuccess: false,
        message: '내용을 입력해 주세요',
      });
      return;
    }

    const createAnswerData = await insertAnswer(user, questionId, answer_content);

    const { insertId } = createAnswerData as { insertId: number };

    if (!createAnswerData) {
      res.status(500).send({
        isSuccess: false,
        message: '서버에 문제가 발생하였습니다.',
      });
      return;
    }

    res.status(200).send({
      isSuccess: true,
      id: insertId,
      message: '요청에 성공하였습니다.',
    });
    return;
  } catch (error) {
    next(error);
  }
};

// 답변 수정
export const updateAnswer: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.session.user;
    const { answerId } = req.params;
    const { answer_content } = req.body;

    // 에러처리
    if (!user) {
      res.status(400).send({
        isSuccess: false,
        message: '로그인을 해주세요',
      });
      return;
    }
    if (!answerId) {
      res.status(400).send({
        isSuccess: false,
        message: '질문id를 입력해 주세요',
      });
      return;
    }
    if (!answer_content) {
      res.status(400).send({
        isSuccess: false,
        message: '내용을 입력해 주세요',
      });
      return;
    }

    const updateAnswerData = await updateAnswerDao(answerId, answer_content);

    const { insertId } = updateAnswerData as { insertId: number };

    if (!updateAnswerData) {
      res.status(500).send({
        isSuccess: false,
        message: '서버에 문제가 발생하였습니다.',
      });
      return;
    }

    res.status(200).send({
      isSuccess: true,
      id: insertId,
      message: '요청에 성공하였습니다.',
    });
    return;
  } catch (error) {
    next(error);
  }
};

// 답변 삭제
export const deleteAnswer: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.session.user;
    const { questionId } = req.params;

    // 에러처리
    if (!user) {
      res.status(400).send({
        isSuccess: false,
        message: '로그인을 해주세요',
      });
      return;
    }
    if (!questionId) {
      res.status(400).send({
        isSuccess: false,
        message: '질문id를 입력해 주세요',
      });
      return;
    }

    const updateAnswerData = await deleteAnswerDao(questionId);

    const { insertId } = updateAnswerData as { insertId: number };

    if (!updateAnswerData) {
      res.status(500).send({
        isSuccess: false,
        message: '서버에 문제가 발생하였습니다.',
      });
      return;
    }

    res.status(200).send({
      isSuccess: true,
      id: insertId,
      message: '요청에 성공하였습니다.',
    });
    return;
  } catch (error) {
    next(error);
  }
};
