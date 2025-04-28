// src/common/middleware/csrf.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // For GET requests, we set the CSRF token in the response
    if (req.method === 'GET') {
      res.cookie('XSRF-TOKEN', req.csrfToken(), {
        httpOnly: false, // Client-side JavaScript needs to read this
        sameSite: 'strict',
        secure: process.env.STAGE === 'prod',
      });
    }
    next();
  }
}