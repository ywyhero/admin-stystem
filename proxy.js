const app = require('express')();
const proxy = require('http-proxy-middleware');
app.use('/v1',
    proxy({
        target: 'http://47.52.236.134:3389',
        changeOrigin: true,
        pathRewrite: {
            '^/v1': '/v1'
        }
    })
)

app.listen(63342)