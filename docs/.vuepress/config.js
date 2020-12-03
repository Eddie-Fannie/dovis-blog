let nav = require('./nav.js')
let sidebar = require('./sidebar')
module.exports = {
    title: 'Dovis\'s blog',
    description: '前端学习,天道酬勤',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
        ['link', { rel: 'icon', href: '/logo.jpeg' }], // 增加一个自定义的 favicon(网页标签的图标)
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['link', { rel: 'apple-touch-icon', href: '/logo.jpeg' }],
        ['link', { rel: 'mask-icon', href: '/logo.jpeg', color: '#3eaf7c' }],
        ['meta', { 'http-quiv': 'pragma', cotent: 'no-cache' }],
        ['meta', { 'http-quiv': 'expires', cotent: '0' }],
        ['meta', { 'http-quiv': 'pragma', cotent: 'no-cache, must-revalidate' }]
    ],
    // serviceWorker: true, // 是否开启 PWA
    base: '/dovis-blog/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        logo: '/logo.jpeg',
        nav: nav,
        sidebar: sidebar,
        sidebarDepth: 1, // 侧边栏显示2级,显示h2和h3标题，0则不显示
        displayAllHeaders: false, // 显示所有页面的标题链接
        collapsable: false
    },
    plugins: [
        '@vuepress/pwa', {
            serviceWorker: true,
            updatePopup: true
        },
        '@vuepress/back-to-top',
        'autobar'
    ]
    // plugins: {
    //     '@vuepress/pwa': {
    //         serviceWorker: true,
    //         updatePopup: {
    //             message: "New content is available.",
    //             buttonText: "Refresh"
    //         }
    //     },
    //     // '@vuepress/back-to-top'
    // }
};
