import { File } from "./class_modules/index.js";
// 是否是开发环境
const isDevelopment = true;
class Main {
    static exec(isDevelopment) {
        if (isDevelopment) {
            // 文件自动装配
            File.fileHandler();
        }
        console.log(`Hello Vert`);
    }
}
Main.exec(isDevelopment);
