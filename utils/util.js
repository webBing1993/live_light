const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const requestFun =(url, data, getPost, success) => {
  wx.showLoading({
    title: '加载中',
  });
  
  let urlOld = getApp().globalData.urlOld;   // 域名链接    hotel.fortrun.cn
  let urlNew = '';       // 完整数据请求链接
  let header = '';       // 请求头

  urlNew = urlOld + url;
  console.log('urlNew', urlNew)
  let date = {
    data: JSON.stringify(data),
  }

  if (getPost == 'POST') {
    // header = 'application/x-www-form-urlencoded'
    header = {
      'content-type': 'application/json'
    }
  } else { 
    header = {
      'content-type': 'application/json'
    }
  }

  wx.request({
    url: urlNew,
    data: data,
    header: header,
    method: getPost,
    success: function (res) {
      console.log(res, 5666)
      wx.hideLoading();
      if (res.data.errcode == 0) {
        success(res)
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none',
          duration: 2000
        });
      }
    },
    fail: function (res) {
      console.log(res);
      wx.hideLoading();
      if(res.errMsg && res.errMsg == 'request:fail timeout') {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        });
      }else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none',
          duration: 2000
        });
      }
    },
  })
}

module.exports = {
  formatTime: formatTime,
  requestFun
}
