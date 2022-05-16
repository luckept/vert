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
    static wiredTS(sourceName) {
      BASE_PATH = this.pathConfig.wiredTS
      this.createSourceEle(sourceName, BASE_PATH)
    }

    /**
     * 
     * @param {string} sourceName 资源名称
     * @param {string} BASE_PATH 资源根路径
     */
    static createSourceEle(sourceName, BASE_PATH, scriptID='vert', RegExp=/[^.]*$/) {
      sourceName = BASE_PATH + sourceName.replace(RegExp, 'js')
      const source = document.createElement("script")
      source.setAttribute("src", sourceName)
      source.setAttribute("type", "module")
      source.setAttribute("id", scriptID)
      document.head.appendChild(source)
    }
  }

  ThemeClass.wiredTS('index.ts')
})()