const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    lintOnSave: false,
    devServer: {
        // public: 'vector-set.nas.aidimedia.net:8080'
        open: true,
        host: 'localhost',
        port: 4200,
        https: false,
        //以上的ip和端口是我们本机的;下面为需要跨域的
        proxy: { //配置跨域
            '/api': {
                target: 'http://127.0.0.1:8000/api/', //这里后台的地址模拟的;应该填写你们真实的后台接口
                ws: true,
                changOrigin: true, //允许跨域
                pathRewrite: {
                    '^/api': '' //请求的时候使用这个api就可以
                }
            },
            '/user': {
                target: 'http://123.56.230.79:6060',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/user': '',
                }
            },
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    }
}
