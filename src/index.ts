import { File } from "./class_modules/index.js"

// 是否是开发环境
const isDevelopment = false

class Main {

  static exec(isDevelopment: boolean) {
    if (isDevelopment) {
      // 文件自动装配
      File.fileHandler()
    }
    console.log(`Hello Vert`)
  }
}

Main.exec(isDevelopment)