Page({
  data: {
    currentDate: '',
    moodScore: 72,
    recordCount: 0,
    assessmentCount: 0,
    recentRecords: []
  },
  onLoad: function() {
    this.setCurrentDate();
  },
  onShow: function() {
    this.setCurrentDate();
    this.loadRecentRecords();
    this.loadUserStats();
  },
  setCurrentDate: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[now.getDay()];
    this.setData({
      currentDate: year + '年' + month + '月' + day + '日 星期' + weekday
    });
  },
  loadRecentRecords: function() {
    const records = wx.getStorageSync('mood_records') || this.getSampleRecords();
    this.setData({
      recentRecords: records.slice(0, 3)
    });
  },
  getSampleRecords: function() {
    return [
      {
        id: 1,
        mood: '平静',
        text: '今天的学习计划完成得很好，感觉很有成就感',
        time: '今天 14:30'
      },
      {
        id: 2,
        mood: '快乐',
        text: '和朋友一起吃了火锅，聊得很开心',
        time: '昨天 19:20'
      },
      {
        id: 3,
        mood: '焦虑',
        text: '明天有考试，感觉复习得还不够充分',
        time: '昨天 22:10'
      }
    ];
  },
  loadUserStats: function() {
    const moodRecords = wx.getStorageSync('mood_records') || [];
    const assessments = wx.getStorageSync('assessment_history') || [];
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentRecords = moodRecords.filter(record => {
      const recordTime = new Date(record.time);
      return recordTime > oneWeekAgo;
    });
    
    let avgMoodScore = 72;
    if (recentRecords.length > 0) {
      const moodScores = { '快乐': 90, '平静': 80, '焦虑': 40, '悲伤': 30, '愤怒': 20 };
      const total = recentRecords.reduce((sum, record) => {
        return sum + (moodScores[record.mood] || 50);
      }, 0);
      avgMoodScore = Math.round(total / recentRecords.length);
    }
    
    this.setData({
      moodScore: avgMoodScore,
      recordCount: moodRecords.length,
      assessmentCount: assessments.length
    });
  },
  goToMoodRecord: function() {
    wx.switchTab({
      url: '/pages/mood_record/mood_record'
    });
  },
  goToAssessment: function() {
    wx.switchTab({
      url: '/pages/assessment/assessment'
    });
  },
  goToIntervention: function() {
    wx.navigateTo({
      url: '/pages/relaxation/index'
    });
  },
  viewAllRecords: function() {
    wx.navigateTo({
      url: '/pages/profile/records'
    });
  }
})