Page({
  data: {
    isActive: false,
    currentArea: 'head',
    currentAreaName: '头部',
    instructionText: '准备开始身体扫描，请找一个舒适的姿势',
    elapsedTime: 0,
    progress: 0,
    timer: null,
    scanTimer: null,
    currentStep: 0,
    bodyAreas: [
      { id: 'head', name: '头部', instruction: '将注意力集中在头顶，感受头皮的感觉', duration: 5 },
      { id: 'neck', name: '颈部', instruction: '现在关注颈部，感受是否有紧绷感', duration: 5 },
      { id: 'shoulders', name: '肩膀', instruction: '放松你的肩膀，让紧张感慢慢释放', duration: 5 },
      { id: 'arms', name: '手臂', instruction: '将注意力带到手臂，感受手臂的重量', duration: 5 },
      { id: 'chest', name: '胸部', instruction: '感受胸部的起伏，自然地呼吸', duration: 5 },
      { id: 'abdomen', name: '腹部', instruction: '关注腹部，感受呼吸时腹部的变化', duration: 5 },
      { id: 'back', name: '背部', instruction: '将注意力放在背部，感受与支撑物的接触', duration: 5 },
      { id: 'legs', name: '腿部', instruction: '现在关注腿部，感受腿部的支撑感', duration: 5 },
      { id: 'feet', name: '脚部', instruction: '最后，将注意力带到脚部，感受与地面的接触', duration: 5 }
    ]
  },

  onLoad: function(options) {
    console.log('身体扫描页面加载')
  },

  onUnload: function() {
    this.stopPractice()
  },

  onHide: function() {
    this.stopPractice()
  },

  goBack: function() {
    wx.navigateBack()
  },

  togglePractice: function() {
    if (this.data.isActive) {
      this.stopPractice()
    } else {
      this.startPractice()
    }
  },

  startPractice: function() {
    this.setData({
      isActive: true,
      currentStep: 0,
      progress: 0
    })

    // 开始总计时
    let startTime = Date.now()
    this.data.timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      this.setData({
        elapsedTime: elapsed
      })
    }, 1000)

    // 开始身体扫描循环
    this.startScanCycle()
  },

  stopPractice: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
    if (this.data.scanTimer) {
      clearInterval(this.data.scanTimer)
    }

    this.setData({
      isActive: false
    })
  },

  resetPractice: function() {
    this.stopPractice()
    this.setData({
      currentArea: 'head',
      currentAreaName: '头部',
      instructionText: '准备开始身体扫描，请找一个舒适的姿势',
      elapsedTime: 0,
      progress: 0,
      currentStep: 0
    })
  },

  startScanCycle: function() {
    let step = 0
    let areaTime = this.data.bodyAreas[0].duration

    this.setData({
      currentArea: this.data.bodyAreas[0].id,
      currentAreaName: this.data.bodyAreas[0].name,
      instructionText: this.data.bodyAreas[0].instruction
    })

    this.data.scanTimer = setInterval(() => {
      areaTime--

      if (areaTime <= 0) {
        step++
        if (step >= this.data.bodyAreas.length) {
          // 扫描完成
          this.stopPractice()
          wx.showModal({
            title: '练习完成',
            content: '恭喜您完成了身体扫描练习！',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                this.setData({
                  instructionText: '身体扫描完成，请感受身体的放松状态',
                  progress: 100
                })
              }
            }
          })
          return
        }

        areaTime = this.data.bodyAreas[step].duration
        const progress = Math.round(((step + 1) / this.data.bodyAreas.length) * 100)

        this.setData({
          currentStep: step,
          currentArea: this.data.bodyAreas[step].id,
          currentAreaName: this.data.bodyAreas[step].name,
          instructionText: this.data.bodyAreas[step].instruction,
          progress: progress
        })
      }
    }, 1000)
  },

  formatTime: function(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
})