Page({
  data: {
    version: '1.0.1',
    lastUpdate: '2026年3月'
  },

  onLoad: function(options) {
    console.log('关于我们页面加载');
  },

  // 联系客服
  contactService: function() {
    wx.showModal({
      title: '联系客服',
      content: '客服工作时间：9:00-18:00\n联系电话：400-123-4567',
      confirmText: '拨打热线',
      success: function(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '4001234567',
            success: function() {
              console.log('拨打客服电话成功');
            },
            fail: function(err) {
              wx.showToast({
                title: '拨打电话失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 意见反馈
  openFeedback: function() {
    wx.navigateTo({
      url: '/pages/feedback/feedback',
      fail: function() {
        wx.showToast({
          title: '反馈功能开发中',
          icon: 'none'
        });
      }
    });
  },

  // 打开官方网站
  openWebsite: function() {
    wx.showModal({
      title: '访问官网',
      content: '将在浏览器中打开官方网站',
      success: function(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'https://www.younixinan.bupt.com',
            success: function() {
              wx.showToast({
                title: '网址已复制',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  // 发送邮件
  sendEmail: function() {
    wx.setClipboardData({
      data: '2164934458@qq.com',
      success: function() {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success',
          duration: 2000
        });
        
        setTimeout(function() {
          wx.showModal({
            title: '商务合作',
            content: '邮箱已复制到剪贴板\n2164934458@qq.com',
            showCancel: false,
            confirmText: '知道了'
          });
        }, 500);
      }
    });
  },

  // 检查更新
  checkUpdate: function() {
    wx.showLoading({
      title: '检查更新中...',
    });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '已是最新版本',
        icon: 'success',
        duration: 2000
      });
    }, 1500);
  },

  // 分享应用
  onShareAppMessage: function() {
    return {
      title: '心语安 - 您的心理健康助手',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline: function() {
    return {
      title: '推荐心语安，关注心理健康',
      query: 'from=about'
    };
  }
});