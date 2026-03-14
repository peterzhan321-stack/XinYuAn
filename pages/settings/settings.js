Page({
  data: {
    settings: {
      dailyReminder: true,
      reminderTime: '20:00',
      pushNotification: true,
      dataEncryption: true,
      anonymousStatistics: true,
      darkMode: false,
      fontSize: 16
    },
    cacheSize: '0.00 MB',
    fontSizeText: '中等'
  },

  onLoad: function(options) {
    console.log('应用设置页面加载');
    this.loadSettings();
    this.calculateCacheSize();
  },

  // 加载设置
  loadSettings: function() {
    const savedSettings = wx.getStorageSync('appSettings');
    if (savedSettings) {
      this.setData({
        settings: savedSettings
      });
    }
    this.updateFontSizeText();
  },

  // 保存设置
  saveSettings: function() {
    wx.setStorageSync('appSettings', this.data.settings);
  },

  // 切换每日提醒
  toggleDailyReminder: function(e) {
    const value = e.detail.value;
    this.setData({
      'settings.dailyReminder': value
    });
    this.saveSettings();
  },

  // 设置提醒时间
  setReminderTime: function() {
    const that = this;
    wx.showTimePicker({
      start: '00:00',
      end: '23:59',
      current: this.data.settings.reminderTime,
      success: function(res) {
        that.setData({
          'settings.reminderTime': res.result
        });
        that.saveSettings();
      }
    });
  },

  // 切换推送通知
  togglePushNotification: function(e) {
    const value = e.detail.value;
    this.setData({
      'settings.pushNotification': value
    });
    this.saveSettings();
  },

  // 切换数据加密
  toggleDataEncryption: function(e) {
    const value = e.detail.value;
    this.setData({
      'settings.dataEncryption': value
    });
    this.saveSettings();
  },

  // 切换匿名统计
  toggleAnonymousStatistics: function(e) {
    const value = e.detail.value;
    this.setData({
      'settings.anonymousStatistics': value
    });
    this.saveSettings();
  },

  // 切换深色模式
  toggleDarkMode: function(e) {
    const value = e.detail.value;
    this.setData({
      'settings.darkMode': value
    });
    this.saveSettings();
    
    // 这里可以添加切换深色模式的逻辑
    if (value) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#121212'
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      });
    }
  },

  // 设置字体大小
  setFontSize: function(e) {
    const value = e.detail.value;
    this.setData({
      'settings.fontSize': value
    });
    this.updateFontSizeText();
    this.saveSettings();
  },

  // 更新字体大小文本
  updateFontSizeText: function() {
    const fontSize = this.data.settings.fontSize;
    let fontSizeText = '中等';
    
    if (fontSize <= 13) {
      fontSizeText = '小';
    } else if (fontSize >= 17) {
      fontSizeText = '大';
    }
    
    this.setData({
      fontSizeText: fontSizeText
    });
  },

  // 导出数据
  exportData: function() {
    wx.showModal({
      title: '导出数据',
      content: '您确定要导出所有数据吗？',
      success: (res) => {
        if (res.confirm) {
          // 模拟导出数据
          wx.showLoading({
            title: '导出中...',
            mask: true
          });
          
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '数据导出成功',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  // 清理缓存
  clearCache: function() {
    wx.showModal({
      title: '清理缓存',
      content: '您确定要清理所有缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.setData({
            cacheSize: '0.00 MB'
          });
          wx.showToast({
            title: '缓存清理成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 计算缓存大小
  calculateCacheSize: function() {
    // 模拟缓存大小计算
    const cacheSize = (Math.random() * 10).toFixed(2);
    this.setData({
      cacheSize: cacheSize + ' MB'
    });
  },

  // 显示用户协议
  showUserAgreement: function() {
    wx.showModal({
      title: '用户协议',
      content: '用户协议内容...\n\n1. 您在使用本应用时，必须遵守相关法律法规。\n2. 您不得利用本应用从事任何违法活动。\n3. 我们将保护您的个人隐私。\n4. 本协议最终解释权归本应用所有。',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  // 显示隐私政策
  showPrivacyPolicy: function() {
    wx.showModal({
      title: '隐私政策',
      content: '隐私政策内容...\n\n1. 我们收集的信息仅用于提供服务。\n2. 我们不会向第三方分享您的个人信息。\n3. 我们会采取措施保护您的信息安全。\n4. 您可以随时查看和修改您的个人信息。',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  // 重置所有设置
  resetSettings: function() {
    wx.showModal({
      title: '重置设置',
      content: '您确定要重置所有设置吗？',
      success: (res) => {
        if (res.confirm) {
          const defaultSettings = {
            dailyReminder: true,
            reminderTime: '20:00',
            pushNotification: true,
            dataEncryption: true,
            anonymousStatistics: true,
            darkMode: false,
            fontSize: 16
          };
          
          this.setData({
            settings: defaultSettings
          });
          this.updateFontSizeText();
          this.saveSettings();
          
          wx.showToast({
            title: '设置已重置',
            icon: 'success'
          });
        }
      }
    });
  }
});