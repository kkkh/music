import example from "./example.js"
import { page_styles, render_footer } from "./footer.js"

let html = `
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>测试页面</title>
    <link rel="stylesheet" href="https://unpkg.com/aplayer/dist/APlayer.min.css">
    ${page_styles}
</head>

<body>
    <main class="site-main">
        <script src="https://unpkg.com/aplayer/dist/APlayer.min.js"></script>
        <script>
            var meting_api = 'api?server=:server&type=:type&id=:id&auth=:auth&r=:r';
        </script>
        <script src="https://unpkg.com/@xizeyoupan/meting@latest/dist/Meting.min.js"></script>
`

Object.keys(example).map(provider => {
    Object.keys(example[provider]).map(type => {
        if (!example[provider][type].show) return

        html += `
    <div>
        <p>${provider} ${type}</p>
        <meting-js server="${provider}" type="${type}" id="${example[provider][type].value}" list-folded=true />
    </div>
    <br/>
`
    })
})

html += `
    </main>
`

export const handler = (c) => {
    return c.html(`${html}${render_footer(c)}
</body>

</html>`)
}
