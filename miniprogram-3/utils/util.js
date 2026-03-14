const formatTime = function(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].map(function(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }).join('/') + ' ' + [hour, minute, second].map(function(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }).join(':');
}
const request = function(url, method, data) {
  const app = getApp();
  return new Promise(function(resolve, reject) {
    wx.request({
      url: app.globalData.apiBaseUrl + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('请求失败: ' + res.statusCode));
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}
module.exports = {
  formatTime: formatTime,
  request: request
}