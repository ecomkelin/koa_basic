// import { Injectable } from "@nestjs/common";

// import * as argon2 from "argon2";

// import * as RSA from 'node-rsa'; // 公钥私钥 数据加密 数字签名
// import * as CryptoJS from 'crypto-js'; // 验证 hash等
// import * as SHA256 from 'crypto-js/sha256';
// import { v4 as getUuid } from "uuid";

// import * as moment from 'moment';
// import axios from 'axios';

// import { private_key, public_key } from './conf/keys'

// import * as Conf_open from './conf/open.conf'

// @Injectable()
// export class CryptoSV {
//     /** 密码加密 */
//     async argon(pwd: string) {
//         try {
//             /** 历史 hash 可以通过前端赋值一个 之前的 hash值 也会是true */
//             let hash = "$argon2id$v=19$m=65536,t=3,p=4$jmLW41I6G3zc2Rgmek8sYg$JFvaOGpCToaCl/Cs4g+3TyVPg74527G6kyxNULOSIqQ"

//             /** 加密hash 每次hash值会不同 */
//             hash = await argon2.hash(pwd);

//             /** 对比 与hash过的 pwd 是否相同 */
//             const isMatch = await argon2.verify(hash, pwd)
//             return { isMatch, hash }
//         } catch (err) {
//             console.log(555, err)
//             throw err;
//         }
//     }

//     /** 数字签名 及 验证 */
//     async digitalSign() {
//         try {
//             const data = "hello, world";

//             /** =============== 电子签名 ================== */
//             /** 签名 步骤*/
//             const vKey = new RSA(private_key);
//             const signature = vKey.sign(data, 'base64');

//             /** 验证 步骤 */
//             const bKey = new RSA(public_key);
//             const isValid = bKey.verify(data, signature, 'utf8', 'base64');

//             return { code: 1, signature, isValid }
//         } catch (e) {
//             console.log(e);
//             return { status: 500 };
//         }
//     }

//     /** 对称加密 及 解密 */
//     async aes(data: string, { key, keyLen }) {
//         try {
//             /** 对称加密 */
//             let iv = CryptoJS.enc.Utf8.parse(key.substring(0, keyLen));
//             const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
//                 iv: iv,
//                 mode: CryptoJS.mode.CBC,
//                 padding: CryptoJS.pad.Pkcs7
//             });
//             const encryptedData = encrypted.toString(); // 生成了加密字段

//             /** 对称解密 */
//             iv = CryptoJS.enc.Utf8.parse(key.substring(0, keyLen));
//             const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(key), {
//                 iv: iv,
//                 mode: CryptoJS.mode.CBC,
//                 padding: CryptoJS.pad.Pkcs7
//             });
//             const decryptedDate = decrypted.toString(CryptoJS.enc.Utf8);

//             return { encryptedData, decryptedDate };
//         } catch (err) {
//             return { err: 500 }
//         }
//     }
//     /** 非对称加密 及 解密 */
//     async rsa() {
//         try {
//             const data = "hello, world";

//             /** 公钥 加密 encryptedData 字段可能会很长 */
//             const bKey = new RSA(public_key);
//             const encryptedData = bKey.encrypt(data, 'base64');

//             /** 私钥解密 */
//             const vKey = new RSA(private_key);
//             const decryptedData = vKey.decrypt(encryptedData, 'utf8');

//             return { data, encryptedData, decryptedData }
//         } catch (e) {
//             console.log(e);
//             return { status: 500 };
//         }
//     }

/**
 * 一、 提供给帆软 appId 和 appSecret 两个字符串
 * 二、 提供给 帆软 method为post 的 api接口 参数都会包含在 data 中
 *      比如 data: {
 *          code: 101,
 *          name: 'n101'
 *      }
 * 三、 生成签名 str = JSON.stringify({...data, timestamp, appSecret});
 *      sign = SHA256(str).toString();
 * 四、 传参数为:
 *      body: {
 *          data: {
 *              code: 101,
 *              name: 'n101'
 *          },
 *          timestamp,
 *          appId,
 *          sign
 *      }
 * 五、接收 结果
 *
 * 1 body = {
 *      data: {
 *          // key1: XXX
 *          // key2: XXX
 *      },
 *      appId,
 * }
 */
//     /** 验证外部访问资源的正确性 */
//     async openid(data: object) {
//         try {
//             const method = "employee.save";
//             const timestamp = moment(new Date()).format("YYYYMMDDHHmmss");
//             const id = getUuid();
//             const body: any = {
//                 data: JSON.stringify(data),
//                 appId: Conf_open.appId,
//                 format: Conf_open.format,
//                 id, method, timestamp,
//                 version: Conf_open.version,
//             }

//             let str = "";
//             // 数据字符串话
//             for (let key in body) str += `${key}=${String(body[key])}&`;
//             // 加入 app 密钥
//             str += `appSecret=${Conf_open.appSecret}`;

//             // 生成签名
//             body.sign = SHA256(str).toString();

//             /** axios */
//             const result = (await axios({
//                 method: "POST",
//                 url: Conf_open.url,
//                 data: JSON.stringify(body),
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             })).data;
//             /** 这是资源公司验证的方法 */
//             const verify = await this.deHash(body);

//             return { verify, result, body }
//         } catch (e) {
//             console.error(e.stack);
//             return { status: 500 };
//         }
//     }
//     /** 资源公司是如何验证的 */
//     async deHash(body) {
//         try {
//             /** 第一步 根据 appId 获取到 appSecret */
//             const appId: string = body.appId;
//             if (!appId) throw "请传递您的 身份信息";
//             // const appSecret = await this.appSV.getOne({ appId } 
//             const appSecret = Conf_open.appSecret;

//             /** 第二步 获取到 请求公司发过来的数据 */
//             let str = "";
//             for (let key in body) {
//                 if (key !== 'sign') str += `${key}=${String(body[key])}&`
//             }
//             str += `appSecret=${appSecret}`;

//             /** 第三步 根据body数据字符串生成 hash 签名 */
//             const hash = SHA256(str).toString();
//             /** 最后 与 返回的sign 把数据进行检饰 看看是否为本人的签名
//              * 也就是说如果第三方不知道 appSecret hash签名肯定错误
//              * 如果不是客户本身硬泄漏 appSecret 是无法被第三方获取的 
//              *      因为 appSecret+body经过hash 没有在传输中被暴露 
//              * 虽然 appId 被暴露了 但是没有关系 这只是辅助 资源公司获得请求公司的 appSecret
//              * 秒啊
//              */
//             const isMatch = hash === body.sign
//             return { isMatch }
//         } catch (e) {
//             return { status: 500 };
//         }
//     }
// }