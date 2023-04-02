import * as path from "path";
import * as joi from 'joi';
import * as sharp from 'sharp';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import * as mime from 'mime-types';




export function storageDir() {
    return path.join(__dirname, '../../storage')
}

// export const storage = diskStorage({
//     destination: './uploads',
//     filename: (req, file, cb) => {
//         const uniqueSuffix = uuid();
//         const extension = mime.getExtension(file.mimetype);
//         const filename = `${sanitizeFilename(file.originalname.replace(`.${extension}`, ''))}-${uniqueSuffix}.${extension}`;
//
//         cb(null, filename);
//     },
// });

export const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    const allowedMaxSize = 1048576; // 1MB
    const { error } = joi.number().max(allowedMaxSize).validate(file.size);
    if (error) {
        cb(new Error(`File is too big, max size is ${allowedMaxSize / 1048576}MB`));
    } else if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new Error(`File type is not supported, allowed types are: ${allowedMimeTypes.join(', ')}`));
    } else {
        cb(null, true);
    }
};

// export function multerStorage(dest: string) {
//     return diskStorage({
//         destination: (req, file, cb) => cb(null, dest),
//         filename: (req, file, cb) =>
//             cb(null, `${uuid()}.${(mime as any).extensions[file.mimetype]}`),
//     });
// }

export function multerStorage(dest: string) {
    return diskStorage({
        destination: (req, file, cb) => cb(null, dest),
        filename: (req, file, cb) => {
            const extension = mime.extension(file.mimetype);
            const fileName = `${uuid()}${extension ? `.${extension}` : ''}`;
            cb(null, fileName);
        },
    });
}