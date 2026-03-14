Page({
  data: {
    practices: [
      {
        id: 1,
        name: '正念呼吸',
        time: '3分钟',
        desc: '3分钟快速平复情绪，专注当下',
        color: '#2196F3',
        icon: '/images/breathing-icon.png'
      },
      {
        id: 2,
        name: '身体扫描',
        time: '5分钟',
        desc: '5分钟身体放松，释放紧张',
        color: '#9C27B0',
        icon: '/images/body-scan-icon.png'
      },
      {
        id: 3,
        name: '渐进式肌肉放松',
        time: '7分钟',
        desc: '7分钟深度放松，缓解肌肉紧张',
        color: '#F44336',
        icon: '/images/muscle-icon.png'
      },
      {
        id: 4,
        name: '快速冥想',
        time: '1分钟',
        desc: '1分钟快速平静，随时可用',
        color: '#4CAF50',
        icon: '/images/meditation-icon.png'
      }
    ]
  },

  // 跳转到正念呼吸
  goToBreathing: function() {
    wx.navigateTo({
      url: '/pages/breathing/breathing'
    });
  },

  // 跳转到身体扫描（待开发）
  goToBodyScan: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  // 跳转到肌肉放松（待开发）
  goToMuscleRelaxation: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  // 跳转到快速冥想（待开发）
  goToQuickMeditation: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  onLoad: function() {
    console.log('放松练习页面加载');
  }
});