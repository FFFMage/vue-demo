/* eslint-disable no-useless-escape */
export function validateEmail(rule, value, callback) {
  const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

export function validateTel(rule, value, callback) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的电话号码'))
  } else {
    callback()
  }
}

export function validatePsd(rule, value, callback) {
  const passwordReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,20}$/
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (!passwordReg.test(value)) {
    callback(new Error('请输入6-20位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种'))
  } else {
    callback()
  }
}

// 时间格式化
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }

  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  for (const item in o) {
    if (new RegExp(`(${item})`).test(fmt)) {
      const str = o[item] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : str.padStart(2, '0'))
    }
  }
  return fmt
}
