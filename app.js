import api from './src/service/api.js'
import { handler } from './src/template.js'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import config from './src/config.js'
import { get_runtime, get_url } from './src/util.js'
import { escape_html, page_styles, render_footer } from './src/footer.js'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.get('/api', api)
app.get('/test', handler)
app.get('/', (c) => {
    const current_url = escape_html(c.req.url)
    const base_url = escape_html(get_url(c))

    return c.html(`<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Meting正在运行</title>
    ${page_styles}
</head>

<body>
    <main class="site-main">
        <h1>Meting API</h1>
        <p>
            <a href="https://github.com/xizeyoupan/Meting-API" style="text-decoration: none;">
                <img alt="Static Badge" src="https://img.shields.io/badge/Github-Meting-green">
                <img alt="GitHub forks" src="https://img.shields.io/github/forks/xizeyoupan/Meting-API">
                <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/xizeyoupan/Meting-API">
            </a>
        </p>

        <p>当前版本：1.1.2</p>
        <p>当前运行环境：${escape_html(get_runtime())}</p>
        <p>当前时间：${escape_html(new Date())}</p>
        <p>内部端口：${escape_html(config.PORT)}</p>
        <p>部署在大陆：${config.OVERSEAS ? '否' : '是'}</p>
        <p>当前地址：<a>${current_url}</a></p>
        <p>实际地址：<a>${base_url}</a></p>
        <p>测试地址：<a href="${base_url}test">${base_url}test</a></p>
        <p>api地址：<a href="${base_url}api">${base_url}api</a></p>
    </main>
    ${render_footer(c)}
</body>

</html>`)
})

export default app
