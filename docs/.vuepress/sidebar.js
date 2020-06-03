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
                '/basis/CSS/css命名规范'
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
                '/basis/JavaScript/正则RegExp',
                '/basis/JavaScript/细谈this问题',
                '/basis/JavaScript/类和构造函数'
            ]
        }
    ],
    '/frame/Vue/': [
        // '',
        // 'Vue的精髓--组件'
        {
            title: 'Vue初级知识点',
            // path: '/frame/Vue/',
            collapsable: false,
            children: [
                '/frame/Vue/Vue的精髓--组件'
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
                '/reading/编写高质量Javascript的188个建议'
            ]
        }
    ],
    '/interview/': [
        {
            title: 'HTML模块',
            collapsable: false,
            children: [
                '/interview/HTML面试考点',
                '/interview/项目考点'
            ]
        }
    ],
    '/algorithm/': [
        {
            title: '基础题',
            collapsable: false,
            children: [
                '/algorithm/Array/两数之和'
            ]
        }
    ]
}