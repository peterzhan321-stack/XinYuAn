Page({
  data: {
    // PHQ-9测评题目
    questionSet: [
      {
        id: 1,
        title: '在过去的两周里，您对做事缺乏兴趣或乐趣感到烦恼的频率是？',
        options: ['从没有', '有几天', '一半以上时间', '几乎每天']
      },
      {
        id: 2,
        title: '在过去的两周里，您感到情绪低落、沮丧或绝望的频率是？',
        options: ['从没有', '有几天', '一半以上时间', '几乎每天']
      },
      {
        id: 3,
        title: '在过去的两周里，您入睡困难、睡不安稳或睡眠过多的频率是？',
        options: ['从没有', '有几天', '一半以上时间', '几乎每天']
      },
      {
        id: 4,
        title: '在过去的两周里，您感到疲倦或没有活力的频率是？',
        options: ['从没有', '有几天', '一半以上时间', '几乎每天']
      },
      {
        id: 5,
        title: '在过去的两周里，您食欲不振或吃太多的频率是？',
        options: ['从没有', '有几天', '一半以上时间', '几乎每天']
      },
      {
        id: 6,
        title: '在过去的两周里，您对自己感到不满或觉得自己很失败的频率是？',
        options: ['从没有', '有几天', '一半以上时间', '几乎每天']
      },
      {
        id: 7,
        title: '在过去的两周里，您注意力难以集中的频率是？',
        options: ['从没有', '有几天', '一半以上时间', '几乎每天']
      },
      {
        id: 8,
        title: '在过去的两周里，您行动或说话缓慢到引起他人注意的频率是？',
        options: ['从没有', '有几天', '一半以上时间', '几乎每天']
      },
      {
        id: 9,
        title: '在过去的两周里，您有不如死掉或用某种方式伤害自己的念头频率是？',
        options: ['从没有', '有几天', '一半以上时间', '几乎每天']
      }
    ],
    
    // 用户答案
    answers: {},
    
    // 当前题目索引
    currentIndex: 0,
    
    // 是否已提交
    isSubmitted: false,
    
    // 测评结果
    result: null,
    
    // UI相关数据
    progressWidth: 0, // 进度条宽度百分比
    progressStyle: 'width: 0%;',
    
    // 计算属性
    explanationText: '',
    levelBadgeClass: '',
    
    // 动画相关
    optionAnimation: false
  },

  onLoad: function() {
    console.log('📊 心理测评页面加载');
    this.initAnswers();
    this.calculateProgress();
  },
  // 【诊断】终极测试函数
debugSubmit: function() {
  console.log('🔍 【诊断】debugSubmit 函数被调用！第一步成功。');
  wx.showToast({
    title: '函数通了！',
    icon: 'success',
    duration: 2000
  });

  // 不检查任何条件，直接显示结果页
  setTimeout(() => {
    console.log('🔍 【诊断】准备跳转到结果页。');
    this.setData({
      isSubmitted: true,
      result: {
        totalScore: 9,
        level: '测试等级',
        suggestion: '这是一个测试结果，用于确认功能。',
        time: '刚刚'
      }
    });
    console.log('✅ 【诊断】页面数据已更新，应显示结果。');
  }, 500);
},
  
  // 诊断测试函数
  testButtonClick: function() {
    console.log('✅ 【测试】按钮点击事件已触发！');
    wx.showToast({
      title: '按钮通了！',
      icon: 'success'
    });
  },

  onShow: function() {
    // 页面显示时的逻辑
  },

  // 初始化答案对象
  initAnswers: function() {
    const answers = {};
    this.data.questionSet.forEach(function(q) {
      answers[q.id] = null;
    });
    this.setData({ answers });
    console.log('🔧 初始化答案对象:', answers);
  },

  // 计算进度
  calculateProgress: function() {
    if (this.data.questionSet && this.data.questionSet.length > 0) {
      const percent = (this.data.currentIndex + 1) / this.data.questionSet.length * 100;
      this.setData({
        progressWidth: percent,
        progressStyle: 'width: ' + percent.toFixed(2) + '%;'
      });
    }
  },

  // 选项选择事件
  onAnswerSelect: function(e) {
    const questionId = e.currentTarget.dataset.id;
    const answerValue = e.currentTarget.dataset.value;
    
    // 添加点击反馈
    wx.vibrateShort({ type: 'light' });
    
    // 更新答案
    this.setData({
      ['answers.' + questionId]: answerValue
    });
    
    console.log(`✅ 记录答案: 题目${questionId} = ${answerValue}`);
    console.log('📋 当前答案状态:', this.data.answers);
  },

  // 计算选项选中类
  optionSelectedClass: function(questionId, optionValue) {
    return this.data.answers[questionId] === optionValue ? 'option-selected' : '';
  },

  // 计算复选框选中类
  checkboxCheckedClass: function(questionId, optionValue) {
    return this.data.answers[questionId] === optionValue ? 'checkbox-checked' : '';
  },

  // 计算指示器可见类
  indicatorVisibleClass: function(questionId, optionValue) {
    return this.data.answers[questionId] === optionValue ? 'indicator-visible' : '';
  },

  // 上一题
  goPrev: function() {
    if (this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1
      }, () => {
        this.calculateProgress();
      });
    }
  },

  // 下一题
  goNext: function() {
    if (this.data.currentIndex < this.data.questionSet.length - 1) {
      this.setData({
        currentIndex: this.data.currentIndex + 1
      }, () => {
        this.calculateProgress();
      });
    }
  },

  // 检查是否所有题目都已作答
  checkAllAnswered: function() {
    const answers = this.data.answers;
    console.log('🔍 检查所有题目是否已作答:', answers);
    
    // 检查answers对象是否存在
    if (!answers) {
      console.log('❌ answers对象不存在');
      return false;
    }
    
    for (let i = 0; i < this.data.questionSet.length; i++) {
      const questionId = this.data.questionSet[i].id;
      // 尝试两种键类型：数字和字符串
      let answerValue = answers[questionId];
      if (answerValue === null || answerValue === undefined) {
        answerValue = answers[questionId.toString()];
      }
      console.log(`🔍 检查题目${questionId}，答案值:`, answerValue);
      if (answerValue === null || answerValue === undefined) {
        console.log(`❌ 题目${questionId}未作答`);
        return false;
      }
    }
    console.log('✅ 所有题目都已作答');
    return true;
  },

  // 提交测评
  submitAssessment: function() {
    console.log('🚀 submitAssessment函数被调用');
    const that = this;
    
    // 检查是否所有题目都已作答
    if (!this.checkAllAnswered()) {
      console.log('❌ 有题目未完成，显示提示');
      wx.showModal({
        title: '⚠️ 提示',
        content: '您还有题目未完成，请先完成所有题目再提交。',
        confirmText: '我知道了',
        confirmColor: '#3498db',
        showCancel: false
      });
      return;
    }
    
    console.log('✅ 所有题目已完成，显示确认弹窗');
    // 直接调用processSubmission，跳过弹窗
    console.log('✅ 跳过确认弹窗，直接调用processSubmission');
    that.processSubmission();
  },

  // 处理提交逻辑
  processSubmission: function() {
    console.log('📋 processSubmission函数被调用');
    const that = this;
    
    console.log('🔄 显示加载中');
    wx.showLoading({
      title: '分析中...',
      mask: true
    });
    
    // 模拟网络请求延迟
    console.log('⏰ 设置setTimeout');
    setTimeout(function() {
      console.log('⏰ setTimeout回调执行');
      wx.hideLoading();
      console.log('🔄 隐藏加载中');
      
      // 计算分数
      const scores = { 
        '从没有': 0, 
        '有几天': 1, 
        '一半以上时间': 2, 
        '几乎每天': 3 
      };
      
      let totalScore = 0;
      console.log('🔢 计算分数，答案:', that.data.answers);
      Object.values(that.data.answers).forEach(function(answer) {
        console.log('🔢 处理答案:', answer, '得分:', scores[answer] || 0);
        totalScore += scores[answer] || 0;
      });
      console.log('🔢 总得分:', totalScore);
      
      // 计算等级和建议
      let level = '';
      let suggestion = '';
      
      if (totalScore <= 4) {
        level = '无抑郁症状';
        suggestion = '您的情绪状态良好，请继续保持健康的生活习惯。';
      } else if (totalScore <= 9) {
        level = '轻度抑郁';
        suggestion = '建议关注情绪变化，适当放松，可尝试与朋友交流或进行心理咨询。';
      } else if (totalScore <= 14) {
        level = '中度抑郁';
        suggestion = '建议寻求专业心理咨询或治疗，并注意保持良好的作息和饮食。';
      } else {
        level = '重度抑郁';
        suggestion = '强烈建议立即寻求专业心理治疗，您也可以联系学校的心理健康中心。';
      }
      
      console.log('🏆 评估等级:', level);
      
      // 计算等级徽章类名
      let levelBadgeClass = '';
      if (level === '无抑郁症状') levelBadgeClass = 'level-无抑郁症状';
      else if (level === '轻度抑郁') levelBadgeClass = 'level-轻度抑郁';
      else if (level === '中度抑郁') levelBadgeClass = 'level-中度抑郁';
      else if (level === '重度抑郁') levelBadgeClass = 'level-重度抑郁';
      
      // 计算解释文本
      let explanationText = '';
      if (totalScore <= 4) {
        explanationText = '0-4分：无抑郁症状，情绪状态良好';
      } else if (totalScore <= 9) {
        explanationText = '5-9分：轻度抑郁，建议关注情绪变化';
      } else if (totalScore <= 14) {
        explanationText = '10-14分：中度抑郁，建议寻求专业帮助';
      } else {
        explanationText = '15-27分：重度抑郁，建议立即寻求专业帮助';
      }
      
      console.log('📝 准备设置结果数据');
      console.log('🔧 设置前isSubmitted:', that.data.isSubmitted);
      
      // 设置结果
      that.setData({
        isSubmitted: true,
        result: {
          totalScore: totalScore,
          level: level,
          suggestion: suggestion,
          time: that.formatTime(new Date())
        },
        levelBadgeClass: levelBadgeClass,
        explanationText: explanationText
      }, function() {
        console.log('✅ setData回调执行');
        console.log('🔧 设置后isSubmitted:', that.data.isSubmitted);
        console.log('📊 设置后result:', that.data.result);
        
        // 保存到历史记录
        console.log('💾 保存到历史记录');
        that.saveToHistory();
        
        // 显示结果提示
        console.log('🎉 显示测评完成提示');
        wx.showToast({
          title: '测评完成',
          icon: 'success',
          duration: 2000
        });
      });
      
    }, 1500);
  },

  // 格式化时间
  formatTime: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  // 保存到历史记录
  saveToHistory: function() {
    try {
      const history = wx.getStorageSync('assessment_history') || [];
      const newRecord = {
        id: new Date().getTime(),
        score: this.data.result.totalScore,
        level: this.data.result.level,
        time: this.data.result.time,
        suggestion: this.data.result.suggestion
      };
      
      history.unshift(newRecord);
      
      // 只保存最近20条记录
      wx.setStorageSync('assessment_history', history.slice(0, 20));
      
      console.log('✅ 测评记录已保存到历史');
    } catch (e) {
      console.error('❌ 保存历史记录失败:', e);
    }
  },

  // 重新测评
  restartAssessment: function() {
    wx.showModal({
      title: '重新测评',
      content: '确认要重新开始测评吗？当前进度将会丢失。',
      confirmText: '重新开始',
      cancelText: '取消',
      confirmColor: '#e74c3c',
      cancelColor: '#7f8c8d',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            currentIndex: 0,
            isSubmitted: false,
            result: null,
            levelBadgeClass: '',
            explanationText: '',
            progressWidth: 0,
            progressStyle: 'width: 0%;'
          });
          
          this.initAnswers();
          
          wx.showToast({
            title: '重新开始',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 查看历史报告
  viewHistory: function() {
    wx.navigateTo({
      url: '/pages/profile/reports'
    });
  },

  // 分享结果
  shareResult: function() {
    wx.showModal({
      title: '分享测评结果',
      content: '分享功能即将上线，敬请期待！',
      confirmText: '知道了',
      confirmColor: '#3498db',
      showCancel: false
    });
  },

  // 页面分享
  onShareAppMessage: function() {
    return {
      title: '心理测评 - 了解自己的情绪状态',
      path: '/pages/assessment/assessment',
      imageUrl: '/images/share-assessment.jpg'
    };
  },

  // 页面下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1000);
  }
})