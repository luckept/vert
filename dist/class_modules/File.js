var _a;
const fs = require('fs');
const path = require('path');
import { isFileTypeEqualCss } from '../utils/index.js';
export class File {
    // 文件处理器
    static fileHandler() {
        // css 文件自动引入
        this.autoFileImport('css');
        // css 文件监听
        this.batchSolveFileWatch('css');
    }
    // 批量处理文件监听
    static batchSolveFileWatch(fileType) {
        if (isFileTypeEqualCss(fileType)) {
            this.listDirFiles(fileType).forEach((relativePath) => {
                if (isFileTypeEqualCss(fileType)) {
                    this.fileWatcher(`${this.themeBasePath}/css_modules/`, relativePath);
                }
            });
        }
        else {
            // TODO
            console.log('JS 判断');
        }
    }
    // 包装内容为 import 的形式
    static packagingContent(fileName) {
        return fileName !== '' ? `@import url('./css_modules/${fileName}')` : '';
    }
    // 文件自动引入
    static autoFileImport(fileType) {
        if (isFileTypeEqualCss(fileType)) {
            const listCssfile = this.listDirFiles(fileType);
            // TODO 读取 index.css 文件内容, 做 diff 分析可能会用
            const indexCSSFileContent = fs.readFileSync(path.resolve(this.themeBasePath, 'index.css'), 'utf-8');
            // 处理覆盖 index.css 内容
            const rewriteContent = listCssfile.reduce((acc, cur) => (acc = acc.concat(`${this.packagingContent(cur)};`), acc), '');
            // 写入
            fs.writeFileSync(path.resolve(this.themeBasePath, 'index.css'), rewriteContent);
        }
        else {
            // TODO
            console.log('脚本相关判断');
        }
    }
    // 文件监听
    static fileWatcher(basePath, relativePath) {
        fs.watch(path.resolve(basePath, relativePath), () => {
            // 监听时观察当前的依赖是否和上次相同
            this.isDependChanged();
            // 刷新页面
            window.location.reload();
        });
    }
    // 判断当前的依赖是否和上次相同
    static isDependChanged() {
        const dirFiles = fs.readdirSync(`${this.themeBasePath}/css_modules/`);
        const mapCss_length = this.dependMap.get('css');
        const currentCss_length = dirFiles.length;
        if (mapCss_length !== currentCss_length) {
            // 目录树发生了增减，需要触发文件的重新监听和写入
            this.fileHandler();
        }
        else {
            // TODO: 做 diff
        }
    }
    // 读取文件目录内的文件
    static listDirFiles(fileType) {
        if (fileType === 'css') {
            const dirFiles = fs.readdirSync(`${this.themeBasePath}/css_modules/`);
            this.dependMap.set('css', dirFiles.length);
            return dirFiles;
        }
        // Script
        return fs.readdirSync(`${this.themeBasePath}/script_modules/`);
    }
}
_a = File;
File.themeID = 'vert';
File.themeBasePath = `/Users/luckept/Documents/SiYuan/conf/appearance/themes/${_a.themeID}/src`;
File.dependMap = new Map();
