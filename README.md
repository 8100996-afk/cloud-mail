<p align="center">
    <h1 align="center">亚洲12300邮箱</h1>
    <p align="center">基于 Cloudflare 的简约响应式邮箱服务，支持邮件收发、附件收发 🎉</p>
    <p align="center">
        简体中文 | <a href="/README-en.md" style="margin-left: 5px">English</a>
    </p>
    <p align="center">
        <img src="https://img.shields.io/badge/license-MIT-green" alt="license" />
    </p>
</p>


## 项目简介

只需要一个域名，就可以创建多个不同的邮箱，类似各大邮箱平台。本项目可部署到 Cloudflare Workers，降低服务器成本，快速搭建属于自己的邮箱服务。

## 功能介绍

- **💰 低成本使用**：可部署到 Cloudflare Workers 降低服务器成本

- **💻 响应式设计**：响应式布局自动适配 PC 和大部分手机端浏览器

- **📧 邮件发送**：集成 Resend 发送邮件，支持群发、内嵌图片和附件发送、发送状态查看

- **🛡️ 管理员功能**：可以对用户、邮件进行管理，RBAC 权限控制对功能及使用资源限制

- **📦 附件收发**：支持收发附件，使用 R2 对象存储保存和下载文件

- **🔔 邮件推送**：接收邮件后可以转发到 TG 机器人或其他服务商邮箱

- **📡 开放 API**：支持使用 API 批量生成用户、多条件查询邮件

- **📈 数据可视化**：使用 ECharts 对系统数据详情、用户邮件增长可视化显示

- **🎨 个性化设置**：可以自定义网站标题、登录背景、透明度

- **🤖 人机验证**：集成 Turnstile 人机验证，防止批量注册

- **🚦 IP 风控**：注册环节检测代理/VPN 及数据中心（机房）IP，防范批量注册与滥用

- **📜 隐私与条款**：内置隐私政策与服务条款页面



## 技术栈

- **平台**：[Cloudflare Workers](https://developers.cloudflare.com/workers/)

- **Web 框架**：[Hono](https://hono.dev/)

- **ORM**：[Drizzle](https://orm.drizzle.team/)

- **前端框架**：[Vue3](https://vuejs.org/)

- **UI 框架**：[Element Plus](https://element-plus.org/)

- **邮件推送**：[Resend](https://resend.com/)

- **缓存**：[Cloudflare KV](https://developers.cloudflare.com/kv/)

- **数据库**：[Cloudflare D1](https://developers.cloudflare.com/d1/)

- **文件存储**：[Cloudflare R2](https://developers.cloudflare.com/r2/)

## 目录结构

```
.
├── mail-worker                     # worker 后端项目
│   ├── src
│   │   ├── api                     # api 接口层
│   │   ├── const                   # 项目常量
│   │   ├── dao                     # 数据访问层
│   │   ├── email                   # 邮件处理接收
│   │   ├── entity                  # 数据库实体
│   │   ├── error                   # 自定义异常
│   │   ├── hono                    # web 框架配置、拦截器、全局异常等
│   │   ├── i18n                    # 语言国际化
│   │   ├── init                    # 数据库缓存初始化
│   │   ├── model                   # 响应体数据封装
│   │   ├── security                # 身份权限认证
│   │   ├── service                 # 业务服务层
│   │   ├── template                # 消息模板
│   │   ├── utils                   # 工具类
│   │   └── index.js                # 入口文件
│   ├── package.json                # 项目依赖
│   └── wrangler.toml               # 项目配置
│
├── mail-vue                        # vue 前端项目
│   ├── src
│   │   ├── axios                   # axios 配置
│   │   ├── components              # 自定义组件
│   │   ├── echarts                 # echarts 组件导入
│   │   ├── i18n                    # 语言国际化
│   │   ├── init                    # 入站初始化
│   │   ├── layout                  # 主体布局组件
│   │   ├── perm                    # 权限认证
│   │   ├── request                 # api 接口
│   │   ├── router                  # 路由配置
│   │   ├── store                   # 全局状态管理
│   │   ├── utils                   # 工具类
│   │   ├── views                   # 页面组件
│   │   ├── App.vue                 # 入口组件
│   │   ├── main.js                 # 入口 js
│   │   └── style.css               # 全局 css
│   ├── package.json                # 项目依赖
└── └── .env.release                # 项目配置
```

## 许可证

本项目基于 [MIT](LICENSE) 许可证开源。
