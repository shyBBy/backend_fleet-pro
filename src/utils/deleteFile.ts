import fs from "fs";
import path from "path";
import {storageDir} from "./storage";

export const deleteFile = (fileName: string, fileDir: string) => {
    fs.unlinkSync(
        path.join(storageDir(), fileDir, fileName)
    );
}