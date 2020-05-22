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
                '/basis/JavaScript/细谈this问题'
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
    ]
}