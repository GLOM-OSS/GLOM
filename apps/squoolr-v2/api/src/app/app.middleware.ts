import { NestMiddleware } from '@nestjs/common';
import { decrypt } from '@glom/encrypter';
import { Request } from 'express';

export class AppMiddleware implements NestMiddleware {
  async use(request: Request, response: Response, next: (error?) => void) {
    if (typeof request.params === 'string') {
      // console.log('request.params...');
      request.params = decrypt(request.params);
    }
    if (typeof request.body === 'string') {
      // console.log('request.body...');
      request.body = decrypt(request.body);
    }
    if (typeof request.query.data === 'string') {
      // console.log('request.query...');
      request.query = decrypt(String(request.query));
    }

    next();
  }
}
