import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ERR17 } from '../errors';
import path = require('path');

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      dest: './uploads',
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, './uploads');
        },
        filename: (req, file, callback) => {
          const now = new Date();
          console.log(req.files);
          const fileName = file.originalname.split(' ');
          let finalName = fileName.join('_').replace('-' || '-', '_').toLowerCase();
          finalName = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}_${now.getMilliseconds()}_${finalName}`;
          callback(null, finalName);
        },
      }),
      fileFilter(req, file, callback) {
        const supportedExtensions = [
          //images
          '.png',
          '.jpeg',
          '.gif',
          '.bmp',
          //docs
          '.pdf',
          '.csv',
          '.xsix',
          '.docx',
          //audios & videos
          '.mp3',
          '.mp4',
          '.webm',
        ];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!supportedExtensions.includes(ext))
          callback(
            new HttpException(
              JSON.stringify(ERR17(ext)),
              HttpStatus.BAD_REQUEST
            ),
            false
          );
        callback(null, true);
      },
    };
  }
}
