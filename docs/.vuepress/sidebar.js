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
        {
            title: 'JavaScript初级知识点',
            collapsable: false,
            children: [
                '/basis/JavaScript/js基础知识',
                '/basis/JavaScript/正则RegExp',
                '/basis/JavaScript/细谈this问题',
                '/basis/JavaScript/作用域',
                '/basis/JavaScript/js数组的一些常规问题',
                '/basis/JavaScript/js的数组方法汇总',
                '/basis/JavaScript/ajax原生',
                '/basis/JavaScript/前端DOM操作知识点',
                '/basis/JavaScript/js的一些函数问题'
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
                '/basis/JavaScript/Js节流防抖',
                '/basis/JavaScript/事件机制',
                '/basis/JavaScript/web的一些API',
                '/basis/JavaScript/js的错误处理',
                '/basis/JavaScript/解析对象原始值转换',
                '/basis/JavaScript/高阶函数'
            ]
        },
        {
            title: 'JavaScript高级知识点',
            collapsable: false,
            children: [
                '/basis/JavaScript/Event-Loop',
                '/basis/JavaScript/设计模式',
                '/basis/JavaScript/前端二进制'
            ]
        }
    ],
    '/basis/ES6/': [
        {
            title: 'ES6初级知识点',
            collapsable: false,
            children: [
                '/basis/ES6/let和const',
                '/basis/ES6/ES6数据类型新增的属性和方法'
            ]
        },
        {
            title: 'ES6中级知识点',
            collapsable: false,
            children: [
                '/basis/ES6/类',
                '/basis/ES6/ES6的继承',
                '/basis/ES6/Symbol',
                '/basis/ES6/Map数据结构',
                '/basis/ES6/Set数据结构',
            ]
        },
        {
            title: 'ES6高级知识点',
            collapsable: false,
            children: [
                '/basis/ES6/Proxy',
                '/basis/ES6/Promise对象',
                '/basis/ES6/Generator函数',
                '/basis/ES6/Iterator和for...of循环'
            ]
        }
    ],
    '/frame/Vue/': [
        {
            title: 'Vue初级知识点',
            // path: '/frame/Vue/',
            collapsable: false,
            children: [
                '/frame/Vue/Vue的精髓--组件',
                '/frame/Vue/vue中的通信',
                '/frame/Vue/vue中注意的点',
                '/frame/Vue/vue指令的奥秘'
            ]
        },
        {
            title: 'Vue高级知识点',
            collapsable: false,
            children: [
                '/frame/Vue/响应式原理',
                '/frame/Vue/虚拟dom',
                '/frame/Vue/生成真实dom',
                '/frame/Vue/vue生命周期',
                '/frame/Vue/初始化状态',
                '/frame/Vue/模板编译',
                '/frame/Vue/Vuex原理',
                '/frame/Vue/vue的api原理',
                '/frame/Vue/vue的异步更新原理'
            ]
        },
        {
            title: 'Vue相关生态插件原理',
            collapsable: false,
            children: [
                '/frame/Vue/vue-router',
            ]
        },
        {
            title: 'Vue3相关原理',
            collapsable: false,
            children: [
                '/frame/Vue/vue3相关',
            ]
        }
    ],
    '/frame/React/': [
        {
            title: 'React初级知识点',
            collapsable: false,
            children: [
                '/frame/React/React入门',
            ]
        }
    ],
    '/frame/AnotherPackage/': [
        {
            title: '一些知名库原理学习',
            collapsable: false,
            children: [
                '/frame/AnotherPackage/bluebird',
            ]
        }
    ],
    '/advanced/Browser/': [
        {
            title: '浏览器相关知识',
            collapsable: false,
            children: [
                '/advanced/Browser/浏览器缓存',
                '/advanced/Browser/浏览器渲染',
                '/advanced/Browser/浏览器跨域',
                '/advanced/Browser/浏览器存储',
                '/advanced/Browser/前端路由',
                '/advanced/Browser/浏览器插件开发',
            ]
        }
    ],
    '/advanced/Performance/': [
        {
            title: '前端性能关知识',
            collapsable: false,
            children: [
                '/advanced/Performance/前端优化',
                '/advanced/Performance/高性能优化十万条数据',
                '/advanced/Performance/vue实现一个图片懒加载指令',
                '/advanced/Performance/慕课前端性能课程',
                '/advanced/Performance/页面性能的方法',
                '/advanced/Performance/使用ServiceWorker提升性能',
                '/advanced/Performance/协同项目优化'
            ]
        }
    ],
    '/advanced/Safety/': [
        {
            title: '前端安全模块',
            collapsable: false,
            children: [
                '/advanced/Safety/前端安全基础知识',
            ]
        }
    ],
    '/service/Server/': [
        {
            title: 'nginx相关知识',
            collapsable: false,
            children: [
                '/service/Server/nginx'
            ]
        }
    ],
    '/service/Node/': [
        {
            title: 'Node基础相关',
            collapsable: false,
            children: [
                '/service/Node/node文件的调试',
                '/service/Node/node基础知识',
            ]
        },
        {
            title: 'express框架学习',
            collapsable: false,
            children: [
                '/service/Node/express框架学习'
            ]
        }
    ],
    '/another/Git/': [
        {
            title: 'Git版本工具使用',
            collapsable: false,
            children: [
                '/another/Git/如何使用gitflow',
                '/another/Git/工作中使用git',
            ]
        }
    ],
    '/another/PackageManager/': [
        {
            title: '你不知道的包管理工具',
            collapsable: false,
            children: [
                '/another/PackageManager/yarn',
            ]
        }
    ],
    '/another/Net/': [
        {
            title: '计算机网络知识汇总',
            collapsable: false,
            children: [
                '/another/Net/DNS初识',
                '/another/Net/TCP三次握手',
                '/another/Net/HTTP',
                '/another/Net/WebSocket',
                '/another/Net/一些小知识点',
                '/another/Net/HTTPS',
                '/another/Net/HTTP协议原理'
            ]
        }
    ],
    '/another/Working/': [
        {
            title: '工作项目遇到的问题',
            collapsable: false,
            children: [
                '/another/Working/工作遇到',
                '/another/Working/vue'
            ]
        },
        {
            title: '做过的项目',
            collapsable: false,
            children: [
                '/another/Working/发布一个npm包'
            ]
        },
        {
            title: '写过的文档（外部链接）',
            collapsable: false,
            children: [
                '/another/Working/工作时的技术分享'
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
        },
        {
            title: 'AMD和CMD',
            collapsable: false,
            children: [
                '/fulllink/Modularity/AMD和CMD'
            ]
        },
        {
            title: 'ES6规范',
            collapsable: false,
            children: [
                '/fulllink/Modularity/ES6'
            ]
        }
    ],
    '/fulllink/BuildingTools/': [
        {
            title: 'Webpack部分',
            collapsable: false,
            children: [
                '/fulllink/BuildingTools/初识webpack',
                '/fulllink/BuildingTools/webpack技巧',
                '/fulllink/BuildingTools/webpack热更新',
                '/fulllink/BuildingTools/webpack一些原理',
                '/fulllink/BuildingTools/webpack一些loader原理',
                '/fulllink/BuildingTools/webpack新技术点',
                '/fulllink/BuildingTools/webpack模块联邦',
                '/fulllink/BuildingTools/webpack热更新原理',
            ]
        },
        {
            title: 'Vite部分',
            collapsable: false,
            children: [
                '/fulllink/BuildingTools/vite掘金小册子学习',
            ]
        }
    ],
    '/fulllink/LangAdvanced/': [
        {
            title: 'TypeScript部分',
            collapsable: false,
            children: [
                '/fulllink/LangAdvanced/Typescript基础',
                '/fulllink/LangAdvanced/Typescript官方文档学习',
                '/fulllink/LangAdvanced/Typescript配置项悉知',
                '/fulllink/LangAdvanced/Typescript高阶',
            ]
        }
    ],
    '/coding/' : [
        {
            title: "JavaScript模块",
            collapsable: false,
            children: [
                '/coding/JavaScript/手写bind等',
                '/coding/JavaScript/手写new',
                '/coding/JavaScript/牛客网评测',
                '/coding/JavaScript/手动实现一个深拷贝',
                '/coding/JavaScript/实现一个Promise',
                '/coding/JavaScript/手写instanceof',
                '/coding/JavaScript/封装JSONP',
                '/coding/JavaScript/用异步思想实现东西',
                '/coding/JavaScript/实现一个eventEmitter',
                '/coding/JavaScript/其他api的实现'
            ]
        },
        {
            title: "CSS模块",
            collapsable: false,
            children: [
                '/coding/CSS/一些css场景实现'
            ]
        },
        {
            title: 'Vue模块',
            collapsable: false,
            children: [
                '/coding/Vue/手写vue相关'
            ]
        }
    ],
    '/reading/': [
        {
            title: '前端书籍阅后笔记',
            collapsable: false,
            children: [
                '/reading/编写高质量Javascript的188个建议',
                '/reading/你不知道的js上卷',
                '/reading/web性能实战',
                '/reading/深入浅出Webpack',
                '/reading/React实战',
                '/reading/Git从入门到精通'
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
            title: 'CSS模块',
            collapsable: false,
            children: [
                '/interview/css常问面试题'
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
            title: 'Vue模块',
            collapsable: false,
            children: [
                '/interview/vue相关问题'
            ]
        },
        {
          title: '构建工具模块',
          collapsable: false,
          children: [
              '/interview/构建工具'
          ]  
        },
        {
            title: '其他模块',
            collapsable: false,
            children: [
                '/interview/其他问题'
            ]
        },
        {
            title: '项目模块',
            collapsable: false,
            children: [
                '/interview/项目考点',
                '/interview/🦐项目总结'
            ]
        },
        {
            title: '面试情况',
            collapsable: false,
            children: [
                '/interview/面试情况'
            ]
        }
    ],
    '/algorithm/Stack-Queue/': [
        {
            title: '基础题',
            collapsable: false
        }
    ],
    '/algorithm/AlgorithmicThinking/': [
        {
            title: '滑动窗口思想',
            collapsable: false,
            children: [
                '/algorithm/AlgorithmicThinking/SlidingWindow/无重复字符',
                '/algorithm/AlgorithmicThinking/SlidingWindow/滑动窗口最大值',
                '/algorithm/AlgorithmicThinking/SlidingWindow/重复的DNA序列'
            ]
        },
        {
            title: '递归思想',
            collapsable: false,
            children: [
                '/algorithm/AlgorithmicThinking/Recursion/格雷编码',
                '/algorithm/AlgorithmicThinking/Recursion/复原IP地址',
                '/algorithm/AlgorithmicThinking/Recursion/斐波那契数列'
            ]
        },
        {
            title: '回溯思想',
            collapsable: false,
            children: [
                '/algorithm/AlgorithmicThinking/Recall/电话号码的字母组合',
                '/algorithm/AlgorithmicThinking/Recall/括号生成',
                '/algorithm/AlgorithmicThinking/Recall/组合总和',
                '/algorithm/AlgorithmicThinking/Recall/面试题0808'
            ]
        },
        {
            title: '动态规划',
            collapsable: false,
            children: [
                '/algorithm/AlgorithmicThinking/DynamicProgramming/最长单词',
                '/algorithm/AlgorithmicThinking/DynamicProgramming/青蛙跳台阶',
                '/algorithm/AlgorithmicThinking/DynamicProgramming/括号生成',
                '/algorithm/AlgorithmicThinking/DynamicProgramming/打家劫舍',
                '/algorithm/AlgorithmicThinking/DynamicProgramming/买卖股票最佳时机',
                '/algorithm/AlgorithmicThinking/DynamicProgramming/连续数列',
                '/algorithm/AlgorithmicThinking/DynamicProgramming/判断子序列',
                '/algorithm/AlgorithmicThinking/DynamicProgramming/使用最小花费爬楼梯',
                '/algorithm/AlgorithmicThinking/DynamicProgramming/除数博弈',
                '/algorithm/AlgorithmicThinking/DynamicProgramming/丑数'
            ]
        },
        {
            title: '双指针',
            collapsable: false,
            children: [
                '/algorithm/AlgorithmicThinking/TwoPointer/盛最多水的容器'
            ]
        }
    ],
    '/algorithm/BasicAlgorithm/': [
        {
            title: '二分查找',
            collapsable: false,
            children: [
                '/algorithm/BasicAlgorithm/BinarySearch/卡牌组合',
                '/algorithm/BasicAlgorithm/BinarySearch/旋转数组的最小数字',
                '/algorithm/BasicAlgorithm/BinarySearch/x的平方根',
                '/algorithm/BasicAlgorithm/BinarySearch/在排序数组中查找数字 I',
                '/algorithm/BasicAlgorithm/BinarySearch/0~n-1中缺失的数字',
                '/algorithm/BasicAlgorithm/BinarySearch/有序数组两数之和'
            ]
        },
        {
            title: '散列查找（哈希表）',
            collapsable: false,
            children: [
                '/algorithm/BasicAlgorithm/HashTable/两数之和',
                '/algorithm/BasicAlgorithm/HashTable/第一个只出现一次的字符',
                '/algorithm/BasicAlgorithm/HashTable/有效的字母异位词',
                '/algorithm/BasicAlgorithm/HashTable/两个数组的交集'
            ]
        },
        {
            title: '排序',
            collapsable: false,
            children: [
                '/algorithm/BasicAlgorithm/Sort/把数组排成最小的数'
            ]
        },
    ],
    '/algorithm/DataStructure/Array/': [
        {
            title: '基础题',
            collapsable: false,
            children: [
                '/algorithm/DataStructure/Array/种花问题',
                '/algorithm/DataStructure/Array/比较字符串最小字母出现频次',
                '/algorithm/DataStructure/Array/词典中最长的单词',
                '/algorithm/DataStructure/Array/最大数',
                '/algorithm/DataStructure/Array/最小的K个数',
                '/algorithm/DataStructure/Array/分糖果',
                '/algorithm/DataStructure/Array/用两个栈实现队列',
                '/algorithm/DataStructure/Array/数组中重复的数字'
            ]
        },
        {
            title: '中等题',
            collapsable: false,
            children: [
                '/algorithm/DataStructure/Array/求众数',
                '/algorithm/DataStructure/Array/有效三角形的个数'
            ]
        }
    ],
    '/algorithm/DataStructure/Stack-Queue/': [
        {
            title: '基础题',
            collapsable: false,
            children: [
               '/algorithm/DataStructure/Stack-Queue/翻转字符串',
               '/algorithm/DataStructure/Stack-Queue/有效的括号'
            ]
        },
        {
            title: '中等题',
            collapsable: false,
            children: [
               
            ]
        }
    ],
    '/algorithm/DataStructure/String/': [
        {
            title: '基础题',
            collapsable: false,
            children: [
                '/algorithm/DataStructure/String/最长公共前缀',
                '/algorithm/DataStructure/String/重复的子字符串',
                '/algorithm/DataStructure/String/同构字符串'
            ]
        },
        {
            title: '中等题',
            collapsable: false,
            children: [
                '/algorithm/DataStructure/String/大数相乘',
                '/algorithm/DataStructure/String/无重复的最长字符串'
            ]
        }
    ],
    '/algorithm/DataStructure/LinkedList/': [
        {
            title: '基础题',
            collapsable: false,
            children: [
                '/algorithm/DataStructure/LinkedList/从尾到头打印链表',
                '/algorithm/DataStructure/LinkedList/两个链表第一个公共节点',
                '/algorithm/DataStructure/LinkedList/移交链表元素',
                '/algorithm/DataStructure/LinkedList/反转链表',
                '/algorithm/DataStructure/LinkedList/删除链表的结点',
                '/algorithm/DataStructure/LinkedList/链表中倒数第k个节点',
                '/algorithm/DataStructure/LinkedList/合并两个有序链表',
                '/algorithm/DataStructure/LinkedList/判断链表是否有环',
                '/algorithm/DataStructure/LinkedList/链表的中间结点'
            ]
        },
        {
            title: '中等题',
            collapsable: false,
            children: [
                '/algorithm/DataStructure/LinkedList/删除链表的倒数第N个节点',
                '/algorithm/DataStructure/LinkedList/两数相加'
            ]
        }
    ],
    '/algorithm/DataStructure/Tree/': [
        {
            title: '基础题',
            collapsable: false,
            children: [
               '/algorithm/DataStructure/Tree/对称二叉树',
               '/algorithm/DataStructure/Tree/翻转二叉树',
               '/algorithm/DataStructure/Tree/路径总和',
               '/algorithm/DataStructure/Tree/从上到下打印二叉树',
               '/algorithm/DataStructure/Tree/二叉树的最大深度',
               '/algorithm/DataStructure/Tree/N叉树的遍历',
               '/algorithm/DataStructure/Tree/从根到叶的二进制之和',
               '/algorithm/DataStructure/Tree/平衡二叉树',
               '/algorithm/DataStructure/Tree/二叉树的最近公共祖先'
            ]
        },
        {
            title: '中等题',
            collapsable: false,
            children: [
              '/algorithm/DataStructure/Tree/最大二叉树',
              '/algorithm/DataStructure/Tree/从前序与中序遍历序列构造二叉树'
            ]
        }
    ],
    '/algorithm/Company/': [
        {
            title: 'leetcode公司题库',
            collapsable: false,
            children: [
               '/algorithm/Company/ByteDance',
               '/algorithm/Company/Shopee'
            ]
        }
    ]
}