Page({
  data: {
    userInfo: {
      nickName: '',
      userId: ''
    },
    recordCount: 0,
    continuousDays: 0,
    assessmentCount: 0,
    isLoggedIn: false
  },

  onLoad: function(options) {
    console.log('个人中心页面加载');
    this.checkLoginStatus();
    this.loadUserData();
  },

  onShow: function() {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        isLoggedIn: true
      });
    } else {
      this.setData({
        userInfo: { nickName: '心语安用户', userId: '未登录' },
        isLoggedIn: false
      });
    }
  },

  // 加载用户数据
  loadUserData: function() {
    // 这里可以从后台获取用户数据
    // 暂时使用模拟数据
    this.setData({
      recordCount: 24,
      continuousDays: 7,
      assessmentCount: 3
    });
  },

  // 登录/注册
  handleLogin: function() {
    wx.showModal({
      title: '登录提示',
      content: '登录后可以同步数据，享受更多服务',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          // 模拟登录
          const userInfo = {
            nickName: '张三',
            userId: 'U12345678'
          };
          wx.setStorageSync('userInfo', userInfo);
          
          this.setData({
            userInfo: userInfo,
            isLoggedIn: true
          });
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 退出登录
  handleLogout: function() {
    wx.showModal({
      title: '确认退出',
      content: '退出登录将清除本地数据',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          this.setData({
            userInfo: { nickName: '心语安用户', userId: '未登录' },
            isLoggedIn: false
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  },

  // 跳转到情绪记录历史
  goToMyRecords: function() {
    wx.navigateTo({
      url: '/pages/profile/records',
      success: function(res) {
        console.log('跳转到记录历史成功');
      },
      fail: function(err) {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'error'
        });
      }
    });
  },

  // 跳转到测评报告
  goToMyAssessments: function() {
    wx.navigateTo({
      url: '/pages/profile/reports',
      success: function(res) {
        console.log('跳转到测评报告成功');
      },
      fail: function(err) {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'error'
        });
      }
    });
  },

  // 跳转到心理干预方案
  goToInterventions: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 跳转到紧急联系方式
  goToEmergency: function() {
    wx.showModal({
      title: '紧急联系方式',
      content: '心理援助热线：12320\n北京心理危机干预中心：010-82951332\n全国希望24热线：400-161-9995',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  // 跳转到应用设置
  goToSettings: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 跳转到关于我们页面
  goToAbout: function() {
    console.log('跳转到关于我们页面');
    wx.navigateTo({
      url: '/pages/about/about',
      success: function(res) {
        console.log('跳转成功');
      },
      fail: function(err) {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'error'
        });
      }
    });
  },

  // 页面分享
  onShareAppMessage: function() {
    return {
      title: '心语安 - 关注心理健康',
      path: '/pages/index/index'
    };
  }
});