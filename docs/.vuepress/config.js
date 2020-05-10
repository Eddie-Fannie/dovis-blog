let nav = require('./nav.js')
let sidebar = require('./sidebar')
module.exports = {
    title: 'Dovis\'s blog',
    description: '前端学习,天道酬勤',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
        ['link', { rel: 'icon', href: ' http://wx.qlogo.cn/mmopen/4K4oWQStIpFZgsNhspicuR2b62TaWEgFp9iaUDwKGOiaxNDQwKkWJ7RgqNjx2Ctib3g1oz69dUdhc1Ilf8vIs6JzJ0Ve9oFZWyiaic/64' }], // 增加一个自定义的 favicon(网页标签的图标)
        // ['link', { rel: 'manifest', href: ' http://wx.qlogo.cn/mmopen/4K4oWQStIpFZgsNhspicuR2b62TaWEgFp9iaUDwKGOiaxNDQwKkWJ7RgqNjx2Ctib3g1oz69dUdhc1Ilf8vIs6JzJ0Ve9oFZWyiaic/64' }],
        ['link', { rel: 'apple-touch-icon', href: ' http://wx.qlogo.cn/mmopen/4K4oWQStIpFZgsNhspicuR2b62TaWEgFp9iaUDwKGOiaxNDQwKkWJ7RgqNjx2Ctib3g1oz69dUdhc1Ilf8vIs6JzJ0Ve9oFZWyiaic/64' }],
        ['link', { rel: 'mask-icon', href: ' http://wx.qlogo.cn/mmopen/4K4oWQStIpFZgsNhspicuR2b62TaWEgFp9iaUDwKGOiaxNDQwKkWJ7RgqNjx2Ctib3g1oz69dUdhc1Ilf8vIs6JzJ0Ve9oFZWyiaic/64', color: '#3eaf7c' }],
        ['meta', { 'http-quiv': 'pragma', cotent: 'no-cache' }],
        ['meta', { 'http-quiv': 'expires', cotent: '0' }],
        ['meta', { 'http-quiv': 'pragma', cotent: 'no-cache, must-revalidate' }]
    ],
    serviceWorker: true, // 是否开启 PWA
    base: '/dovis-blog/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        logo: 'http://wx.qlogo.cn/mmopen/4K4oWQStIpFZgsNhspicuR2b62TaWEgFp9iaUDwKGOiaxNDQwKkWJ7RgqNjx2Ctib3g1oz69dUdhc1Ilf8vIs6JzJ0Ve9oFZWyiaic/64',
        nav: nav,
        sidebar: sidebar,
        sidebarDepth: 2, // 侧边栏显示2级
    }
};

function getSidebar(barName) {
    const sidebar = {
        frame: [
            '/frame/',
            '/frame/Vue/',
            '/frame/React/',
        ],
        basis: [

        ]
    }
    return sidebar[barName]
}
