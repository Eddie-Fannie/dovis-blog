// 侧边栏分组的情况
// module.exports = [
//     {
//         title: '深入浅出JavaScript', // 侧边栏名称
//         path: '/basis/JavaScript/',
//         collapsable: false,
//         children: [
//             '/basis/JavaScript/正则RegExp',
//             '/basis/JavaScript/细谈this问题'
//         ]
//     },
//     {
//         title: '掌握Vue',
//         path: '/frame/Vue/',
//         collapsable: false,
//         children: [
//             '/frame/Vue/Vue的精髓--组件'
//         ]
//     }
// ]

// 不同页面不同侧边栏
module.exports = {
    '/basis/HTML/': [
        {
            title: 'HTML初级知识点',
            collapsable: false,
            children: [
                '/basis/HTML/html陌生知识点'
            ]
        }
    ],
    '/basis/CSS/': [
        {
            title: 'CSS知识点',
            collapsable: false,
            children: [
                '/basis/CSS/css基础知识点',
                '/basis/CSS/css命名规范',
                '/basis/CSS/布局基础'
            ]
        }
    ],
    '/basis/JavaScript/': [
        // '', /* /JavaScript/ */
        // '正则RegExp',
        // '细谈this问题'
        {
            title: 'JavaScript初级知识点',
            // path: '/basis/JavaScript/',
            collapsable: false,
            children: [
                '/basis/JavaScript/js基础知识',
                '/basis/JavaScript/正则RegExp',
                '/basis/JavaScript/细谈this问题',
                '/basis/JavaScript/作用域',
                '/basis/JavaScript/js的数组方法汇总'
            ]
        },
        {
            title: 'JavaScript中级知识点',
            collapsable: false,
            children: [
                '/basis/JavaScript/对象深浅拷贝',
                '/basis/JavaScript/js的一些内置对象方法汇总',
                '/basis/JavaScript/类和构造函数',
                '/basis/JavaScript/继承',
                '/basis/JavaScript/Js节流防抖'
            ]
        },
        {
            title: 'JavaScript高级知识点',
            collapsable: false,
            children: [
                '/basis/JavaScript/Event-Loop'
            ]
        }
    ],
    '/basis/ES6/': [
        {
            title: 'ES6初级知识点',
            collapsable: false,
            children: [
                '/basis/ES6/let和const'
            ]
        },
        {
            title: 'ES6中级知识点',
            collapsable: false,
            children: [
                '/basis/ES6/类',
                '/basis/ES6/ES6的继承'
            ]
        },
        {
            title: 'ES6高级知识点',
            collapsable: false,
            children: [
                '/basis/ES6/Proxy'
            ]
        }
    ],
    '/frame/Vue/': [
        {
            title: 'Vue初级知识点',
            // path: '/frame/Vue/',
            collapsable: false,
            children: [
                '/frame/Vue/Vue的精髓--组件'
            ]
        },
        {
            title: 'Vue高级知识点',
            collapsable: false,
            children: [
                '/frame/Vue/虚拟dom',
                '/frame/Vue/生成真实dom'
            ]
        }
    ],
    '/advanced/Browser/': [
        {
            title: '浏览器相关知识',
            collapsable: false,
            children: [
                '/advanced/Browser/浏览器缓存'
            ]
        }
    ],
    '/another/Git/': [
        {
            title: 'Git版本工具使用',
            collapsable: false,
            children: [
                '/another/Git/如何使用gitflow'
            ]
        }
    ],
    '/another/Working/': [
        {
            title: '工作项目遇到的问题',
            collapsable: false,
            children: [
                '/another/Working/工作遇到'
            ]
        }
    ],
    '/fulllink/Modularity/': [
        {
            title: 'CommonJs规范',
            collapsable: false,
            children: [
                '/fulllink/Modularity/CommonJs基础知识'
            ]
        }
    ],
    '/reading/': [
        {
            title: '前端书籍阅后笔记',
            collapsable: false,
            children: [
                '/reading/编写高质量Javascript的188个建议',
                '/reading/你不知道的js上卷'
            ]
        }
    ],
    '/interview/': [
        {
            title: 'HTML模块',
            collapsable: false,
            children: [
                '/interview/HTML面试考点'
            ]
        },
        {
            title: 'JS模块',
            collapsable: false,
            children: [
                '/interview/js问题'
            ]
        },
        {
            title: '项目模块',
            collapsable: false,
            children: [
                '/interview/项目考点'
            ]
        }
    ],
    '/algorithm/Stack-Queue/': [
        {
            title: '基础题',
            collapsable: false
        }
    ],
    '/algorithm/Array/': [
        {
            title: '基础题',
            collapsable: false,
            children: [
                '/algorithm/Array/两数之和',
                '/algorithm/Array/种花问题',
                '/algorithm/Array/卡牌组合'
            ]
        },
        {
            title: '中等题',
            collapsable: false,
            children: [
                '/algorithm/Array/格雷编码'
            ]
        }
    ],
    '/algorithm/String/': [
        {
            title: '基础题',
            collapsable: false,
            children: [
                '/algorithm/String/重复的子字符串'
            ]
        },
        {
            title: '中等题',
            collapsable: false,
            children: [
                '/algorithm/String/复原IP地址',
                '/algorithm/String/电话号码的字母组合'
            ]
        }
    ]
}