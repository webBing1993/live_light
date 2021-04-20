// pages/scanCode/index.js
const app = getApp();
import util from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {

    },
    rules: [{
      name: 'mac',
      rules: {required: true, message: '请添加设备'},
    }, {
        name: 'type',
        rules: {required: true, message: '设备类型必填'},
    }, {
        name: 'name',
        rules: {required: true, message: '设备名称必填'},
    }, {
      name: 'roomNo',
      rules: {required: true, message: '房间号不正确'},
    }],
    roomType: false,      // 判断是否为房间设备
    hotelName: '',
    mac: '',
    sn: '',
    typeList: [],
    typeIndex: '',
    roomList: [],
    roomList_: [],
    roomNo: '',
    hotelId: null,
    tenantId: null
  },

  // 扫码调取
  scanBtn: function (e) {
    let that = this;
    wx.scanCode({
      success (res) {
        console.log(res);
        let result = res.result;
        let mac = result.split('&')[0].split('mac=')[1];
        let sn = result.split('&sn=')[1];
        console.log(mac, sn, result)
        that.setData({
          mac: mac,
          sn: sn,
          [`formData.mac`]: mac
        });
        that.gotMac();
      }
    })
  },

  // 判断是否注册过
  gotMac() {
    let that = this;
    util.requestFun('/device/mac/'+that.data.mac, {}, 'GET', function(res) {
      if (res.data.data && res.data.data.id) {
        wx.showToast({
          title: '该设备已注册过',
          icon: "none",
          duration: 2000
        });
        that.setData({
          mac: '',
          sn: '',
          [`formData.mac`]: ''
        })
      }
    })
  },

  // 输入
  formInputChange(e) {
    const {field} = e.currentTarget.dataset;
    // console.log('field', field, e);
    let that = this;
    if (field == 'roomNo') {
      that.setData({
        [`formData.${field}`]: ''
      })
      let roomList = [];
      if (e.detail.value != '') {
        that.data.roomList.forEach(item => {
          if (item.roomNumber.indexOf(e.detail.value) != -1) {
            roomList.push(item);
          }
        });
      }else {
        roomList = [];
      }
      that.setData({
        roomList_: roomList
      });
      if (roomList.length == 1) {
        that.setData({
          [`formData.${field}`]: e.detail.value
        })
      }else if (roomList.length > 1) {
        roomList.forEach(item => {
          if (item == e.detail.value) {
            that.setData({
              [`formData.${field}`]: e.detail.value
            })
          }
        })
      }
    }else {
      that.setData({
        [`formData.${field}`]: e.detail.value
    });
    }
  },

  // 房号选中
  changeRoom(e) {
    console.log(e.currentTarget.dataset.roomno, e);
    let roomNumber = '';
    this.data.roomList_.forEach(item => {
      if (item.id == e.currentTarget.dataset.roomno) {
        roomNumber = item.roomNumber
      }
    })
    this.setData({
      roomList_: [],
      roomNo: roomNumber,
      [`formData.roomNo`]: e.currentTarget.dataset.roomno
    })
  },

  // 设备类型选择
  bindTypeChange: function(e) {
    console.log(e, this.data.typeList[e.detail.value].typeCode);
    this.setData({
      typeIndex: e.detail.value,
      [`formData.type`]: e.detail.value
    });
    let roomType = false;
    if (this.data.typeList[e.detail.value].scene == 'ROOM') {
      roomType = true;
      this.getRoomList();
    }else {
      roomType = false;
    }
    this.setData({ roomType })
  },

  // 获取房间号list
  getRoomList() {
    let that = this;
    let data = {
      hotelId: that.data.hotelId
    };
    util.requestFun('/room/search', data, 'POST', function(res) {
      that.setData({
        roomList: res.data.data
      })
    })
  },

  // 立即注册
  submitForm() {
    let that = this;
    that.selectComponent('#form').validate((valid, errors) => {
        console.log('valid', valid, errors)
        if ((!valid)) {
            const firstError = Object.keys(errors)
            console.log(firstError);
            that.setData({
              roomList_: []
            })
            if (firstError.length) {
              console.log(errors[firstError[0]].message);
              if (firstError.length == 1 && !that.data.roomType) {
                that.submitFun();
              }else {
                this.setData({
                  error: errors[firstError[0]].message
                })
              }
            }
        } else {
          that.submitFun();
        }
    })
  },

  // 注册函数
  submitFun() {
    let that = this;
    let data = {
      hotelId: that.data.hotelId,
      tenantId: that.data.tenantId,
      deviceTypeId: that.data.typeList[that.data.typeIndex].id,
      deviceName: that.data.formData.name,
      mac: that.data.mac,
      sn: that.data.sn,
      roomId: that.data.formData.roomNo,
    };
    util.requestFun('/device/register', data, 'POST', function(res) {
      wx.showToast({
        title: '注册成功'
      });
      that.setData({
        typeIndex: '',
        [`formData.type`]: '',
        mac: '',
        sn: '',
        [`formData.mac`]: '',
        roomNo: '',
        [`formData.roomNo`]: '',
        name: '',
        [`formData.name`]: '',
      })
    })
  },

  // 获取设备类型
  getDeviceTypeList() {
    let that = this;
    util.requestFun('/deviceType/all', {}, 'GET', function(res) {
      console.log(123, res);
      that.setData({
        typeList: res.data.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, app.globalData.hotelList);
    let hotelName = '', hotelId = '';
    app.globalData.hotelList.forEach(item => {
      if (item.tenantId == options.id) {
        hotelName = item.name;
        hotelId = item.hotelId;
      }
    });
    this.setData({
      hotelName,
      hotelId,
      tenantId: options.id
    });
    if (options.sn) {
      this.setData({ sn: options.sn })
    }
    if (options.mac) {
      this.setData({
        mac: options.mac,
        [`formData.mac`]: options.mac
      })
      this.gotMac();
    }
    this.getDeviceTypeList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})