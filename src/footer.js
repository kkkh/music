import config from './config.js'
import { BEIAN_ICON_DATA_URL } from './beian-icon.js'

const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
}

export const escape_html = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char])

const get_domain = (c) => {
    if (config.SITE_DOMAIN) return config.SITE_DOMAIN

    const forwarded_host = c.req.header('X-Forwarded-Host') || c.req.header('X-Forwarded-Url')
    const raw_url = forwarded_host || c.req.url

    try {
        const { hostname } = new URL(raw_url.includes('://') ? raw_url : `http://${raw_url}`)
        const is_localhost = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(hostname)
        if (hostname && !is_localhost && !hostname.includes(':')) return hostname
    } catch {
        // 无法解析请求地址时不展示域名
    }

    return ''
}

const get_police_code = (beian) => String(beian).replace(/\D/g, '')

export const page_styles = `
<style>
    *,
    *::before,
    *::after { box-sizing: border-box; }

    html { min-height: 100%; }

    body {
        min-height: 100vh;
        margin: 0;
        display: flex;
        flex-direction: column;
        background: #fff;
        color: #1f2937;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
    }

    .site-main {
        flex: 1 0 auto;
        padding: 24px 16px;
    }

    .site-footer {
        flex-shrink: 0;
        padding: 28px 16px 24px;
        border-top: 1px solid rgba(15, 23, 42, 0.08);
        color: #6b7280;
        font-size: 12px;
        line-height: 1.9;
        text-align: center;
    }

    .site-footer__row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 2px 10px;
        margin: 0;
    }

    .site-footer__row + .site-footer__row { margin-top: 2px; }

    .site-footer a {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .site-footer a:hover {
        color: #111827;
        text-decoration: underline;
        text-underline-offset: 3px;
    }

    .site-footer a:focus-visible {
        color: #111827;
        outline: 2px solid #2563eb;
        outline-offset: 2px;
        border-radius: 4px;
    }

    .site-footer__sep {
        color: rgba(15, 23, 42, 0.18);
        user-select: none;
    }

    .site-footer__police {
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }

    .site-footer__police-icon {
        display: block;
        flex-shrink: 0;
        width: 16px;
        height: 17px;
        object-fit: contain;
    }

    @media (max-width: 480px) {
        .site-main { padding: 16px 12px; }
        .site-footer { padding: 24px 12px 20px; }
        .site-footer__sep { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
        .site-footer a { transition: none; }
    }
</style>`

export const render_footer = (c) => {
    const year = new Date().getFullYear()
    const domain = escape_html(get_domain(c))
    const site_name = escape_html(config.SITE_NAME)
    const icp = escape_html(config.ICP_BEIAN)
    const police = escape_html(config.POLICE_BEIAN)
    const copyright = [site_name, domain].filter(Boolean).join(' · ')

    const records = []

    if (icp) {
        records.push(`<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" title="工业和信息化部 ICP/IP地址/域名信息备案管理系统">${icp}</a>`)
    }

    if (police) {
        const code = get_police_code(config.POLICE_BEIAN)
        const href = code
            ? `https://beian.mps.gov.cn/#/query/webSearch?code=${encodeURIComponent(code)}`
            : 'https://beian.mps.gov.cn/#/query/webSearch'

        if (records.length) {
            records.push('<span class="site-footer__sep" aria-hidden="true">|</span>')
        }

        records.push(`<a class="site-footer__police" href="${href}" target="_blank" rel="noopener noreferrer" title="全国互联网安全管理服务平台"><img class="site-footer__police-icon" src="${BEIAN_ICON_DATA_URL}" width="16" height="17" alt="" aria-hidden="true">${police}</a>`)
    }

    return `
    <footer class="site-footer" role="contentinfo">
        <p class="site-footer__row">© ${year} ${copyright}${copyright ? ' 版权所有' : ''}</p>
        ${records.length ? `<p class="site-footer__row">${records.join('')}</p>` : ''}
    </footer>`
}
