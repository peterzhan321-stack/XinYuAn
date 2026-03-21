Page({
  data: {
    records: [],
    filteredRecords: [],
    searchKeyword: '',
    isLoading: false,
    hasMore: true,
    expandedRecordId: null,
    editingNote: ''
  },

  onLoad: function() {
    this.loadRecords();
  },

  onShow: function() {
    this.loadRecords();
  },

  loadRecords: function() {
    this.setData({ isLoading: true });
    const allRecords = wx.getStorageSync('mood_records') || [];
    
    setTimeout(() => {
      let filtered = [...allRecords];
      
      if (this.data.searchKeyword) {
        const keyword = this.data.searchKeyword.toLowerCase();
        filtered = filtered.filter(record => 
          (record.text || '').toLowerCase().includes(keyword) || 
          (record.mood || '').includes(keyword)
        );
      }
      
      this.setData({
        records: filtered,
        filteredRecords: filtered,
        hasMore: false,
        isLoading: false
      });
    }, 300);
  },

  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  onSearchConfirm: function() {
    this.loadRecords();
  },

  clearRecords: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有记录吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('mood_records', []);
          this.loadRecords();
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  viewDetail: function(e) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.records[index];
    wx.showModal({
      title: record.mood + ' - ' + record.time,
      content: (record.text || '（无内容）') + '\n\n分析结果：' + (record.analysis ? record.analysis.aiDetectedEmotion : '未分析') + '\n\n备注：' + (record.note || '无'),
      showCancel: false
    });
  },

  editRecord: function(e) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.records[index];
    wx.showModal({
      title: '编辑记录',
      editable: true,
      placeholderText: '请输入新的内容',
      success: (res) => {
        if (res.confirm && res.content) {
          let allRecords = wx.getStorageSync('mood_records') || [];
          const recordIndex = allRecords.findIndex(r => r.id === record.id);
          if (recordIndex !== -1) {
            allRecords[recordIndex].text = res.content;
            wx.setStorageSync('mood_records', allRecords);
            this.loadRecords();
            wx.showToast({
              title: '修改成功',
              icon: 'success'
            });
          }
        }
      }
    });
  },

  deleteRecord: function(e) {
    const index = e.currentTarget.dataset.index;
    const record = this.data.records[index];
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          let allRecords = wx.getStorageSync('mood_records') || [];
          allRecords = allRecords.filter(r => r.id !== record.id);
          wx.setStorageSync('mood_records', allRecords);
          this.loadRecords();
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  exportRecords: function() {
    const records = wx.getStorageSync('mood_records') || [];
    if (records.length === 0) {
      wx.showToast({
        title: '没有可导出的记录',
        icon: 'none'
      });
      return;
    }
    wx.showToast({
      title: '导出功能开发中',
      icon: 'none'
    });
  },

  toggleExpandRecord: function(e) {
    const recordId = e.currentTarget.dataset.id;
    const record = this.data.records.find(r => r.id === recordId);
    
    if (this.data.expandedRecordId === recordId) {
      this.setData({
        expandedRecordId: null
      });
    } else {
      this.setData({
        expandedRecordId: recordId,
        editingNote: record.note || ''
      });
    }
  },

  onNoteInput: function(e) {
    this.setData({
      editingNote: e.detail.value
    });
  },

  saveNote: function(e) {
    const recordId = e.currentTarget.dataset.id;
    const note = this.data.editingNote;
    
    let allRecords = wx.getStorageSync('mood_records') || [];
    const recordIndex = allRecords.findIndex(r => r.id === recordId);
    
    if (recordIndex !== -1) {
      allRecords[recordIndex].note = note;
      wx.setStorageSync('mood_records', allRecords);
      this.loadRecords();
      this.setData({
        expandedRecordId: null
      });
      wx.showToast({
        title: '备注已保存',
        icon: 'success'
      });
    }
  }
})