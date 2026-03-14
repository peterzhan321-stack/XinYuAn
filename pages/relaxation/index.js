Page({
  data: {
    exercises: [
      {
        id: 1,
        icon: '🌬️',
        title: '正念呼吸',
        duration: '3-5分钟',
        description: '通过呼吸调节情绪，专注当下',
        color: '#4A90E2'
      },
      {
        id: 2,
        icon: '🧘',
        title: '身体扫描',
        duration: '5-8分钟',
        description: '关注身体感受，缓解紧张',
        color: '#9C27B0'
      },
      {
        id: 3,
        icon: '💆',
        title: '渐进式肌肉放松',
        duration: '7-10分钟',
        description: '逐步放松全身肌肉，释放压力',
        color: '#F44336'
      },
      {
        id: 4,
        icon: '🌊',
        title: '快速冥想',
        duration: '1-3分钟',
        description: '快速平静，随时可用',
        color: '#4CAF50'
      }
    ],
    history: [
      {
        id: 1,
        title: '正念呼吸练习',
        time: '2023-10-01 10:30',
        duration: '3分钟'
      },
      {
        id: 2,
        title: '身体扫描',
        time: '2023-09-28 15:45',
        duration: '5分钟'
      }
    ]
  },

  onLoad: function(options) {
    console.log('放松练习页面加载');
    // 可以在这里加载用户的练习历史
  },

  // 开始练习 - 点击练习卡片时触发
  startExercise: function(e) {
    const id = e.currentTarget.dataset.id;
    console.log('点击练习ID:', id);
    
    // 根据不同的练习ID跳转到不同的页面
    switch(id) {
      case 1: // 正念呼吸
        this.goToBreathing();
        break;
      case 2: // 身体扫描
        this.goToBodyScan();
        break;
      case 3: // 渐进式肌肉放松
        this.goToMuscleRelaxation();
        break;
      case 4: // 快速冥想
        this.goToQuickMeditation();
        break;
      default:
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
    }
  },

  // 跳转到正念呼吸页面
  goToBreathing: function() {
    console.log('跳转到正念呼吸页面');
    wx.navigateTo({
      url: '/pages/breathing/breathing',
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

  // 跳转到身体扫描页面
  goToBodyScan: function() {
    console.log('跳转到身体扫描页面');
    wx.navigateTo({
      url: '/pages/bodyScan/bodyScan',
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

  // 跳转到肌肉放松页面
  goToMuscleRelaxation: function() {
    console.log('跳转到渐进式肌肉放松页面');
    wx.navigateTo({
      url: '/pages/muscle_relaxation/muscle_relaxation',
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

  // 跳转到快速冥想页面
  goToQuickMeditation: function() {
    console.log('跳转到快速冥想页面');
    wx.navigateTo({
      url: '/pages/quick_meditation/quick_meditation',
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

  // 清空历史记录
  clearHistory: function() {
    const that = this;
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有练习历史吗？',
      success: function(res) {
        if (res.confirm) {
          that.setData({
            history: []
          });
          wx.showToast({
            title: '已清空历史',
            icon: 'success'
          });
        }
      }
    });
  },

  onShareAppMessage: function() {
    return {
      title: '放松练习 - 缓解压力，提升幸福感',
      path: '/pages/relaxation/index'
    };
  }
});