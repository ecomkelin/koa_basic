import jwt from 'jsonwebtoken';
// /* ================================ 签名: 把对象签名成为 token ================================ */
import { Type_payload } from '../interface/type';

export const generateToken = (payload: Type_payload, is_refresh?: boolean) => {
	const token_secret = is_refresh === true ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET;
	const token_ex = is_refresh ? process.env.REFRESH_TOKEN_EX : process.env.ACCESS_TOKEN_EX;
	return jwt.sign(payload, token_secret, { expiresIn: token_ex });
}

export const getTokenFromHeaders = (headersToken: string) => {
	if (!headersToken) return '';
	let token_s = String(headersToken).split(" ");
	if (token_s.length > 2) return '';
	return token_s.length === 1 ? token_s[0] : token_s[1];
}
// /* ================================ 验证 ================================ */
export const tokenToPayload = (token: string, is_refresh?: boolean) => new Promise(async resolve => {
	try {
		if (!token) return resolve({ status: 400, message: "请您传递 headers 空格后第第二个token信息" });
		const token_secret = is_refresh ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET;
		jwt.verify(token, token_secret, (expired, payload) => {
			if (expired) return resolve({ status: 401, message: "token过期", expired });
			return resolve({ status: 200, data: { token, is_refresh, payload } });
		});
	} catch (error) {
		console.log("[resolve token_VerifyProm]", error);
		return resolve({ status: 400, message: '[resolve token_VerifyProm]' });
	}
});