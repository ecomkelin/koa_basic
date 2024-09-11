/**
 * 颜色 '\x1b[32m%s\x1b[0m'
 * 30: 灰色
 * 3331: 红色
 * 32: 绿色
 * 33: 黄色
 * 34: 蓝色
 * 35: 暗红色
 * 36: 暗蓝色
 * @param label 
 */
export function consoleLog(content: string, label?: string) {
    if (!label) console.log(content);
    label += ': ';
    console.log('\x1b[34m%s\x1b[0m', label, content);
}

export function consoleInfo(content: string, label?: string) {
    if (!label) console.info(content);
    label += ': '
    console.info('\x1b[32m%s\x1b[0m', label, content);
}

export function consoleError(content: string, label?: string) {
    if (!label) console.error(content);
    console.error('\x1b[31m' + label + ': \x1b[0m', content);
}

export function consoleWarn(content: string, label?: string) {
    if (!label) console.warn(content);
    console.warn('\x1b[33m' + label + ': \x1b[0m', content);
}

const Console = {
    log: consoleLog,
    info: consoleInfo,
    warn: consoleWarn,
    error: consoleError,
}
export default Console