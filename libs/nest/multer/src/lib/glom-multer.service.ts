import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');

export const FILE_DEST = 'UPLOAD_FILES_DESTINATION';
@Injectable()
export class GlomMulterService implements MulterOptionsFactory {
  createMulterOptions(fileDest = './assets'): MulterModuleOptions {
    return {
      dest: fileDest,
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, fileDest);
        },
        filename: (req, file, callback) => {
          const now = new Date().toISOString();
          const fileName = file.originalname.split(' ');
          let finalName = fileName.join('_').replaceAll('-', '_').toLowerCase();
          finalName = `${now
            .replaceAll('-', '')
            .replaceAll(':', '')
            .replaceAll('.', '')}_${finalName}`;
          callback(null, finalName);
        },
      }),
      fileFilter(req, file, callback) {
        const supportedExtensions = [
          //images
          'jpg',
          '.png',
          '.jpeg',
          '.gif',
          '.bmp',
          //docs
          'ppt',
          '.pdf',
          '.csv',
          '.pptx',
          '.xslx',
          '.docx',
          //audios & videos
          '.mp3',
          '.mp4',
          '.webm',
          //archive files
          'zip',
          'rar',
          '7zip',
        ];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!supportedExtensions.includes(ext))
          callback(
            new BadRequestException(
              `${ext} is not supported. Resource extension must be one of the followings: ${supportedExtensions.join(
                ', '
              )}`
            ),
            false
          );
        callback(null, true);
      },
    };
  }
}
