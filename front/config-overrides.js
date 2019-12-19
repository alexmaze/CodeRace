const path = require("path")
const { override, fixBabelImports, addLessLoader, addWebpackAlias } = require('customize-cra');

const proxyApi = {
  '/api': {
    target: 'http://localhost:8080', // prod
    changeOrigin: true,
    secure: false
  }
}

module.exports = {
  webpack: override(
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        '@primary-color': '#28a745',
        "@border-radius-base": "4px",
        "@border-radius-sm": "2px"
      },
    }),
    addWebpackAlias({
      ["@"]: path.resolve(__dirname, "src")
    })
  ),
  devServer: configFunction => (proxy, allowedHost) => {
    proxy = process.env.NODE_ENV === 'development' ? proxyApi : null
    // allowedHost： 添加额外的地址
    const config = configFunction(proxy, allowedHost)
    return config
  }
}
