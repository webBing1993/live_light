//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util'

Page({
  data: {
    inputVal: "",
    dataList: [],
    mac: '',
    sn: ''
  },
  
  // 搜索事件
  selectResult: function (e) {
    console.log('select result', e.detail);
    this.setData({
      inputVal: e.detail.value
    })
    if (e.detail.value !== '') {
      this.getHotel();
    }else {
      this.setData({
        dataList: []
      })
    }
  },

  // 获取酒店list
  getHotel() {
    let that = this;
    util.requestFun('/hotel/search/keywords?keywords='+that.data.inputVal, {}, 'GET', function (res) {
      that.setData({
        dataList: res.data.data
      })
    })
  },

  // 点击跳转
  goScan: function (e) {
    console.log(e.currentTarget.dataset, this.data.mac, this.data.sn);
    app.globalData.hotelList = this.data.dataList;
    wx.navigateTo({
      url: '../scanCode/index?id='+e.currentTarget.dataset.tenantid+'&mac='+this.data.mac+'&sn='+this.data.sn,
    });
    this.setData({
      inputVal: '',
      dataList: []
    })
  },

  onLoad: function (options) {
    console.log('index options:', options);
    if (options.mac) {
      this.setData({ mac })
    }
    if (options.sn) {
      this.setData({ sn })
    }
  },

  onShow: function () {
    
  },
  
})
