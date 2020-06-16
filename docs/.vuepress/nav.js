module.exports = [
    { text: '主页', link: '/' },
    {
        text: '前端基础', items: [
            { text: 'HTML', link: '/basis/HTML/' },
            { text: 'CSS', link: '/basis/CSS/' },
            { text: 'JavaScript', link: '/basis/JavaScript/' },
            { text: 'ES6', link: '/basis/ES6/' },
        ]
    },
    {
        text: '框架/库', items: [
            { text: 'Vue', link: '/frame/Vue/' },
            { text: 'React', link: '/frame/React/' },
            { text: 'Element-ui', link: '/frame/Element/' },
        ]
    },
    {
        text: '进阶分支', items: [
            {text: '前端性能', link: '/advanced/Performance/'},
            {text: '安全', link: '/advanced/Safety/'}
        ]
    },
    {
        text: '全链路分支', items: [
            {text: '模块化', link: '/fulllink/Modularity/'},
            {text: '构建工具', link: '/fulllink/BuildingTools/'},
            {text: '语言增强',link: '/fulllink/LangAdvanced/'}
        ]
    },
    {
        text: '算法&数据结构', items: [
            {text: '数组', link: '/algorithm/Array/'},
            {text: '字符串', link: '/algorithm/String/'}
        ]
    },
    {
        text: '前端领域分支', items: [
            {text: '移动端', link: '/area/Mobile/'},
            {text: '可视化', link: '/area/Visualization/'},
            {text: 'SSR', link: '/area/SSR/'}
        ]
    },
    {
        text: '服务端分支', items: [
            {text: 'Nodejs', link: '/service/Node/'},
            {text: 'web服务器', link: '/service/Server/'}
        ]
    },
    { 
        text: '其他知识', items: [
            {text: 'Git版本工具', link: '/another/Git/'},
            {text: '计算机网络', link: '/another/Net/'},
            {text: '工作遇到的知识', link: '/another/Working/'}
        ] 
    },
    { 
        text: '趣识', items: [
            {text: 'Github', link: 'https://github.com/Eddie-Fannie'},
            {text: '阅享', link: '/reading/'},
            {text: '前端面试', link: '/interview/'},
            {text: '前端面试题汇总库', link: 'https://github.com/Eddie-Fannie/qd-interview-question/issues'}
        ]
    }
]