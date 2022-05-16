// fileType 及其自定义守卫
export type fileType = 'css' | 'script'
export function isFileTypeEqualCss (param: any): param is 'css' {
  return param === 'css'
}