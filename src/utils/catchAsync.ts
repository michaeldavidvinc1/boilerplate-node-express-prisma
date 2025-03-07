import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err: unknown) => {
    if (err instanceof Error) {
      next(err); 
    } else {
      next(new Error('An unknown error occurred'));
    }
  });
};

export default catchAsync;