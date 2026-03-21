Page({
  data: {
    currentMonth: '',
    calendarDays: [],
    selectedDate: '',
    recordsByDate: {},
    assessmentsByDate: {}
  },

  onLoad: function() {
    this.generateCalendar();
    this.loadRecords();
  },

  onShow: function() {
    this.generateCalendar();
    this.loadRecords();
  },

  generateCalendar: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    this.setData({
      currentMonth: `${year}年${month + 1}月`
    });
    
    const days = this.getDaysInMonth(year, month);
    this.setData({
      calendarDays: days
    });
  },

  getDaysInMonth: function(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dateStr = currentDate.toISOString().split('T')[0];
      const isCurrentMonth = currentDate.getMonth() === month;
      
      days.push({
        date: currentDate.getDate(),
        dateStr: dateStr,
        isCurrentMonth: isCurrentMonth,
        isToday: currentDate.toDateString() === new Date().toDateString()
      });
    }
    
    return days;
  },

  loadRecords: function() {
    const moodRecords = wx.getStorageSync('mood_records') || [];
    const assessmentRecords = wx.getStorageSync('assessment_history') || [];
    
    const recordsByDate = {};
    const assessmentsByDate = {};
    
    // 处理心情记录
    moodRecords.forEach(record => {
      const date = new Date(record.time);
      const dateStr = date.toISOString().split('T')[0];
      if (!recordsByDate[dateStr]) {
        recordsByDate[dateStr] = [];
      }
      recordsByDate[dateStr].push(record);
    });
    
    // 处理测评记录
    assessmentRecords.forEach(record => {
      const date = new Date(record.time);
      const dateStr = date.toISOString().split('T')[0];
      if (!assessmentsByDate[dateStr]) {
        assessmentsByDate[dateStr] = [];
      }
      assessmentsByDate[dateStr].push(record);
    });
    
    this.setData({
      recordsByDate: recordsByDate,
      assessmentsByDate: assessmentsByDate
    });
  },

  getActivityLevel: function(dateStr) {
    const moodCount = this.data.recordsByDate[dateStr] ? this.data.recordsByDate[dateStr].length : 0;
    const assessmentCount = this.data.assessmentsByDate[dateStr] ? this.data.assessmentsByDate[dateStr].length : 0;
    const total = moodCount + assessmentCount;
    
    if (total === 0) return 0;
    if (total === 1) return 1;
    if (total === 2) return 2;
    return 3;
  },

  getActivityColor: function(level) {
    const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b'];
    return colors[level] || colors[0];
  },

  onDayTap: function(e) {
    const dateStr = e.currentTarget.dataset.dateStr;
    const records = this.data.recordsByDate[dateStr] || [];
    const assessments = this.data.assessmentsByDate[dateStr] || [];
    
    if (records.length === 0 && assessments.length === 0) {
      wx.showToast({
        title: '当天无记录',
        icon: 'none'
      });
      return;
    }
    
    let content = '';
    if (records.length > 0) {
      content += '心情记录:\n';
      records.forEach((record, index) => {
        content += `${index + 1}. ${record.mood} - ${record.text || '（无内容）'}\n`;
      });
    }
    
    if (assessments.length > 0) {
      content += '\n测评记录:\n';
      assessments.forEach((assessment, index) => {
        content += `${index + 1}. 得分: ${assessment.score} - ${assessment.level}\n`;
      });
    }
    
    wx.showModal({
      title: dateStr,
      content: content,
      showCancel: false
    });
  }
})