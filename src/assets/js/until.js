const Until = {
  /**
   * 倒计时
   */
  djs: function (times) {
    var timer = null
    var t = times
    var m = 0
    var s = 0
    var str = ''
    m = Math.floor(t / 60 % 60)
    m < 10 && (m = '0' + m)
    s = Math.floor(t % 60)
    s < 10 && (s = '0' + s)
    str = m + ':' + s
    if (s.length >= 3) {
      s = 59
      m = '0' + (Number(m) - 1)
      str = m + ':' + s
    }
    if (m.length >= 3) {
      m = '00'
      s = '00'
      str = m + ':' + s
      clearInterval(timer)
    }
    return str
  },
}
export { Until }
