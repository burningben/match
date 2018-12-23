App({
    onLaunch: function () {
        console.log('App Launch')
        wx.login({
          success: function(res) {
            var code = res.code;
            if (code) {
              console.log('获取用户登录凭证：' + code)
            } else {
              console.log('获取用户登录态失败：' + res.errMsg)
            }
          }
        })
      wx.cloud.init()
      wx.cloud.callFunction({
        // 云函数名称
        name: 'login',
        // 传给云函数的参数
        data: {
          a: 1,
          b: 2,
        },
        success(res) {
          console.log('got login')
          console.log(res.result) // 3
        },
        fail: console.error
      })
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        // console.log('App Hide')
    },
    globalData: {
        hasLogin: false,
        minAccountId: 1,
        planBAccountIds: [1, 3],
    }
});