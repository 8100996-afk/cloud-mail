import reqUtils from '../utils/req-utils';
import { detect } from '../utils/ip-risk-detect';

/**
 * IP 风控服务
 *
 * 通过 iplark.com（或兼容的 IP 质量检测接口）判断来访 IP 是否为
 * 代理 / VPN 或 数据中心(机房) IP，用于在注册等环节进行拦截。
 *
 * 相关环境变量（在 wrangler.toml 的 [vars] 中配置，均为可选）：
 *   risk_control        是否开启风控，默认开启；设为字符串 "false" 关闭
 *   iplark_api          IP 检测接口地址模板，使用 {ip} 作为占位符，
 *                       默认 "https://iplark.com/ipstack?ip={ip}"
 *   risk_block_proxy    是否拦截 代理/VPN，默认拦截；设为 "false" 关闭
 *   risk_block_hosting  是否拦截 数据中心/机房 IP，默认拦截；设为 "false" 关闭
 *   risk_timeout        请求 iplark 的超时时间(毫秒)，默认 4000
 *
 * 设计原则：出错即放行（fail-open），仅在检测到明确的风险信号时才判定为风险，
 * 避免误伤正常用户或因第三方接口不可用而导致注册功能不可用。
 */

const ipRiskService = {

	isEnabled(c) {
		return String(c.env.risk_control ?? 'true').toLowerCase() !== 'false';
	},

	blockProxy(c) {
		return String(c.env.risk_block_proxy ?? 'true').toLowerCase() !== 'false';
	},

	blockHosting(c) {
		return String(c.env.risk_block_hosting ?? 'true').toLowerCase() !== 'false';
	},

	isLocalOrUnknownIp(ip) {
		if (!ip || ip === 'Unknown') return true;
		// 内网 / 回环地址不做检测
		return /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|fc|fd|fe80)/i.test(ip);
	},

	/**
	 * 查询某个 IP 的风险信息
	 * @returns {Promise<{risky:boolean, proxy:boolean, hosting:boolean, tor:boolean, reason:string}>}
	 */
	async query(c, ip) {

		const empty = { risky: false, proxy: false, hosting: false, tor: false, reason: '' };

		if (!this.isEnabled(c) || this.isLocalOrUnknownIp(ip)) {
			return empty;
		}

		const template = c.env.iplark_api || 'https://iplark.com/ipstack?ip={ip}';
		const url = template.includes('{ip}') ? template.replace('{ip}', encodeURIComponent(ip)) : template + encodeURIComponent(ip);
		const timeout = Number(c.env.risk_timeout) || 4000;

		try {
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), timeout);

			const resp = await fetch(url, {
				method: 'GET',
				headers: {
					'accept': 'application/json',
					'user-agent': 'Mozilla/5.0 (compatible; CloudMail-RiskControl/1.0)'
				},
				signal: controller.signal
			});

			clearTimeout(timer);

			if (!resp.ok) {
				console.warn(`[risk] iplark 返回非 200：${resp.status} ip=${ip}`);
				return empty;
			}

			const text = await resp.text();

			let data;
			try {
				data = JSON.parse(text);
			} catch {
				console.warn(`[risk] iplark 响应不是 JSON，已放行 ip=${ip} body=${text.slice(0, 200)}`);
				return empty;
			}

			const detected = detect(data);
			const reason = detected.matched.slice(0, 6).join('; ');

			if (detected.proxy || detected.hosting) {
				console.log(`[risk] 命中风险信号 ip=${ip} proxy=${detected.proxy} hosting=${detected.hosting} reason=${reason}`);
			}

			return {
				risky: detected.proxy || detected.hosting,
				proxy: detected.proxy,
				hosting: detected.hosting,
				tor: detected.tor,
				reason
			};

		} catch (e) {
			// 超时 / 网络错误 / 接口异常：一律放行，避免影响正常注册
			console.warn(`[risk] iplark 检测失败，已放行 ip=${ip} err=${e?.message || e}`);
			return empty;
		}
	},

	/**
	 * 判断当前请求的 IP 是否允许注册
	 * @returns {Promise<{allow:boolean, reason:string}>}
	 */
	async checkRegister(c) {

		if (!this.isEnabled(c)) {
			return { allow: true, reason: '' };
		}

		const ip = reqUtils.getIp(c);
		const risk = await this.query(c, ip);

		if (!risk.risky) {
			return { allow: true, reason: '' };
		}

		const hitProxy = (risk.proxy || risk.tor) && this.blockProxy(c);
		const hitHosting = risk.hosting && this.blockHosting(c);

		if (hitProxy || hitHosting) {
			return { allow: false, reason: risk.reason };
		}

		return { allow: true, reason: '' };
	}

};

export default ipRiskService;
