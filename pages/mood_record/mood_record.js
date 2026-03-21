// pages/mood_record/mood_record.js - 最新完整版
Page({
  data: {
    // 用户输入与选择
    textContent: '',
    moodOptions: ['平静', '快乐', '焦虑', '悲伤', '愤怒'],
    selectedMood: '',
    
    // 分析结果
    analysisResult: null,
    confidencePercent: '0%',     // 用于WXML显示的置信度字符串
    riskLevelColor: '#2ecc71',   // 用于WXML显示的风险等级颜色
    
    // 媒体相关
    imageList: [],
    audioFilePath: '',
    audioDuration: 0,
    
    // 录音状态
    isRecording: false,
    recordTime: 0,
    recordTimer: null,
    recorderManager: null,
    
    // 系统状态
    useRealAPI: true, // 根据网络检测结果动态设定
  },

  onLoad: function () {
    // 1. 初始化录音管理器
    this.recorderManager = wx.getRecorderManager();
    this.setupRecorder();
    
    // 2. 启动时检测API连通性，决定使用真实API还是模拟分析
    this.testAPIConnection();
  },

  setupRecorder: function () {
    const recorderManager = this.recorderManager;

    recorderManager.onStart(() => {
      console.log('✅ 录音开始');
    });

    recorderManager.onStop((res) => {
      console.log('✅ 录音结束', res);
      this.setData({
        audioFilePath: res.tempFilePath,
        audioDuration: this.data.recordTime
      });
    });

    recorderManager.onError((err) => {
      console.error('❌ 录音错误', err);
      wx.showToast({
        title: '录音失败',
        icon: 'error'
      });
    });
  },

  testAPIConnection: function () {
    console.log('🌐 开始检测API连通性...');
    wx.request({
      url: 'http://172.20.10.2:5000/api/health',
      method: 'GET',
      timeout: 3000, // 3秒超时
      success: (res) => {
        console.log('✅ API连接正常:', res.data);
        this.setData({ useRealAPI: true });
        wx.showToast({
          title: '已连接AI服务',
          icon: 'success',
          duration: 1500
        });
      },
      fail: (err) => {
        console.warn('⚠️ API连接失败，将使用本地分析模式:', err);
        this.setData({ useRealAPI: false });
        wx.showToast({
          title: '使用本地智能分析',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // ========== 用户输入处理 ==========
  onTextInput: function (e) {
    this.setData({ textContent: e.detail.value });
  },

  selectMood: function (e) {
    this.setData({ selectedMood: e.currentTarget.dataset.mood });
  },

  // ========== 图片处理 ==========
  chooseImage: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imageList: res.tempFilePaths
        });
      }
    });
  },

  removeImage: function () {
    this.setData({
      imageList: []
    });
  },

  // ========== 录音控制 ==========
  handleRecord: function () {
    if (this.data.isRecording) {
      this.stopRecord();
    } else {
      this.startRecord();
    }
  },

  startRecord: function () {
    const that = this;
    wx.authorize({
      scope: 'scope.record',
      success: function () {
        that.setData({
          isRecording: true,
          recordTime: 0
        });

        const options = {
          duration: 30000, // 最长30秒
          sampleRate: 16000,
          numberOfChannels: 1,
          encodeBitRate: 48000,
          format: 'mp3'
        };

        that.recorderManager.start(options);

        // 录音计时器
        const timer = setInterval(function () {
          that.setData({
            recordTime: that.data.recordTime + 1
          });
        }, 1000);
        that.setData({ recordTimer: timer });
      },
      fail: function () {
        wx.showToast({
          title: '需要麦克风权限',
          icon: 'none'
        });
      }
    });
  },

  stopRecord: function () {
    this.recorderManager.stop();
    if (this.data.recordTimer) {
      clearInterval(this.data.recordTimer);
    }
    this.setData({
      isRecording: false,
      recordTimer: null
    });
  },

  clearAudio: function () {
    this.setData({
      audioFilePath: '',
      audioDuration: 0
    });
    wx.showToast({
      title: '录音已清除',
      icon: 'success'
    });
  },

  // ========== 核心分析逻辑 ==========
  analyzeMood: function () {
    const textContent = this.data.textContent;
    const audioFilePath = this.data.audioFilePath;

    if (!textContent.trim() && !audioFilePath) {
      wx.showToast({
        title: '请先输入内容或录音',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: 'AI分析中...', mask: true });

    // 决策逻辑：有录音优先分析录音，否则分析文本
    if (audioFilePath) {
      if (this.data.useRealAPI) {
        console.log('🎤 尝试使用真实语音识别API...');
        this.analyzeAudio(audioFilePath);
      } else {
        console.log('🎤 使用本地模拟语音分析...');
        this.mockAudioAnalysis(audioFilePath);
      }
    } else {
      if (this.data.useRealAPI) {
        console.log('📝 尝试使用真实文本情绪分析API...');
        this.analyzeText(textContent);
      } else {
        console.log('📝 使用本地智能文本分析...');
        this.mockTextAnalysis(textContent);
      }
    }
  },

  // 真实音频分析API调用
  analyzeAudio: function (audioFilePath) {
    const that = this;
    wx.uploadFile({
      url: 'http://172.20.10.2:5000/api/analyze/audio',
      filePath: audioFilePath,
      name: 'audio',
      formData: { 'user': 'test' },
      success: (res) => {
        wx.hideLoading();
        console.log('✅ 音频API响应:', res);

        try {
          const data = JSON.parse(res.data);
          if (data.code === 200) {
            that.handleAnalysisSuccess(data.data, '真实API（语音）');
          } else {
            console.warn('❌ API业务逻辑错误，降级到模拟分析:', data);
            that.mockAudioAnalysis(audioFilePath);
          }
        } catch (e) {
          console.error('❌ 解析API响应失败:', e);
          that.mockAudioAnalysis(audioFilePath);
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('❌ 音频上传请求失败，降级到模拟分析:', err);
        wx.showToast({ title: '网络不佳，使用本地分析', icon: 'none' });
        that.mockAudioAnalysis(audioFilePath);
      }
    });
  },

  // 真实文本分析API调用
  analyzeText: function (textContent) {
    const that = this;
    wx.request({
      url: 'http://172.20.10.2:5000/api/analyze/text',
      method: 'POST',
      data: { text: textContent },
      header: { 'Content-Type': 'application/json' },
      timeout: 10000,
      success: (res) => {
        wx.hideLoading();
        console.log('✅ 文本API响应:', res.data);
        const data = res.data;
        
        if (data.code === 200) {
          that.handleAnalysisSuccess(data.data, '真实API（文本）');
        } else {
          that.mockTextAnalysis(textContent);
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('❌ 文本分析请求失败，降级到模拟分析:', err);
        wx.showToast({ title: '网络不佳，使用本地分析', icon: 'none' });
        that.mockTextAnalysis(textContent);
      }
    });
  },

  // 本地模拟音频分析（智能降级）
  mockAudioAnalysis: function (audioFilePath) {
    const that = this;
    console.log('🎤 执行本地模拟音频分析');

    setTimeout(() => {
      // 模拟基于音频的简单情绪判断（此处可扩展更复杂的模拟逻辑）
      const emotions = ['平静', '快乐', '焦虑', '悲伤', '愤怒'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = 0.75 + Math.random() * 0.2;
      
      that.handleAnalysisSuccess({
        emotion: emotion,
        confidence: confidence
      }, '本地模拟（语音）');
    }, 1500);
  },

  // 本地智能文本分析（基于关键词）
  mockTextAnalysis: function (textContent) {
    const that = this;
    console.log('📝 执行本地智能文本分析');

    setTimeout(() => {
      let detectedEmotion = '平静';
      let confidence = 0.8;
      const text = textContent.toLowerCase();
      const userSelectedMood = that.data.selectedMood;

      // 规则1：优先采纳用户自选标签
      if (userSelectedMood && userSelectedMood !== '平静') {
        detectedEmotion = userSelectedMood;
        confidence = 0.85;
      }
      // 规则2：基于关键词分析
      else if (textContent.trim()) {
        if (text.includes('开心') || text.includes('高兴') || text.includes('快乐') || text.includes('哈哈')) {
          detectedEmotion = '快乐';
          confidence = 0.88;
        } else if (text.includes('焦虑') || text.includes('紧张') || text.includes('担心') || text.includes('压力')) {
          detectedEmotion = '焦虑';
          confidence = 0.82;
        } else if (text.includes('伤心') || text.includes('难过') || text.includes('悲伤') || text.includes('哭')) {
          detectedEmotion = '悲伤';
          confidence = 0.84;
        } else if (text.includes('生气') || text.includes('愤怒') || text.includes('烦') || text.includes('恼火')) {
          detectedEmotion = '愤怒';
          confidence = 0.83;
        } else if (text.includes('害怕') || text.includes('恐惧') || text.includes('吓')) {
          detectedEmotion = '害怕';
          confidence = 0.79;
        } else if (text.length > 20) {
          // 长文本默认倾向平静
          const options = ['平静', '平静', '平静', '快乐', '焦虑'];
          detectedEmotion = options[Math.floor(Math.random() * options.length)];
          confidence = 0.75;
        }
      }

      that.handleAnalysisSuccess({
        emotion: detectedEmotion,
        confidence: confidence
      }, '本地模拟（文本）');
    }, 1200);
  },

  // 统一处理分析成功的结果
  handleAnalysisSuccess: function (emotionData, source) {
    const suggestion = this.generateSuggestion(emotionData.emotion, emotionData.confidence);
    const riskLevel = this.calculateRiskLevel(emotionData.emotion, emotionData.confidence);

    this.setData({
      analysisResult: {
        primaryEmotion: this.data.selectedMood || '平静',
        aiDetectedEmotion: emotionData.emotion,
        confidence: emotionData.confidence,
        suggestion: suggestion,
        riskLevel: riskLevel,
        source: source // 标注分析结果来源
      },
      // 计算用于WXML显示的数据
      confidencePercent: this.calculateConfidencePercent(emotionData.confidence),
      riskLevelColor: this.calculateRiskLevelColor(riskLevel)
    });

    wx.showModal({
      title: '🎯 分析完成',
      content: `识别情绪：${emotionData.emotion}\n置信水平：${this.data.confidencePercent}\n分析引擎：${source}\n\n${suggestion}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // ========== 工具函数 ==========
  generateSuggestion: function (emotion, confidence) {
    const suggestions = {
      '平静': '情绪状态平稳，继续保持良好的心态。',
      '快乐': '感受到您的积极情绪，建议与他人分享这份快乐。',
      '焦虑': '检测到焦虑情绪，建议尝试深呼吸或短暂休息。',
      '悲伤': '感受到低落情绪，建议与朋友交流或进行轻松活动。',
      '生气': '检测到愤怒情绪，建议暂时离开当前环境冷静一下。',
      '害怕': '感受到恐惧情绪，建议寻求信任的人陪伴。',
      '惊讶': '情绪波动较大，建议平静后再做决定。',
      '厌恶': '感受到反感情绪，建议远离不适源。',
      '未知': '情绪状态不明确，建议关注自身感受变化。'
    };
    return suggestions[emotion] || '建议关注自身情绪变化，保持健康心态。';
  },

  calculateRiskLevel: function (emotion, confidence) {
    if (confidence < 0.6) return '低风险';
    const highRiskEmotions = ['焦虑', '悲伤', '生气', '害怕'];
    if (highRiskEmotions.includes(emotion) && confidence > 0.7) {
      return '中风险';
    }
    return '低风险';
  },

  // 为WXML显示提供的计算函数
  calculateConfidencePercent: function (confidence) {
    return (confidence * 100).toFixed(1) + '%';
  },

  calculateRiskLevelColor: function (riskLevel) {
    if (riskLevel === '低风险') return '#2ecc71';
    if (riskLevel === '中风险') return '#f39c12';
    return '#e74c3c'; // 高风险或其他
  },

  // ========== 数据持久化 ==========
  saveRecord: function () {
    if (!this.data.analysisResult) {
      wx.showToast({
        title: '请先进行分析',
        icon: 'none'
      });
      return;
    }

    const record = {
      id: new Date().getTime(),
      text: this.data.textContent,
      mood: this.data.selectedMood,
      time: new Date().toLocaleString(),
      analysis: this.data.analysisResult,
      imageList: this.data.imageList,
      audioDuration: this.data.audioDuration,
      note: ''
    };

    let allRecords = wx.getStorageSync('mood_records') || [];
    allRecords.unshift(record);
    wx.setStorageSync('mood_records', allRecords.slice(0, 50));

    wx.showToast({
      title: '记录已保存',
      icon: 'success'
    });

    // 清空当前表单
    this.setData({
      textContent: '',
      selectedMood: '',
      analysisResult: null,
      confidencePercent: '0%',
      riskLevelColor: '#2ecc71',
      imageList: [],
      audioFilePath: '',
      audioDuration: 0
    });
  }
})