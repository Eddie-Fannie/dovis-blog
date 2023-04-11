# vite 原理

## vite 热更新
> 整体的原理为 `Websocket` 实现热模块替换功能。`Vite` 是这么做的，通过给每一个文件注入 `import.meta.hot` 等方式，在保存时，通过服务端通知客户端进行文件的重新请求来实现 `HMR`。** `Vite` 中 `HMR` 是在原生 `ESM` 上执行的。当编辑一个文件时，`Vite` 只需要精确地使已编辑的模块失活，使得无论应用大小如何，`HMR` 始终能保持快速更新。**

## 重写模块引入路径
> 浏览器 `import` 只能引入相对/绝对路径，而开发代码经常使用 `npm` 包名直接引入 `node_module` 中的模块，需要做路径转换后交给浏览器。

- `es-module-lexer` 扫描 `import` 语法
- `magic-string` 重写模块的引入路径

```js
// 开发代码
import { createApp } from 'vue'

// 转换后
import { createApp } from '/node_modules/vue/dist/vue.js'
```

## vite 命令发生啥
- `client` 代码会在启动服务时注入到客户端，用于客户端对于 `WebSocket` 消息的处理（如更新页面某个模块、刷新页面）；
- `server` 代码是服务端逻辑，用于处理代码的构建与页面模块的请求。

1. 命令行启动服务 `npm run dev` 后，源码执行 `cli.ts` ，调用 `createServer` 方法，创建 `http` 服务，监听开发服务器端口。

```js
// 源码位置 vite/packages/vite/src/node/cli.ts
const { createServer } = await import('./server')
try {
  const server = await createServer({
    root,
    base: options.base,
    ...
  })
  if (!server.httpServer) {
    throw new Error('HTTP server not available')
  }
  await server.listen()
}
```

2. `createServer` 方法的执行做了很多工作，如整合配置项、创建 `http` 服务（早期通过 `koa` 创建）、创建 `WebSocket` 服务、创建源码的文件监听、插件执行、`optimize` 优化等。下面注释中标出。

```js
// 源码位置 vite/packages/vite/src/node/server/index.ts
export async function createServer(
  inlineConfig: InlineConfig = {}
): Promise<ViteDevServer> {
  // Vite 配置整合
  const config = await resolveConfig(inlineConfig, 'serve', 'development')
  const root = config.root
  const serverConfig = config.server

  // 创建http服务
  const httpServer = await resolveHttpServer(serverConfig, middlewares, httpsOptions)

  // 创建ws服务
  const ws = createWebSocketServer(httpServer, config, httpsOptions)

  // 创建watcher，设置代码文件监听
  // const watcher = chokidar.watch(path.resolve(root), {
  //   ignored: [
  //     '**/node_modules/**',
  //     '**/.git/**',
  //     ...(Array.isArray(ignored) ? ignored : [ignored])
  //   ],
  //   ...watchOptions
  // }) as FSWatcher

  const watcher = chokidar.watch(
    // config file dependencies and env file might be outside of root
    [root, ...config.configFileDependencies, path.join(config.envDir, '.env*')],
    resolvedWatchOptions, // 参考上面注释 可以自行传入服务器选项 server.watch
  ) as FSWatcher

  // 创建server对象
  const server: ViteDevServer = {
    config,
    middlewares,
    httpServer,
    watcher,
    ws,
    moduleGraph,
    listen,
    ...
  }

  // 文件监听变动，websocket向前端通信
  watcher.on('change', async (file) => {
    ...
    handleHMRUpdate()
  })

  // 非常多的 middleware
  middlewares.use(...)
  
  // optimize
  const runOptimize = async () => {...}

  return server
}
```

3. 通过 `ws` 来创建 `WebSocket` 服务，用于监听到文件变化时触发热更新，向客户端发送消息。

```js
// 源码位置 vite/packages/vite/src/node/server/ws.ts
export function createWebSocketServer(...){
  let wss: WebSocket
  const hmr = isObject(config.server.hmr) && config.server.hmr
  const wsServer = (hmr && hmr.server) || server

  if (wsServer) {
    wss = new WebSocket({ noServer: true })
    wsServer.on('upgrade', (req, socket, head) => {
      // 服务就绪
      if (req.headers['sec-websocket-protocol'] === HMR_HEADER) {
        wss.handleUpgrade(req, socket as Socket, head, (ws) => {
          wss.emit('connection', ws, req)
        })
      }
    })
  } else {
    ...
  }
  // 服务准备就绪，就能在浏览器控制台看到熟悉的打印 [vite] connected.
  wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'connected' }))
    ...
  })
  // 失败
  wss.on('error', (e: Error & { code: string }) => {
    ...
  })
  // 返回ws对象
  return {
    on: wss.on.bind(wss),
    off: wss.off.bind(wss),
    // 向客户端发送信息
    // 多个客户端同时触发
    send(payload: HMRPayload) {
      const stringified = JSON.stringify(payload)
      wss.clients.forEach((client) => {
        // readyState 1 means the connection is open
        client.send(stringified)
      })
    }
  }
}
```

4. 在服务启动时会向浏览器注入代码，用于处理客户端接收到的 `WebSocket` 消息，如重新发起模块请求、刷新页面。

```js
//源码位置 vite/packages/vite/src/client/client.ts
async function handleMessage(payload: HMRPayload) {
  switch (payload.type) {
    case 'connected':
      console.log(`[vite] connected.`)
      break
    case 'update':
      notifyListeners('vite:beforeUpdate', payload)
      ...
      break
    case 'custom': {
      notifyListeners(payload.event as CustomEventName<any>, payload.data)
      ...
      break
    }
    case 'full-reload':
      notifyListeners('vite:beforeFullReload', payload)
      ...
      break
    case 'prune':
      notifyListeners('vite:beforePrune', payload)
      ...
      break
    case 'error': {
      notifyListeners('vite:error', payload)
      ...
      break
    }
    default: {
      const check: never = payload
      return check
    }
  }
}
```