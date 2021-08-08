/**
 * Common util
 */
const log4js = require('./log4j')
const jwt = require('jsonwebtoken')
const CODE = {
    SUCCESS: 200,
    PARAM_ERROR: 10001, // Input error
    USER_ACCOUNT_ERROR: 20001, // User or password error
    USER_LOGIN_ERROR: 30001, // Not authorized error
    BUSINESS_ERROR: 40001, // Internal error
    AUTH_ERROR: 500001, // Token error
}
module.exports = {
    /**
     * Pagination wrapper
     * @param {number} pageNum 
     * @param {number} pageSize 
     */
    pager({ pageNum = 1, pageSize = 10 }) {
        pageNum *= 1;
        pageSize *= 1;
        const skipIndex = (pageNum - 1) * pageSize;
        return {
            page: {
                pageNum,
                pageSize
            },
            skipIndex
        }
    },
    success(data = '', msg = '', code = CODE.SUCCESS) {
        return {
            code, data, msg
        }
    },
    fail(msg = '', code = CODE.BUSINESS_ERROR, data = '') {
        log4js.debug(msg);
        return {
            code, data, msg
        }
    },
    CODE,
    decoded(authorization) {
        if (authorization) {
            let token = authorization.split(' ')[1]
            return jwt.verify(token, process.env.JWTTOKEN)
        }
        return '';
    },
    formateDate(date, rule) {
        let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, date.getFullYear())
        }
        const o = {
            // 'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                const val = o[k] + '';
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length));
            }
        }
        return fmt;
    },
}