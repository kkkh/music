import { get_runtime } from "./util.js"

const read_env = (key) =>
    globalThis?.Deno?.env?.get(key) ||
    globalThis?.process?.env?.[key] ||
    ''

let OVERSEAS = read_env("OVERSEAS")
const runtime = get_runtime()

if (['cloudflare', 'vercel'].includes(runtime)) OVERSEAS = true

const PORT = read_env("PORT") || 3000

OVERSEAS = Boolean(OVERSEAS)

// 页脚备案信息：部署在中国大陆境内时，请将占位备案号替换为真实备案号，
// 或通过环境变量 ICP_BEIAN / POLICE_BEIAN / SITE_DOMAIN / SITE_NAME 配置。
const ICP_BEIAN = read_env("ICP_BEIAN") || '晋ICP备2023020746号-2'
const POLICE_BEIAN = read_env("POLICE_BEIAN") || '晋公网安备14010602111139号'
const SITE_NAME = read_env("SITE_NAME") || 'Meting API'
const SITE_DOMAIN = read_env("SITE_DOMAIN")

export default {
    OVERSEAS,
    PORT,
    ICP_BEIAN,
    POLICE_BEIAN,
    SITE_NAME,
    SITE_DOMAIN,
}
