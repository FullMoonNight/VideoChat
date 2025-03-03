const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = (app) => {
    app.use('/user-avatar', createProxyMiddleware({
            target: process.env.REACT_APP_DESTINATION_HOST + '/user-avatar',
            changeOrigin: true,
        }),
    )

    app.use('/room-image', createProxyMiddleware({
            target: process.env.REACT_APP_DESTINATION_HOST + '/room-image',
            changeOrigin: true,
        }),
    )
}