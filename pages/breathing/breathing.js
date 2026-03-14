Page({
  data: {
    isActive: false,
    currentPhase: '准备开始',
    phaseTime: 4,
    circleScale: 1,
    circleOpacity: 0.7,
    instructionText: '点击开始按钮，跟随引导进行呼吸练习',
    elapsedTime: 0,
    breathCount: 0,
    rhythmText: '舒缓 (4-2-4-2)',
    currentRhythm: 1,
    timer: null,
    breathTimer: null,
    breathPhaseIndex: 0
  },

  onLoad: function (options) {
    console.log('正念呼吸页面加载')
    this.initBreathPatterns()
  },

  onReady: function () {
    console.log('正念呼吸页面渲染完成')
  },

  onShow: function () {
    console.log('正念呼吸页面显示')
  },

  onHide: function () {
    console.log('正念呼吸页面隐藏')
    this.stopPractice()
  },

  onUnload: function () {
    console.log('正念呼吸页面卸载')
    this.stopPractice()
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
    console.log('页面滚动到底部')
  },

  onShareAppMessage: function () {
    return {
      title: '正念呼吸 - 放松身心，专注当下',
      path: '/pages/breathing/breathing'
    }
  },

  initBreathPatterns: function () {
    this.breathPatterns = {
      1: {
        name: '舒缓 (4-2-4-2)',
        phases: ['吸气', '屏气', '呼气', '屏气'],
        times: [4, 2, 4, 2],
        instructions: ['缓慢吸气，感受空气进入肺部', '短暂屏气，感受气息停留', '缓慢呼气，释放所有紧张', '短暂停顿，等待下一次呼吸']
      },
      2: {
        name: '平衡 (4-4-4-4)',
        phases: ['吸气', '屏气', '呼气', '屏气'],
        times: [4, 4, 4, 4],
        instructions: ['均匀吸气4秒', '均匀屏气4秒', '均匀呼气4秒', '均匀屏气4秒']
      },
      3: {
        name: '放松 (4-7-8)',
        phases: ['吸气', '屏气', '呼气'],
        times: [4, 7, 8],
        instructions: ['用4秒时间深深吸气', '用7秒时间屏住呼吸', '用8秒时间慢慢呼气']
      }
    }
  },

  goBack: function () {
    wx.navigateBack()
  },

  setRhythm: function (e) {
    const rhythm = parseInt(e.currentTarget.dataset.rhythm)
    if (this.data.isActive) {
      wx.showToast({
        title: '请先暂停练习',
        icon: 'none',
        duration: 2000
      })
      return
    }

    const pattern = this.breathPatterns[rhythm]
    this.setData({
      currentRhythm: rhythm,
      rhythmText: pattern.name,
      phaseTime: pattern.times[0],
      currentPhase: pattern.phases[0],
      breathPhaseIndex: 0,
      breathCount: 0,
      elapsedTime: 0
    })
  },

  togglePractice: function () {
    if (this.data.isActive) {
      this.stopPractice()
    } else {
      this.startPractice()
    }
  },

  startPractice: function () {
    this.setData({
      isActive: true,
      instructionText: '跟随呼吸节奏，保持专注...'
    })

    this.updateCircleAnimation()

    let startTime = Date.now()
    this.data.timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      this.setData({
        elapsedTime: elapsed
      })
    }, 1000)

    this.startBreathCycle()
  },

  stopPractice: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
    if (this.data.breathTimer) {
      clearInterval(this.data.breathTimer)
    }

    this.setData({
      isActive: false,
      instructionText: '练习已暂停，点击继续',
      circleScale: 1,
      circleOpacity: 0.7
    })
  },

  resetPractice: function () {
    this.stopPractice()

    const pattern = this.breathPatterns[this.data.currentRhythm]
    this.setData({
      currentPhase: '准备开始',
      phaseTime: pattern.times[0],
      instructionText: '点击开始按钮，跟随引导进行呼吸练习',
      elapsedTime: 0,
      breathCount: 0,
      breathPhaseIndex: 0,
      circleScale: 1,
      circleOpacity: 0.7
    })
  },

  startBreathCycle: function () {
    const pattern = this.breathPatterns[this.data.currentRhythm]
    let phaseIndex = 0
    let phaseTime = pattern.times[0]

    this.setData({
      currentPhase: pattern.phases[0],
      phaseTime: phaseTime,
      breathPhaseIndex: 0
    })

    this.updateCircleAnimation()

    this.data.breathTimer = setInterval(() => {
      phaseTime--
      this.setData({
        phaseTime: phaseTime
      })

      if (phaseTime <= 0) {
        phaseIndex = (phaseIndex + 1) % pattern.phases.length
        phaseTime = pattern.times[phaseIndex]

        if (phaseIndex === 0) {
          this.setData({
            breathCount: this.data.breathCount + 1
          })
        }

        this.setData({
          currentPhase: pattern.phases[phaseIndex],
          phaseTime: phaseTime,
          breathPhaseIndex: phaseIndex
        })
      }

      this.updateCircleAnimation()
    }, 1000)
  },

  updateCircleAnimation: function () {
    if (!this.data.isActive) return

    const pattern = this.breathPatterns[this.data.currentRhythm]
    const phaseIndex = this.data.breathPhaseIndex
    const phase = pattern.phases[phaseIndex]
    const totalTime = pattern.times[phaseIndex]
    const currentTime = this.data.phaseTime
    const progress = (totalTime - currentTime) / totalTime

    let scale = 1
    let opacity = 0.7

    switch (phase) {
      case '吸气':
        scale = 0.8 + progress * 0.4
        opacity = 0.5 + progress * 0.3
        break
      case '屏气':
        scale = 1.2
        opacity = 0.8
        break
      case '呼气':
        scale = 1.2 - progress * 0.4
        opacity = 0.8 - progress * 0.3
        break
      default:
        scale = 1
        opacity = 0.7
    }

    this.setData({
      circleScale: scale,
      circleOpacity: opacity
    })
  },

  formatTime: function (seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
})