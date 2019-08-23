//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    button_size: 'default',
    massage: 'init',
    username: '',
    password: '',
    checked: false,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  submit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    console.log('global', getApp().globalData.userInfo)
    var username = e.detail.value.username
    var password = e.detail.value.password
    var remember_password = e.detail.value.remember
    wx.$log('submit', e.detail.value)
    if (remember_password.length==0) {
      wx.setStorage({
        key: 'remember_password',
        data: false,
      })
    } else {
      wx.setStorage({
        key: 'remember_password',
        data: true,
      })
    }

    if (username == 'goaleadmin' && password == 'goaleadmin') {
      // 注册密码
      // 这里的键应该发送一条信息得到用户的标识信息
      // 或者获取session中的身份标识

      // 之后封装一个函数来实现设置键值
      wx.setStorage({
        key: username,
        data: password,
        success: function (response) {
          var r = response
          wx.$log('success set data', r)
        }
      })

      // 转到主页
      wx.redirectTo({
        url: '../home/home'
      })
    } else {
      console.log('账号或者密码错误！')
      this.setData({
        message: '账号或者密码错误！'
      })
    }
  },
  redirect_main: function () {
    wx.redirectTo({
      url: '../logs/logs',
    })
  },
  onLoad: function () {
    wx.$log('onload')

    var remember = false
    // 设置remember checkbox
    wx.getStorage({
      key: 'remember_password',
      success: function(res) {
        self.setData({
          checked: res.data,
        })
        wx.$log('remember', res.data)
        remember = res.data
      },
    })


    wx.$log('onshow')
    var self = this
    // 初始化获取用户名和密码
    // 从session中获取用户名
    var username = 'goaleadmin'

    wx.getStorage({
      key: username,
      success: function (response) {
        var r = response
        var password = r.data
        wx.$log('success get data', password)

        // 将用户名和密码填入表单
        // self.data.username = username
        // self.data.password = password
        if (remember) {
          self.setData({
            username: username,
            password: password,
          })
        }

        wx.$log(self.data.username, self.data.password)
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
