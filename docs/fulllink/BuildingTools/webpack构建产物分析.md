# webpack构建产物分析
> 我们在使用 `webpack` 构建项目后，会发现打包出来的代码非常的“丑”，这是为什么？原因就是：`webpack` 支持多种模块规范，但是最后都会变成 `commonJS` 规范（`webpack5` 对纯 `esm` 做了一定的优化），但是浏览器不支持 `commonJS` 规范，于是 `webpack` 自己实现了 `require` 和 `module.exports` ，所以会有很多 `polyfill` 代码的注入。

## 简单分析
```js
// webpack相关依赖版本

// "webpack": "^5.76.3",
// "webpack-cli": "^5.0.1",
// "webpack-dev-server": "^4.13.1"

// commonjs 中加载 commonjs

(() => {
    var __webpack_modules__ = ({
        /***/ "./src/add-content.js":
/*!****************************!*\
  !*** ./src/add-content.js ***!
  \****************************/
/***/ (() => {

  eval("modules.exports = {\n  write: function() {\n    document.write('i am using a config file')\n  }\n}\n\n//# sourceURL=webpack://webpack-basic-build/./src/add-content.js?");

  /***/ }),

        "./src/index.js": (__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {
  eval("const { write } = __webpack_require__(/*! ./add-content */ \"./src/add-content.js\")\n\nwrite()\n\n//# sourceURL=webpack://webpack-basic-build/./src/index.js?");

        }
    })

    var __webpack_module_cache__ = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

    var __webpack_exports__ = __webpack_require__("./src/index.js");
})()


// es6 module中加载es6module

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/add-content.js":
/*!****************************!*\
  !*** ./src/add-content.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {\n  // es6 模块化\n  document.write('i am using a config file')\n}\n\n//# sourceURL=webpack://webpack-basic-build/./src/add-content.js?");

  /***/ }),
  
  /***/ "./src/index.js":
  /*!**********************!*\
    !*** ./src/index.js ***!
    \**********************/
  /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
  
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _add_content__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./add-content */ \"./src/add-content.js\");\n\n\n\n(0,_add_content__WEBPACK_IMPORTED_MODULE_0__[\"default\"])()\n\n//# sourceURL=webpack://webpack-basic-build/./src/index.js?");
  
  /***/ })
  
  /******/ 	});
  /************************************************************************/
  /******/ 	// The module cache
  /******/ 	var __webpack_module_cache__ = {};
  /******/ 	
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/ 		// Check if module is in cache
  /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
  /******/ 		if (cachedModule !== undefined) {
  /******/ 			return cachedModule.exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = __webpack_module_cache__[moduleId] = {
  /******/ 			// no module.id needed
  /******/ 			// no module.loaded needed
  /******/ 			exports: {}
  /******/ 		};
  /******/ 	
  /******/ 		// Execute the module function
  /******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  /******/ 	
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/ 	
  /************************************************************************/
  /******/ 	/* webpack/runtime/define property getters */
  /******/ 	(() => {
  /******/ 		// define getter functions for harmony exports
  /******/ 		__webpack_require__.d = (exports, definition) => {
  /******/ 			for(var key in definition) {
  /******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
  /******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
  /******/ 				}
  /******/ 			}
  /******/ 		};
  /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/hasOwnProperty shorthand */
  /******/ 	(() => {
  /******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
  /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/make namespace object */
  /******/ 	(() => {
  /******/ 		// define __esModule on exports
  /******/ 		__webpack_require__.r = (exports) => {
  /******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  /******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  /******/ 			}
  /******/ 			Object.defineProperty(exports, '__esModule', { value: true });
  /******/ 		};
  /******/ 	})();
  /******/ 	
  /************************************************************************/
  /******/ 	
  /******/ 	// startup
  /******/ 	// Load entry module and return exports
  /******/ 	// This entry module can't be inlined because the eval devtool is used.
  /******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
  /******/ 	
  /******/ })()
  ;
```

- 最外层匿名函数。它用来包裹整个 `bundle`，并构成自身的作用域。
- `__webpack_module_cache__` 对象。每个模块只在第一次被加载的时候执行，之后其导出值就被存储到这个对象里面，当再次被加载的时候 `webpack` 会直接从这里取值，而不会重新执行该模块。
- `__webpack_require__` 函数。对模块加载的实现，在浏览器中可以通过调用 `__webpack_require__(module_id)`来完成模块导入。**`webpack` 打包后的代码能够运行， 是因为 `webpack` 根据 `commonJS` 规范实现了一个 `require` 方法**
- `__webpack_modules__` 对象。工程中所有产生了依赖关系的模块都会以 `key-value` 的形式放在这里。`key` 可以理解为一个模块的 `id` ，由数字或者一个很短的 `hash` 字符串构成；`value` 则是由一个匿名函数包裹的模块实体，匿名函数的参数赋予了每个模块导出和导入的能力。

**`bundle`是如何在浏览器中执行的**

1. 在最外层匿名函数中初始化浏览器执行环境，包括定义 `__webpack_module_cache__` 对象、`__webpack_require__` 函数等，为模块的加载和执行做一些准备工作。
2. 加载入口模块。每个 `bundle` 都有且只有一个入口模块，在上面的代码中，`index.js` 是入口模块，在浏览器中会从它开始执行。
3. 执行模块代码。如果执行到了 `module.exports` 则记录下模块的导出值；如果中间遇到 `require` 函数（准确地说是 `__webpack_require__` ），则会暂时交出执行权，进入 `__webpack_require__` 函数体内进行加载其他模块的逻辑。
4. 在 `__webpack_require__` 中判断即将加载的模块是否存在于 `__webpack_module_cache__` 中。如果存在则直接取值，否则回到第3步，执行该模块的代码来获取导出值。
5. 所有依赖的模块都已执行完毕，最后执行权又回到入口模块。当入口模块的代码执行完毕，也就意味着整个 `bundle` 运行结束。

:::tip
第 `3` 步和第 `4` 步是一个递归的过程。`Webpack` 为每个模块创造了一个可以导出和导入模块的环境，但本质上并没有修改代码的执行逻辑，因此代码执行的顺序与模块加载的顺序是完全一致的，这也是 `Webpack` 模块打包的奥秘。
:::