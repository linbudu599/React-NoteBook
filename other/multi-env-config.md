# React 项目多环境配置

> 最好不要直接 `npm eject` 吧，目录会变得很大的

## 默认支持

`create-react-app` 默认支持以下环境配置文件

- .env：默认环境配置文件
- .env.local：本地环境配置文件，会覆盖 `.env` ，所有测试环境以外的环境都会加载此文件
- .env.development/.env.production/.env.test：特定情况下的环境配置文件
-  .env.development.local 等：特定情况下的环境配置文件的本地覆盖

## 执行

左侧的环境文件会具有比右侧文件更高的优先级

`npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`

`npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`

`npm test`: `.env.test.local`, `.env.test`, `.env` (注意没有 `.env.local` )

## 配合Dotenv

> 例如需要在测试环境下使用`.env.development` 中的接口地址，如果在测试服务器上执行 `build` 命令，会使得接口地址被指定为生产环境的接口地址。
>
> 因此在这种情况下需要使用 `dotenv` 来将环境变量从 `.env` 文件中加载到 `process.env` 中。（在命令行中使用需要 [dotenv-cli](https://github.com/entropitor/dotenv-cli)）

**写好各环境配置文件**

```text
# .env.development
REACT_APP_BASE_URL='http://development.xxx.xxx'
# env.production
REACT_APP_BASE_URL='http://production.xxx.xxx'
```

**修改 `scripts`  **

> `react-app-rewired` 可以在不 `eject` 或者 创建额外 `react-scripts` 的情况下修改react脚手架内置的 `webpack` 配置

```json
"scripts": {
    "start": "react-app-rewired start",
    "build:dev": "dotenv -e .env.development react-app-rewired build",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  }
```

然后就可以通过 `npm run build:dev` 来指定使用的环境配置了