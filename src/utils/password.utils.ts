import * as bcrypt from 'bcrypt';

export class PasswordUtils {
  static async checkPassword(
    passwordToCheck: string,
    passwordFromDb: string,
  ): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) =>
      bcrypt.compare(
        passwordToCheck,
        passwordFromDb,
        (err: Error, same: boolean) => {
          if (err) {
            reject(err);
          }

          resolve(same);
        },
      ),
    );
  }
}

// POD IPB
// export class PasswordUtils {
//     static async checkPassword(
//         passwordToCheck: string,
//         passwordFromDb: string,
//     ): Promise<boolean> {
//         return await new Promise<boolean>((resolve, reject) =>
//             bcrypt.compare(
//                 passwordToCheck,
//                 passwordFromDb.replace(/^\$2y/, '$2b'),
//                 (err: Error, same: boolean) => {
//                     if (err) {
//                         reject(err);
//                     }
//
//                     resolve(same);
//                 },
//             ),
//         );
//     }
// }


