// config
const Prefix = 'appearance/themes/vert/'
const project_config = {
  scripts_main: Prefix + 'packages/dist/index.js',
  styles_main: Prefix + 'styles/index.css'
}

// init
class Main {
  static main = new Main()
  exec() {
    this.doImport()
  } 
  doImport() {
    const fullPathConfig = this.getFullPath(project_config)
    this.loadSource(fullPathConfig)
  }
  getFullPath(config) {
    const fullPathConfig = {}
    Object.keys(config).forEach(key => {
      fullPathConfig[key] = `./${config[key]}`
    })
    return fullPathConfig
  }
  loadSource(fullPathConfig) {
    Object.keys(fullPathConfig).forEach(key => {
      this.load(fullPathConfig[key])
    })
  }
  load(path, source=null) {
    const path_split_by_dot = path.split('.')
    const file_type = path_split_by_dot[path_split_by_dot.length - 1]
    if (file_type === 'js') {
      source = document.createElement("script")
      source.setAttribute("type", "module")
      source.setAttribute("src", path)
    } else if (file_type === 'css') {
      source = document.createElement("link")
      source.setAttribute("rel", "stylesheet")
      source.setAttribute("type", "text/css")
      source.setAttribute("href", path)
    }
    document.head.appendChild(source)
  }
}

Main.main.exec()
