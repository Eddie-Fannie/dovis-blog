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
            { text: '其他库原理解析', link: '/frame/AnotherPackage/' },
        ]
    },
    {
        text: '进阶分支', items: [
            {text: '前端性能', link: '/advanced/Performance/'},
            {text: '安全', link: '/advanced/Safety/'},
            {text: '浏览器', link: '/advanced/Browser/'}
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
            {text: '数据结构', items: [
                {text: '链表', link: '/algorithm/DataStructure/LinkedList/'},
                {text: '数组', link: '/algorithm/DataStructure/Array/'},
                {text: '栈与队列', link: '/algorithm/DataStructure/Stack-Queue/'},
                {text: '字符串', link: '/algorithm/DataStructure/String/'},
                {text: '树', link: '/algorithm/DataStructure/Tree/'}
            ]},
            {text: '基础算法', link: '/algorithm/BasicAlgorithm/'},
            {text: '算法思维', link: '/algorithm/AlgorithmicThinking/'},
            {text: '其他算法知识点', link: '/algorithm/Other/'},
            {text: '公司题库', link: '/algorithm/Company/'}
        ]
    },
    {
        text: '前端领域分支', items: [
            {text: '移动端', link: '/area/Mobile/'},
            {text: '可视化', link: '/area/Visualization/'},
            {text: 'SSR', link: '/area/SSR/'},
            {text: '前端监控', link: '/area/Monitor/'}
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
            {text: '包管理工具', link: '/another/PackageManager/'},
            {text: '计算机网络', link: '/another/Net/'},
            {text: '工作遇到的知识', link: '/another/Working/'}
        ]
    },
    {
        text: '趣识', items: [
            {text: 'Github', link: 'https://github.com/Eddie-Fannie'},
            {text: '阅享', link: '/reading/'},
            {text: '前端面试', link: '/interview/'},
            {text: '前端代码片段', link: '/coding/'},
            {text: '前端面试题汇总库', link: 'https://github.com/Eddie-Fannie/qd-interview-question/issues'}
        ]
    }
]