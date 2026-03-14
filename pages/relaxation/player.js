Page({
  data: {
    exerciseType: '',
    title: '',
    duration: '',
    isPlaying: false,
    currentTime: 0,
    totalTime: 180,
    timer: null,
    tips: [],
    currentTipIndex: 0
  },

  onLoad: function(options) {
    const { type, title, duration } = options;
    let totalTime = 180;
    
    if (duration.includes('1分钟')) totalTime = 60;
    else if (duration.includes('3分钟')) totalTime = 180;
    else if (duration.includes('5分钟')) totalTime = 300;
    else if (duration.includes('7分钟')) totalTime = 420;
    else if (duration.includes('10分钟')) totalTime = 600;
    
    const tips = this.getTipsByType(type);
    
    this.setData({
      exerciseType: type,
      title: title || '放松练习',
      duration: duration || '3分钟',
      totalTime: totalTime,
      tips: tips
    });
  },

  onUnload: function() {
    this.stopTimer();
  },

  onHide: function() {
    this.stopTimer();
  },

  getTipsByType: function(type) {
    const allTips = {
      breathing: [
        '找一个舒适的姿势坐好，背部挺直',
        '闭上眼睛，将注意力集中在呼吸上',
        '吸气4秒，感受空气进入身体',
        '屏住呼吸2秒，感受此刻的宁静',
        '缓慢呼气6秒，释放所有紧张',
        '重复这个节奏，保持自然呼吸'
      ],
      body: [
        '从头顶开始，扫描身体的每个部位',
        '感受头部的感觉，无需判断好坏',
        '放松面部肌肉，特别是眼睛和下巴',
        '放松肩膀，让它们自然下垂',
        '放松手臂和手掌，感受重力的作用',
        '继续向下扫描，放松胸部和腹部',
        '放松双腿，感受它们与地面的接触',
        '最后放松脚部，感受全身的放松'
      ],
      muscle: [
        '从脚部开始，用力收紧肌肉5秒',
        '然后完全放松，感受放松的感觉',
        '向上移动到小腿，收紧然后放松',
        '接着是大腿，收紧然后放松',
        '腹部和胸部，收紧然后放松',
        '手臂和手，握紧拳头然后放松',
        '肩膀，向上耸肩然后放松',
        '面部，皱紧然后完全放松'
      ],
      quick: [
        '深呼吸，感受空气进入',
        '缓慢呼气，释放压力',
        '放松肩膀，放下重担',
        '感受此刻的平静',
        '回归当下，继续前进'
      ],
      gratitude: [
        '回想今天让你感恩的三件事',
        '可以是人、事、物或瞬间',
        '感受感恩带来的温暖',
        '将这份感恩留在心中',
        '带着感恩继续生活'
      ],
      sleep: [
        '躺在床上，调整到最舒适的姿势',
        '深呼吸，让身体逐渐放松',
        '想象自己躺在柔软的云朵上',
        '从脚趾开始，想象它们完全放松',
        '逐渐向上，让放松感蔓延全身',
        '想象一个宁静的场景',
        '随着引导，逐渐进入梦乡'
      ]
    };
    
    return allTips[type] || allTips.breathing;
  },

  togglePlay: function() {
    if (this.data.isPlaying) {
      this.pauseExercise();
    } else {
      this.startExercise();
    }
  },

  startExercise: function() {
    this.setData({ isPlaying: true });
    
    const timer = setInterval(() => {
      const newTime = this.data.currentTime + 1;
      const newTipIndex = Math.floor(newTime / 30) % this.data.tips.length;
      
      this.setData({
        currentTime: newTime,
        currentTipIndex: newTipIndex
      });
      
      if (newTime >= this.data.totalTime) {
        this.completeExercise();
      }
    }, 1000);
    
    this.setData({ timer: timer });
  },

  pauseExercise: function() {
    this.setData({ isPlaying: false });
    this.stopTimer();
  },

  stopTimer: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.setData({ timer: null });
    }
  },

  completeExercise: function() {
    this.stopTimer();
    this.setData({ isPlaying: false });
    
    wx.showModal({
      title: '练习完成',
      content: `恭喜您完成了${this.data.duration}的${this.data.title}练习！`,
      showCancel: false,
      success: () => {
        wx.navigateBack();
      }
    });
  },

  skipTip: function() {
    const newIndex = (this.data.currentTipIndex + 1) % this.data.tips.length;
    this.setData({ currentTipIndex: newIndex });
  },

  resetExercise: function() {
    this.stopTimer();
    this.setData({
      isPlaying: false,
      currentTime: 0,
      currentTipIndex: 0
    });
  },

  formatTime: function(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  calculateProgress: function() {
    return (this.data.currentTime / this.data.totalTime) * 100;
  }
})