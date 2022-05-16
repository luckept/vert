"use strict";
var fs = require('fs');
var path = require('path');
function isFileTypeEqualCss(param) {
    return param === 'css';
}
var Main = /** @class */ (function () {
    function Main() {
    }
    Main.exec = function () {
        console.log("Hello Vert");
        // 文件自动装配
        this.fileHandler();
    };
    // 文件处理器
    Main.fileHandler = function () {
        // css 文件自动引入
        this.autoFileImport('css');
        // css 文件监听
        this.batchSolveFileWatch('css');
    };
    // 批量处理文件监听
    Main.batchSolveFileWatch = function (fileType) {
        var _this = this;
        if (isFileTypeEqualCss(fileType)) {
            this.listDirFiles(fileType).forEach(function (relativePath) {
                if (isFileTypeEqualCss(fileType)) {
                    _this.fileWatcher("".concat(_this.themeBasePath, "/css_modules/"), relativePath);
                }
            });
        }
        else {
            // TODO
            console.log('JS 判断');
        }
    };
    // 包装内容为 import 的形式
    Main.packagingContent = function (fileName) {
        return fileName !== '' ? "@import url('./css_modules/".concat(fileName, "')") : '';
    };
    // 文件自动引入
    Main.autoFileImport = function (fileType) {
        var _this = this;
        if (isFileTypeEqualCss(fileType)) {
            var listCssfile = this.listDirFiles(fileType);
            // 读取 index.css 文件内容
            var indexCSSFileContent = fs.readFileSync(path.resolve(this.themeBasePath, 'index.css'), 'utf-8');
            // 处理覆盖 index.css 内容
            var rewriteContent = listCssfile.reduce(function (acc, cur) {
                return (acc = acc.concat("".concat(_this.packagingContent(cur), ";")), acc);
            }, '');
            // (acc = `${acc}`.concat(`${cur};`), acc), '')
            // 写入
            fs.writeFileSync(path.resolve(this.themeBasePath, 'index.css'), rewriteContent);
        }
        else {
            // TODO
            console.log('脚本相关判断');
        }
    };
    // 文件监听
    Main.fileWatcher = function (basePath, relativePath) {
        var _this = this;
        fs.watch(path.resolve(basePath, relativePath), function () {
            // TODO: 监听时观察当前的依赖是否和上次相同
            _this.fileHandler();
            // 刷新页面
            window.location.reload();
        });
    };
    // 读取文件目录内的文件
    Main.listDirFiles = function (fileType) {
        if (fileType === 'css') {
            var dirFiles = fs.readdirSync("".concat(this.themeBasePath, "/css_modules/"));
            var mapCss_length = this.dependMap.get('css');
            var currentCss_length = dirFiles.length;
            if (mapCss_length !== currentCss_length) {
                // 目录树发生了增减，需要触发文件的重新监听和写入
            }
            else {
                // TODO: 做 diff
            }
            this.dependMap.set('css', dirFiles.length);
            return dirFiles;
        }
        // Script
        return fs.readdirSync("".concat(this.themeBasePath, "/script_modules/"));
    };
    var _a;
    _a = Main;
    Main.themeID = 'vert';
    Main.themeBasePath = "/Users/luckept/Documents/SiYuan/conf/appearance/themes/".concat(_a.themeID, "/src");
    Main.dependMap = new Map();
    return Main;
}());
Main.exec();
