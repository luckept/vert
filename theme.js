(function() {
  let BASE_PATH

  class ThemeClass {
    static pathConfig = {
      wiredTS: '/appearance/themes/vert/dist/'
    }

    /**
     * 装配 TS 文件
     * @param {string} sourceName 资源路径
     */
    static wiredTS(sourceName, type='script') {
      BASE_PATH = this.pathConfig.wiredTS
      this.createSourceEle(sourceName, BASE_PATH, type)
    }

    /**
     * 
     * @param {string} sourceName 资源名称
     * @param {string} BASE_PATH 资源根路径
     */
    static createSourceEle(sourceName, BASE_PATH, type, scriptID='vert', RegExp=/[^.]*$/) {
      let source
      if (type === 'script') {
        sourceName = BASE_PATH + sourceName.replace(RegExp, 'js')
        source = document.createElement("script")
        source.setAttribute("type", "module")
        source.setAttribute("src", sourceName)
      }
      source.setAttribute("id", scriptID)
      document.head.appendChild(source)
    }
  }

  ThemeClass.wiredTS('index.ts')
})()