import { isBrowser, isMiniProgram } from './device'

const getObjectType = v => Object.prototype.toString.call(v).slice(8, -1)

const isTelPhone = v => getObjectType(v) === 'String' && v.indexOf('tel:') === 0

const createQueryUrl = (to) => {
  let toType = getObjectType(to)
  if (toType === 'String') {
    return to
  }
  if (
    toType === 'Object' &&
    to.path
  ) {
    let url = to.path
    let search = ''
    if (
      getObjectType(to.query) === 'Object' &&
      Object.keys(to.query).length > 0
    ) {
      let querys = []
      for (let i in to.query) {
        querys.push(`${i}=${to.query[i]}`)
      }
      search = `${url.indexOf('?') === -1 ? '?' : '&'}${querys.join('&')}`
    }
    return `${url}${search}`
  }
  return ''
}

export {
  createQueryUrl
}

/* eslint-disable */
export default ({
  vm,
  to,
  replace,
  success,
  fail,
  complete
}) => {
  if (to) {
    let toType = getObjectType(to)
    if (toType === 'String') to = to.trim()
    if (isBrowser) { // 浏览器
      if (toType === 'Number') {
        vm.$router.go(to)
      } else if (
        toType === 'String' &&
        (
          to.indexOf('//') === 0 ||
          to.indexOf('http://') === 0 ||
          to.indexOf('https://') === 0
        )
      ) { // 字符串
        to = to.indexOf('.') > -1 ? to : to.substring(1)
        if (replace) {
          window.location.replace(to)
        } else {
          window.location.href = to
        }
      } else {
        if (
          (
            toType === 'String' &&
            to.indexOf('/') === 0
          )
        ) { // Vue router 操作
          if (vm) {
            if (replace) {
              vm.$router.replace(to)
            } else {
              vm.$router.push(to)
            }
          } else {
            console.error('Require vm')
          }
        } else if (toType === 'Object') { // 其他，如：拨打电话、发送邮件
          if (
            to.path.indexOf('//') === 0 ||
            to.path.indexOf('http://') === 0 ||
            to.path.indexOf('https://') === 0
          ) {
            if (replace) {
              window.location.replace(createQueryUrl(to))
            } else {
              window.location.href = createQueryUrl(to)
            }
          } else {
            if (replace) {
              vm.$router.replace(to)
            } else {
              vm.$router.push(to)
            }
          }
        } else {
          if (replace) {
            window.location.replace(to)
          } else {
            window.location.href = to
          }
        }
      }
    } else if (isMiniProgram) { // 小程序
      if (toType === 'Number') {
        wx.navigateBack({
          delta: to > 0 ? to : -1 * to
        })
      } else if (isTelPhone(to)) { // 拨打电话
        wx.makePhoneCall({
          phoneNumber: to.replace('tel:', '')
        })
      } else {
        to = {
          url: createQueryUrl(to),
          success: success ? success : () => {},
          fail: fail ? fail : () => {},
          complete: fail ? fail : () => {}
        }
        if (replace) {
          wx.redirectTo(to)
        } else {
          wx.navigateTo(to)
        }
      }
    }
  } else {
    vm.$emit('click')
  }
}
