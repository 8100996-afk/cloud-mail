/**
 * IP 风险信号解析（纯函数，无外部依赖，便于单元测试）
 *
 * 兼容多种常见 IP 检测接口的返回格式：
 *  - ipstack 风格：{ security: { is_proxy, proxy_type, is_tor } }
 *  - ip-api 风格：{ proxy: true, hosting: true }
 *  - proxycheck 风格：{ "1.2.3.4": { proxy: "yes", type: "VPN" } }
 *  - 中文质检风格：{ useType: "机房", ... } / { 类型: "数据中心" }
 */

const PROXY_KEY_RE = /proxy|vpn|tor/i;
const HOSTING_KEY_RE = /hosting|datacenter|data[_\s-]?center|idc/i;

const PROXY_WORDS = ['proxy', 'vpn', 'tor', 'relay', '代理', '中转'];
const HOSTING_WORDS = ['hosting', 'datacenter', 'data center', 'idc', '机房', '数据中心', '托管', '主机商', '服务器托管'];

const TEXT_HINT_KEY_RE = /type|used|usage|scene|line|tag|category|desc|risk|net|usetype|iptype|purity|纯净|场景|类型/i;

function truthy(v) {
	if (v === true) return true;
	if (typeof v === 'number') return v === 1;
	if (typeof v === 'string') {
		const s = v.trim().toLowerCase();
		return s === 'true' || s === 'yes' || s === '1' || s === 'y' || s === '是';
	}
	return false;
}

function containsWord(text, words) {
	const s = String(text).toLowerCase();
	return words.some(w => s.includes(w));
}

/**
 * 遍历响应对象，收集风险信号
 * @returns {{proxy:boolean, hosting:boolean, tor:boolean, matched:string[]}}
 */
export function detect(data) {
	const result = { proxy: false, hosting: false, tor: false, matched: [] };

	function walk(node, depth) {
		if (!node || depth > 6) return;

		if (Array.isArray(node)) {
			node.forEach(item => walk(item, depth + 1));
			return;
		}

		if (typeof node !== 'object') return;

		for (const [key, value] of Object.entries(node)) {

			const lowerKey = key.toLowerCase();

			// 1) 布尔型信号：字段名本身表明类型
			if (PROXY_KEY_RE.test(lowerKey) && truthy(value)) {
				result.proxy = true;
				if (/tor/i.test(lowerKey)) result.tor = true;
				result.matched.push(`${key}=${value}`);
			}

			if (HOSTING_KEY_RE.test(lowerKey) && truthy(value)) {
				result.hosting = true;
				result.matched.push(`${key}=${value}`);
			}

			// 2) 文本型信号：字段值里含有风险关键字
			if (typeof value === 'string' && TEXT_HINT_KEY_RE.test(lowerKey)) {
				if (containsWord(value, PROXY_WORDS)) {
					result.proxy = true;
					if (/tor/i.test(value)) result.tor = true;
					result.matched.push(`${key}:${value}`);
				}
				if (containsWord(value, HOSTING_WORDS)) {
					result.hosting = true;
					result.matched.push(`${key}:${value}`);
				}
			}

			// 3) 递归下探（对象 / 数组）
			if (value && typeof value === 'object') {
				walk(value, depth + 1);
			}
		}
	}

	walk(data, 0);
	return result;
}

export default detect;
