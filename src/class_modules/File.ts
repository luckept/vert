const fs = require('fs')
const path = require('path')
import { fileType, isFileTypeEqualCss } from '../utils/index.js'

export class File {
  static themeID = 'vert'
  static themeBasePath = `/Users/luckept/Documents/SiYuan/conf/appearance/themes/${this.themeID}/src`
  static dependMap = new Map()

  // 文件处理器
  static fileHandler() {
    // css 文件自动引入
    this.autoFileImport('css')
    // css 文件监听
    this.batchSolveFileWatch('css')
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
  static packagingContent(fileName: string) {
    return fileName !== '' ? `@import url('./css_modules/${fileName}')` : ''
  }

  // 文件自动引入
  static autoFileImport(fileType: fileType) {
    if (isFileTypeEqualCss(fileType)) {
      const listCssfile = this.listDirFiles(fileType)
      // TODO 读取 index.css 文件内容, 做 diff 分析可能会用
      // const indexCSSFileContent = fs.readFileSync(path.resolve(this.themeBasePath, 'index.css'), 'utf-8')
      // 处理覆盖 index.css 内容
      const rewriteContent = listCssfile.reduce((acc, cur) => 
        (acc = acc.concat(`${this.packagingContent(cur)};`), acc), '')
      // 写入
      fs.writeFileSync(path.resolve(this.themeBasePath, 'index.css'), rewriteContent)
    } else {
      // TODO
      console.log('脚本相关判断')
    }
  }

  // TODO OR NOT：考虑到实际情况不太会频繁触发事件，暂时不做防抖处理
  // 文件监听
  static fileWatcher(basePath: string, relativePath: string) {
    fs.watch(path.resolve(basePath, relativePath), () => {
      // 监听时观察当前的依赖是否和上次相同
      this.isDependChanged()
      // 刷新页面
      window.location.reload()
    })
  }

  // 判断当前的依赖是否和上次相同
  static isDependChanged() {
    const dirFiles = fs.readdirSync(`${this.themeBasePath}/css_modules/`)
    const mapCss_length = this.dependMap.get('css')
    const currentCss_length = dirFiles.length
    if(mapCss_length !== currentCss_length) {
      // 目录树发生了增减，需要触发文件的重新监听和写入
      this.fileHandler()
    } else {
      // TODO OR NOT: 本应做 diff 计算依赖文件是否真正发生改变，但考虑优先级较低，通常来说也不太会有【频繁修改文件名字的同时保持文件数量不变的情况】，暂时不做处理
      this.fileHandler()
    }
  }

  // 读取文件目录内的文件
  static listDirFiles(fileType: fileType): Array<string> {
    if (fileType === 'css') {
      const dirFiles = fs.readdirSync(`${this.themeBasePath}/css_modules/`)
      this.dependMap.set('css', dirFiles.length)
      return dirFiles
    }
    // Script
    return fs.readdirSync(`${this.themeBasePath}/script_modules/`);
  }
}