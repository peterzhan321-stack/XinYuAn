Page({
  data: {
    // 冥想主题
    themes: [
      {
        id: 1,
        name: '呼吸专注',
        icon: '🌬️',
        instructions: [
          '请找一个安静的地方，保持舒适的坐姿。',
          '闭上眼睛，将注意力集中在呼吸上。',
          '感受空气进入鼻腔，充满肺部。',
          '感受空气从肺部呼出，离开鼻腔。',
          '如果思绪飘走，温柔地将注意力拉回呼吸。',
          '继续专注于呼吸的节奏，保持平静。'
        ]
      },
      {
        id: 2,
        name: '身体扫描',
        icon: '🧘',
        instructions: [
          '请找一个安静的地方，保持舒适的坐姿。',
          '闭上眼睛，从头部开始，感受身体的每个部位。',
          '注意头部的感觉，然后是颈部、肩膀。',
          '继续向下，感受手臂、胸部、腹部。',
          '感受腿部、脚部的感觉。',
          '保持对全身的觉察，保持平静。'
        ]
      },
      {
        id: 3,
        name: '正念觉察',
        icon: '💭',
        instructions: [
          '请找一个安静的地方，保持舒适的坐姿。',
          '闭上眼睛，觉察当下的感受。',
          '注意周围的声音，但不要被它们带走。',
          '注意身体的感觉，情绪的变化。',
          '保持觉察，不做判断，只是观察。',
          '保持这种觉察状态，保持平静。'
        ]
      }
    ],
    // 时间选项
    timeOptions: [
      { label: '1分钟', value: 60 },
      { label: '2分钟', value: 120 },
      { label: '3分钟', value: 180 }
    ],
    // 背景音效
    sounds: [
      { id: 1, name: '雨声', icon: '🌧️' },
      { id: 2, name: '森林', icon: '🌲' },
      { id: 3, name: '海浪', icon: '🌊' },
      { id: 4, name: '无音效', icon: '🔇' }
    ],
    selectedTheme: 1,
    selectedTime: 60,
    selectedSound: 4,
    isRunning: false,
    isPaused: false,
    timeLeft: 60,
    totalTime: 60,
    formattedTime: '01:00',
    currentInstruction: '',
    currentTheme: {},
    instructionIndex: 0,
    timer: null,
    progress: 0
  },

  onLoad: function(options) {
    console.log('快速冥想页面加载');
    this.initMeditation();
  },

  onUnload: function() {
    // 页面卸载时停止计时器
    this.stopMeditation();
  },

  // 初始化冥想
  initMeditation: function() {
    const selectedTheme = this.data.themes.find(theme => theme.id === this.data.selectedTheme);
    this.setData({
      currentTheme: selectedTheme,
      currentInstruction: selectedTheme.instructions[0],
      timeLeft: this.data.selectedTime,
      totalTime: this.data.selectedTime,
      formattedTime: this.formatTime(this.data.selectedTime),
      isRunning: false,
      isPaused: false,
      instructionIndex: 0,
      progress: 0
    });
  },

  // 选择主题
  selectTheme: function(e) {
    const themeId = e.currentTarget.dataset.id;
    const selectedTheme = this.data.themes.find(theme => theme.id === themeId);
    
    this.setData({
      selectedTheme: themeId,
      currentTheme: selectedTheme,
      currentInstruction: selectedTheme.instructions[0],
      instructionIndex: 0
    });
  },

  // 选择时间
  selectTime: function(e) {
    const timeValue = e.currentTarget.dataset.value;
    
    this.setData({
      selectedTime: timeValue,
      timeLeft: timeValue,
      totalTime: timeValue,
      formattedTime: this.formatTime(timeValue)
    });
  },

  // 选择音效
  selectSound: function(e) {
    const soundId = e.currentTarget.dataset.id;
    
    this.setData({
      selectedSound: soundId
    });
  },

  // 开始冥想
  startMeditation: function() {
    this.setData({
      isRunning: true,
      isPaused: false
    });
    this.startTimer();
    this.drawProgressRing();
  },

  // 暂停冥想
  pauseMeditation: function() {
    if (this.data.isPaused) {
      // 继续冥想
      this.setData({ isPaused: false });
      this.startTimer();
    } else {
      // 暂停冥想
      this.setData({ isPaused: true });
      if (this.data.timer) {
        clearInterval(this.data.timer);
      }
    }
  },

  // 停止冥想
  stopMeditation: function() {
    this.setData({
      isRunning: false,
      isPaused: false
    });
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    this.initMeditation();
  },

  // 开始计时器
  startTimer: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }

    this.data.timer = setInterval(() => {
      let timeLeft = this.data.timeLeft - 1;
      let progress = ((this.data.totalTime - timeLeft) / this.data.totalTime) * 100;

      if (timeLeft <= 0) {
        // 冥想结束
        this.completeMeditation();
      } else {
        // 更新时间和进度
        this.setData({
          timeLeft: timeLeft,
          formattedTime: this.formatTime(timeLeft),
          progress: progress
        });

        // 每10秒更新一次指导语
        if (timeLeft % 10 === 0) {
          this.updateInstruction();
        }

        // 更新进度环
        this.drawProgressRing();
      }
    }, 1000);
  },

  // 更新指导语
  updateInstruction: function() {
    const instructions = this.data.currentTheme.instructions;
    let instructionIndex = this.data.instructionIndex + 1;

    if (instructionIndex >= instructions.length) {
      instructionIndex = 0;
    }

    this.setData({
      currentInstruction: instructions[instructionIndex],
      instructionIndex: instructionIndex
    });
  },

  // 绘制进度环
  drawProgressRing: function() {
    const ctx = wx.createCanvasContext('progressCanvas', this);
    const width = 200;
    const height = 200;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;
    const lineWidth = 10;

    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 绘制背景圆环
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle('#e0e0e0');
    ctx.stroke();

    // 绘制进度圆环
    const progress = this.data.progress;
    const angle = (progress / 100) * 2 * Math.PI - Math.PI / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, angle);
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle('#4A90E2');
    ctx.stroke();

    // 绘制中心文字
    ctx.setFontSize(24);
    ctx.setFillStyle('#333');
    ctx.setTextAlign('center');
    ctx.setTextBaseline('middle');
    ctx.fillText(`${Math.round(progress)}%`, centerX, centerY);

    ctx.draw();
  },

  // 冥想完成
  completeMeditation: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }

    this.setData({
      isRunning: false,
      progress: 100
    });

    // 记录冥想历史
    this.recordMeditation();

    // 显示完成提示
    wx.showModal({
      title: '冥想完成',
      content: '恭喜你完成了快速冥想练习！\n\n通过这种练习，你可以快速平静心情，缓解压力。',
      showCancel: false,
      confirmText: '返回',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    });
  },

  // 记录冥想历史
  recordMeditation: function() {
    // 这里可以将冥想历史保存到本地存储或服务器
    const history = wx.getStorageSync('meditationHistory') || [];
    
    const meditationRecord = {
      id: Date.now(),
      title: '快速冥想',
      theme: this.data.currentTheme.name,
      time: new Date().toLocaleString('zh-CN'),
      duration: Math.round(this.data.totalTime / 60) + '分钟'
    };
    
    history.unshift(meditationRecord);
    wx.setStorageSync('meditationHistory', history);
  },

  // 格式化时间
  formatTime: function(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
});