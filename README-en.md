<p align="center">
    <h1 align="center">Asia 12300 Mail</h1>
    <p align="center">A minimalist, responsive email service built on Cloudflare, supporting sending and attachments 🎉</p>
    <p align="center">
        <a href="/README.md">简体中文</a> | English
    </p>
    <p align="center">
        <img src="https://img.shields.io/badge/license-MIT-green" alt="license" />
    </p>
</p>


## Introduction

With just one domain, you can create multiple mailboxes, similar to major email platforms. The project can be deployed to Cloudflare Workers to lower server costs and quickly build your own email service.

## Features

- **💰 Low cost**: Deploy to Cloudflare Workers to reduce server costs

- **💻 Responsive**: Responsive layout adapts to PC and most mobile browsers

- **📧 Sending**: Integrates Resend to send email, with bulk sending, inline images, attachments, and delivery status

- **🛡️ Admin**: Manage users and email, with RBAC permission control over features and resource limits

- **📦 Attachments**: Send and receive attachments, stored and downloaded via R2 object storage

- **🔔 Push**: Forward received email to a Telegram bot or another provider's mailbox

- **📡 Open API**: Batch-create users and query email via API

- **📈 Visualization**: Visualize system data and user/email growth with ECharts

- **🎨 Personalization**: Customize site title, login background, and opacity

- **🤖 Human verification**: Turnstile human verification to prevent bulk registration

- **🚦 IP risk control**: Detect proxy/VPN and data-center IPs at registration to prevent bulk sign-ups and abuse

- **📜 Privacy & Terms**: Built-in Privacy Policy and Terms of Service pages



## Tech Stack

- **Platform**: [Cloudflare Workers](https://developers.cloudflare.com/workers/)

- **Web framework**: [Hono](https://hono.dev/)

- **ORM**: [Drizzle](https://orm.drizzle.team/)

- **Frontend**: [Vue3](https://vuejs.org/)

- **UI**: [Element Plus](https://element-plus.org/)

- **Mail push**: [Resend](https://resend.com/)

- **Cache**: [Cloudflare KV](https://developers.cloudflare.com/kv/)

- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/)

- **File storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/)

## License

This project is open-sourced under the [MIT](LICENSE) license.
