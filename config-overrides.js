const {override, fixBabelImports, addLessLoader} = require('customize-cra')
module.exports = override(
    //针对antd实现按需打包，根据import来打包(使用babel-plugin-import)
    fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',//自动打包相关的样式
    }),

    //使用less-loader对源码进行重新制定
    //addLessLoader({
        //javascriptEnabled: true,
       // modifyVars: {'@primary-color': '#1DA57A'},
       // }),
        
    );