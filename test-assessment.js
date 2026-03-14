// 测试脚本：模拟测评提交功能

// 模拟小程序Page对象
const Page = function(options) {
  this.data = options.data;
  
  // 模拟setData方法
  this.setData = function(newData) {
    // 处理嵌套对象的情况
    for (let key in newData) {
      if (key.includes('.')) {
        const parts = key.split('.');
        let current = this.data;
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = newData[key];
      } else {
        this.data[key] = newData[key];
      }
    }
    console.log('setData called:', newData);
    console.log('Current answers:', this.data.answers);
  };
  
  // 模拟wx对象
  this.wx = {
    showModal: function(options) {
      console.log('showModal called:', options);
      // 模拟用户点击确认
      if (options.success) {
        options.success({ confirm: true });
      }
    },
    showToast: function(options) {
      console.log('showToast called:', options);
    },
    showLoading: function(options) {
      console.log('showLoading called:', options);
    },
    hideLoading: function() {
      console.log('hideLoading called');
    },
    getStorageSync: function(key) {
      console.log('getStorageSync called:', key);
      return [];
    },
    setStorageSync: function(key, value) {
      console.log('setStorageSync called:', key, value);
    }
  };
  
  // 绑定方法
  Object.keys(options).forEach(key => {
    if (typeof options[key] === 'function' && key !== 'data') {
      this[key] = options[key].bind(this);
    }
  });
  
  // 初始化
  if (options.onLoad) {
    options.onLoad.call(this);
  }
};

// 导入测评页面逻辑
const assessmentOptions = {
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

  // 初始化答案对象
  initAnswers: function() {
    const answers = {};
    this.data.questionSet.forEach(function(q) {
      answers[q.id] = null;
    });
    this.setData({ answers });
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
    
    // 更新答案
    this.setData({
      ['answers.' + questionId]: answerValue
    });
    
    console.log(`✅ 记录答案: 题目${questionId} = ${answerValue}`);
  },

  // 检查是否所有题目都已作答
  checkAllAnswered: function() {
    const answers = this.data.answers;
    console.log('🔍 检查所有题目是否已作答:', answers);
    
    for (let i = 0; i < this.data.questionSet.length; i++) {
      const questionId = this.data.questionSet[i].id;
      if (answers[questionId] === null || answers[questionId] === undefined) {
        console.log(`❌ 题目${questionId}未作答`);
        return false;
      }
    }
    console.log('✅ 所有题目都已作答');
    return true;
  },

  // 提交测评
  submitAssessment: function() {
    console.log('🚀 提交测评函数被调用');
    
    // 检查是否所有题目都已作答
    if (!this.checkAllAnswered()) {
      console.log('❌ 有题目未完成');
      return;
    }
    
    console.log('✅ 所有题目已完成，准备提交');
    this.processSubmission();
  },

  // 处理提交逻辑
  processSubmission: function() {
    console.log('📋 处理提交逻辑');
    
    // 计算分数
    const scores = { 
      '从没有': 0, 
      '有几天': 1, 
      '一半以上时间': 2, 
      '几乎每天': 3 
    };
    
    let totalScore = 0;
    Object.values(this.data.answers).forEach(function(answer) {
      totalScore += scores[answer] || 0;
    });
    
    console.log('📊 计算得分:', totalScore);
    
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
    
    // 设置结果
    this.setData({
      isSubmitted: true,
      result: {
        totalScore: totalScore,
        level: level,
        suggestion: suggestion,
        time: this.formatTime(new Date())
      }
    });
    
    console.log('✅ 测评完成，显示结果');
  },

  // 格式化时间
  formatTime: function(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
};

// 创建页面实例
const page = new Page(assessmentOptions);

// 模拟用户完成所有题目
console.log('\n=== 模拟用户完成所有题目 ===');
for (let i = 1; i <= 9; i++) {
  page.onAnswerSelect({ currentTarget: { dataset: { id: i, value: '有几天' } } });
}

// 模拟点击提交按钮
console.log('\n=== 模拟点击提交按钮 ===');
page.submitAssessment();

// 检查最终状态
console.log('\n=== 最终状态 ===');
console.log('isSubmitted:', page.data.isSubmitted);
console.log('result:', page.data.result);
