Page({
  data: {
    // 练习步骤
    steps: [
      {
        id: 1,
        title: '准备',
        content: '找一个安静舒适的地方，坐下或躺下，放松身体。',
        muscleGroup: '全身准备',
        icon: '🧘',
        duration: 10
      },
      {
        id: 2,
        title: '手部',
        content: '用力握紧双拳，感受手部肌肉的紧张，保持5秒，然后放松。',
        muscleGroup: '手部肌肉',
        icon: '✊',
        duration: 10
      },
      {
        id: 3,
        title: '手臂',
        content: '弯曲手臂，用力收紧二头肌，保持5秒，然后放松。',
        muscleGroup: '手臂肌肉',
        icon: '💪',
        duration: 10
      },
      {
        id: 4,
        title: '肩部',
        content: '用力耸起肩膀，靠近耳朵，保持5秒，然后放松。',
        muscleGroup: '肩部肌肉',
        icon: '🙆',
        duration: 10
      },
      {
        id: 5,
        title: '面部',
        content: '用力皱起眉头，紧闭双眼，咬紧牙关，保持5秒，然后放松。',
        muscleGroup: '面部肌肉',
        icon: '😬',
        duration: 10
      },
      {
        id: 6,
        title: '胸部',
        content: '深吸一口气，扩张胸部，保持5秒，然后缓慢呼出。',
        muscleGroup: '胸部肌肉',
        icon: '🫁',
        duration: 10
      },
      {
        id: 7,
        title: '腹部',
        content: '用力收紧腹部肌肉，保持5秒，然后放松。',
        muscleGroup: '腹部肌肉',
        icon: '🤰',
        duration: 10
      },
      {
        id: 8,
        title: '腿部',
        content: '用力伸直双腿，收紧大腿肌肉，保持5秒，然后放松。',
        muscleGroup: '腿部肌肉',
        icon: '🦵',
        duration: 10
      },
      {
        id: 9,
        title: '脚部',
        content: '用力弯曲脚趾，收紧脚部肌肉，保持5秒，然后放松。',
        muscleGroup: '脚部肌肉',
        icon: '👣',
        duration: 10
      },
      {
        id: 10,
        title: '全身放松',
        content: '现在，让全身肌肉完全放松，感受放松的状态。',
        muscleGroup: '全身放松',
        icon: '😌',
        duration: 15
      }
    ],
    currentStep: 1,
    totalSteps: 10,
    progress: 0,
    currentInstruction: {},
    isRunning: false,
    isPaused: false,
    timeLeft: 0,
    totalTime: 0,
    formattedTime: '00:00',
    timer: null
  },

  onLoad: function(options) {
    console.log('渐进式肌肉放松页面加载');
    this.initExercise();
  },

  onUnload: function() {
    // 页面卸载时停止计时器
    this.stopExercise();
  },

  // 初始化练习
  initExercise: function() {
    const firstStep = this.data.steps[0];
    this.setData({
      currentInstruction: firstStep,
      currentStep: 1,
      progress: 0,
      timeLeft: firstStep.duration,
      totalTime: 0,
      formattedTime: '00:00',
      isRunning: false,
      isPaused: false
    });
  },

  // 开始练习
  startExercise: function() {
    this.setData({
      isRunning: true,
      isPaused: false
    });
    this.startTimer();
  },

  // 暂停练习
  pauseExercise: function() {
    if (this.data.isPaused) {
      // 继续练习
      this.setData({ isPaused: false });
      this.startTimer();
    } else {
      // 暂停练习
      this.setData({ isPaused: true });
      if (this.data.timer) {
        clearInterval(this.data.timer);
      }
    }
  },

  // 停止练习
  stopExercise: function() {
    this.setData({
      isRunning: false,
      isPaused: false
    });
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    this.initExercise();
  },

  // 开始计时器
  startTimer: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }

    this.data.timer = setInterval(() => {
      let timeLeft = this.data.timeLeft - 1;
      let totalTime = this.data.totalTime + 1;

      if (timeLeft <= 0) {
        // 当前步骤结束，进入下一个步骤
        this.nextStep();
      } else {
        // 更新时间
        this.setData({
          timeLeft: timeLeft,
          totalTime: totalTime,
          formattedTime: this.formatTime(totalTime)
        });
      }
    }, 1000);
  },

  // 进入下一个步骤
  nextStep: function() {
    const currentStep = this.data.currentStep;
    const totalSteps = this.data.totalSteps;

    if (currentStep < totalSteps) {
      // 进入下一个步骤
      const nextStep = this.data.steps[currentStep];
      this.setData({
        currentStep: currentStep + 1,
        currentInstruction: nextStep,
        timeLeft: nextStep.duration,
        progress: (currentStep / totalSteps) * 100
      });
    } else {
      // 练习结束
      this.completeExercise();
    }
  },

  // 练习完成
  completeExercise: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }

    this.setData({
      isRunning: false,
      progress: 100
    });

    // 记录练习历史
    this.recordExercise();

    // 显示完成提示
    wx.showModal({
      title: '练习完成',
      content: '恭喜你完成了渐进式肌肉放松练习！\n\n通过这种练习，你可以有效缓解身体紧张，减轻压力。',
      showCancel: false,
      confirmText: '返回',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    });
  },

  // 记录练习历史
  recordExercise: function() {
    // 这里可以将练习历史保存到本地存储或服务器
    const history = wx.getStorageSync('relaxationHistory') || [];
    
    const exerciseRecord = {
      id: Date.now(),
      title: '渐进式肌肉放松',
      time: new Date().toLocaleString('zh-CN'),
      duration: Math.round(this.data.totalTime / 60) + '分钟',
      steps: this.data.totalSteps
    };
    
    history.unshift(exerciseRecord);
    wx.setStorageSync('relaxationHistory', history);
  },

  // 格式化时间
  formatTime: function(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
});