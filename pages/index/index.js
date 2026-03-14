// index.js
// 个人名片页面数据
Page({
  data: {
    // 姓名
    name: '展志诚',
    // 专业年级
    major: '计算机科学与技术',
    // 联系方式列表
    contacts: [
      { label: '电话', value: '13811258205' },
      { label: '邮箱', value: 'peterzhan@example.com' },
      { label: '微信', value: 'peterzhan321' },
      { label: 'GitHub', value: 'github.com/peterzhan321-stack' }
    ],
    // 技能标签数组
    skills: ['Python', '爬虫开发', '数据分析', 'JavaScript', '微信小程序'],
    // 个人简介
    bio: '热爱编程，专注于爬虫开发和数据分析。熟悉 Python 爬虫框架，能够独立完成数据采集、清洗和分析任务。致力于成为优秀的后端开发工程师。'
  },

  // 技能标签点击事件处理函数
  onSkillTap: function(e) {
    // 从事件对象中获取技能名称
    const skill = e.currentTarget.dataset.skill;
    // 显示提示信息
    wx.showToast({
      title: '你点击了：' + skill,
      duration: 1500,
      icon: 'none'
    });
  }
})
