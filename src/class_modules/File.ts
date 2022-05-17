const fs = require('fs')
const path = require('path')
import { fileType, isFileTypeEqualCss } from '../utils/index.js'

export class File {
  static themeID = 'vert'
  static themeBasePath = `/Users/luckept/Documents/SiYuan/conf/appearance/themes/${this.themeID}/src`
  static dependMap = new Map()
  static isOpenDirWatch = false

  // 文件处理器
  static fileHandler() {
    // css 文件自动 @import
    this.autoFileImport('css')
    // css 文件监听并执行页面刷新操作
    this.batchSolveFileWatch('css')
    // css 目录监听
    this.watchCssDir()
  }

  // 文件自动引入
  static autoFileImport (fileType: fileType) {
    if (isFileTypeEqualCss(fileType)) {
      // css 文件自动引入
      const rewriteContent = this.autoFileImportContentResolve('css')
      // 写入 index 文件
      fs.writeFileSync(path.resolve(this.themeBasePath, 'index.css'), rewriteContent)
    } else {
      // TODO OR NOT：可能存在的拓展
    }
  }

  // css 目录监听
  static watchCssDir() {
    if (!this.isOpenDirWatch) {
      this.isOpenDirWatch = true
      // 测试文件夹监听
      fs.watch(path.resolve(`${this.themeBasePath}/css_modules/`), () => {
        this.fileHandler()
      })
    }
  }

  // 批量处理文件监听
  static batchSolveFileWatch(fileType: fileType) {
    if (isFileTypeEqualCss(fileType)) {
      this.listDirFiles(fileType).forEach((relativePath) => {
        if (isFileTypeEqualCss(fileType)) {
          this.fileWatcher(`${this.themeBasePath}/css_modules/`, relativePath)
        } 
      })
    } else {
      // TODO
      console.log('JS 判断')
    }
  }

  // 包装内容为 import 的形式
  static packagingContent(fileName: string, furtherPath: string) {
    // 考虑到有可能先创建文件夹再创建 css 文件，且通常不会有 .css.css 的命名方法，所以这里就不使用正则了，默认 css 模块下的文件夹名不能含有 . 
    if(fileName.endsWith('.css')) {
      return fileName !== '' ? furtherPath === '' ? `@import url('./css_modules/${fileName}');` : `@import url('./css_modules/${furtherPath}/${fileName}');` : ''
    } else if (fileName.indexOf('.') !== -1) {
      // 可能他是一个非 css 也非目录的其他文件，此时应返回空字符串并给予提示
      console.error('在 css 模块中错误创建了非 css 文件')
      return ''
    }
    // 说明此时为文件夹，需要进一步递归
    return this.autoFileImportContentResolve('css', fileName)
  }

  // 文件自动引入路径拼接处理
  static autoFileImportContentResolve(fileType: fileType, furtherPath: string=''): string | undefined {
    if (isFileTypeEqualCss(fileType)) {
      const listCssfile = this.listDirFiles(fileType, furtherPath)
      // 处理覆盖 index.css 内容
      return listCssfile.reduce((acc, cur) => 
        (acc = acc.concat(`${this.packagingContent(cur, furtherPath)}`), acc), '')
    } else {
      // TODO
      console.log('脚本相关判断')
    }
  }

  // TODO OR NOT：考虑到实际情况不太会频繁触发事件，暂时不做防抖处理
  // 文件监听
  static fileWatcher(basePath: string, relativePath: string) {
    fs.watch(path.resolve(basePath, relativePath), () => {
      // 刷新页面
      window.location.reload()
    })
  }

  /**
   * 读取文件目录内的文件
   * @param fileType 
   * @param furtherPath 为了上面的递归来使用
   * @returns 
   */
  static listDirFiles(fileType: fileType, furtherPath: string=''): Array<string> {
    if (fileType === 'css') {
      const dirFiles = fs.readdirSync(path.resolve(`${this.themeBasePath}/css_modules/`, furtherPath))
      this.dependMap.set('css', dirFiles.length)
      return dirFiles
    }
    // Script
    return fs.readdirSync(`${this.themeBasePath}/script_modules/`);
  }
}