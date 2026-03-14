Page({
  data: {
    // 3D数字人相关
    digitalHumanVisible: true,
    
    // 对话相关
    messages: [
      {
        id: 1,
        content: '你好！我是你的心理辅导员小语，有什么可以帮助你的吗？',
        type: 'robot'
      }
    ],
    inputValue: '',
    isTyping: false,
    
    // 预设问题
    presetQuestions: [
      '我最近压力很大',
      '我感到情绪低落',
      '如何缓解焦虑',
      '怎样改善睡眠'
    ]
  },

  onLoad: function() {
    console.log('📱 数字人页面加载');
    this.initDigitalHuman();
  },

  // 初始化数字人
  initDigitalHuman: function() {
    console.log('🤖 初始化数字人');
    // 这里可以集成3D数字人SDK
    // 由于是模拟环境，我们使用静态图片代替
  },

  // 发送消息
  sendMessage: function() {
    const content = this.data.inputValue.trim();
    if (!content) return;

    // 添加用户消息
    const newMessage = {
      id: Date.now(),
      content: content,
      type: 'user'
    };

    this.setData({
      messages: [...this.data.messages, newMessage],
      inputValue: '',
      isTyping: true
    });

    // 模拟数字人回复
    setTimeout(() => {
      this.getRobotResponse(content);
    }, 1000);
  },

  // 数字人回复
  getRobotResponse: function(userInput) {
    let response = '';

    // 简单的关键词匹配
    if (userInput.includes('压力')) {
      response = '压力是很常见的情绪，建议你可以尝试深呼吸、冥想或者适当的运动来缓解压力。如果压力持续存在，建议寻求专业心理咨询。';
    } else if (userInput.includes('情绪低落') || userInput.includes('抑郁')) {
      response = '情绪低落时，记得你不是一个人。试着和朋友家人聊聊天，或者做一些你喜欢的事情。如果这种情绪持续超过两周，建议咨询专业心理医生。';
    } else if (userInput.includes('焦虑')) {
      response = '焦虑时可以尝试4-7-8呼吸法：吸气4秒，屏住呼吸7秒，呼气8秒。同时，将注意力集中在当下，避免过度思考未来的事情。';
    } else if (userInput.includes('睡眠')) {
      response = '改善睡眠的方法包括：保持规律的作息时间，睡前避免使用电子设备，创造安静舒适的睡眠环境，避免睡前饮用咖啡或茶。';
    } else {
      response = '我理解你的感受。作为心理辅导员，我建议你可以尝试表达自己的情绪，或者通过写日记的方式记录下来。如果需要更专业的帮助，我可以为你提供相关资源。';
    }

    // 添加机器人回复
    const robotMessage = {
      id: Date.now() + 1,
      content: response,
      type: 'robot'
    };

    this.setData({
      messages: [...this.data.messages, robotMessage],
      isTyping: false
    });

    // 滚动到底部
    this.scrollToBottom();
  },

  // 滚动到底部
  scrollToBottom: function() {
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('.chat-container').boundingClientRect();
      query.select('.chat-messages').boundingClientRect();
      query.exec((res) => {
        if (res[0] && res[1]) {
          wx.pageScrollTo({
            scrollTop: res[1].height - res[0].height + 50,
            duration: 300
          });
        }
      });
    }, 100);
  },

  // 输入框变化
  onInputChange: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 点击预设问题
  onPresetQuestionTap: function(e) {
    const question = e.currentTarget.dataset.question;
    this.setData({
      inputValue: question
    });
    this.sendMessage();
  },

  // 刷新数字人
  refreshDigitalHuman: function() {
    console.log('🔄 刷新数字人');
    wx.showToast({
      title: '数字人已刷新',
      icon: 'success',
      duration: 1000
    });
  },

  // 页面分享
  onShareAppMessage: function() {
    return {
      title: '数字人心理辅导员',
      path: '/pages/digital_human/digital_human',
      imageUrl: '/images/share-digital-human.jpg'
    };
  }
});
