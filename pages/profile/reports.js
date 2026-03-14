Page({
  data: {
    reports: []
  },
  onLoad: function() {
    this.loadReports();
  },
  onShow: function() {
    this.loadReports();
  },
  loadReports: function() {
    const reports = wx.getStorageSync('assessment_history') || [];
    this.setData({ reports });
  },
  clearHistory: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有测评记录吗？',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('assessment_history', []);
          this.loadReports();
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }.bind(this)
    });
  },
  viewDetail: function(e) {
    const index = e.currentTarget.dataset.index;
    const report = this.data.reports[index];
    wx.showModal({
      title: '测评报告 ' + report.time,
      content: '分数：' + report.score + '分\n等级：' + report.level,
      showCancel: false
    });
  }
})