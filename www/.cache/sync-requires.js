// prefer default export if available
const preferDefault = m => m && m.default || m


exports.layouts = {
  "layout---index": preferDefault(require("/Users/jason/src/react-formal/www/.cache/layouts/index.js"))
}

exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/jason/src/react-formal/www/.cache/dev-404-page.js")),
  "component---src-pages-index-js": preferDefault(require("/Users/jason/src/react-formal/www/src/pages/index.js"))
}

exports.json = {
  "layout-index.json": require("/Users/jason/src/react-formal/www/.cache/json/layout-index.json"),
  "dev-404-page.json": require("/Users/jason/src/react-formal/www/.cache/json/dev-404-page.json"),
  "layout-index.json": require("/Users/jason/src/react-formal/www/.cache/json/layout-index.json"),
  "index.json": require("/Users/jason/src/react-formal/www/.cache/json/index.json")
}