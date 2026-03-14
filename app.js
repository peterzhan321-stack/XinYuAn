// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    apiBaseUrl: 'https://your-real-api.com' // 线上地址
    // apiBaseUrl: 'http://localhost:3000/api' // 开发时用本地模拟服务器地址
  }
})