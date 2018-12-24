const app = getApp()
const promise = require('../../utils/promise.js')
const config = require('../../config.js')
const util = require('../../utils/util.js')
Page({
  data: {
    listProps: {
      songs: undefined,
      error: false
    },
    searchProps: {
      holder: '查找我的歌曲',
      bind: 'bindSearch',
    }
  },

  onLoad() {
    const guitarMode = app.setup.guitarMode || false
    this.setData({
      items: [{
          idx: 1,
          title: '搜歌词',
          on: false,
          src: '../../resources/search.png',
          srcOn: '../../resources/search_on.png',
          autoOff: true
        },
        {
          idx: 2,
          title: '提意见',
          on: false,
          src: '../../resources/contact.png',
          // srcOn: '../../resources/cont.png',
          autoOff: true,
          contact: true,
        },
        {
          idx: 3,
          title: '吉他谱',
          on: guitarMode,
          src: '../../resources/guitar.png',
          srcOn: '../../resources/guitar_on.png',
        },
      ]
    })
  },

  onShow() {
    this._refreshData()
  },

  bindSearch(event) {
    const value = event.detail.value
    util.cs.log(`搜索${value}`)
    if (!value) {
      this._refreshData()
      return
    }
    let songs = this.data.songs
    songs = songs.filter(song => song.songName.indexOf(value) != -1 || song.artistName.indexOf(value) != -1)
    this.setData({
      songs
    })
  },

  bindList(event) {
    util.cs.log('bindList......')
    this._refreshData()
  },

  _refreshData() {
    //获取用户的歌曲列表
    wx.showLoading({
      title: '',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.cloud.callFunction({
        name: 'get_user_songs',
      })
      .then(res => {
        console.log('get_user_songs:', res)
        wx.hideLoading()
      })
      .catch(err => {
        wx.hideLoading()
      })
    /*
    promise.getUUID()
    	.then(uuid => promise.pRequest(`${config.service.getMySongsUrl}?uuid=${uuid}`))
    	.then(res => {
    		// util.cs.log(res.data.data)
    		if (res.data.code != 1985) throw {}
    		let songs = res.data.data
    		songs = songs.sort((i, j) => -(i.date - j.date))
    		this.setData({
    			listProps:{
    				songs,
    				error:false
    			}
    		})
    		// util.cs.log(`songs:${JSON.stringify(songs)}`)
    	})
    	.catch(err => {
    		util.showError()
    		const param = 'listProps.error'
    		this.setData({
    			[param]: true
    		})
    	})
    	.finally(() => {
    		wx.stopPullDownRefresh()
    	})*/
  },

  onClickSong(event) {
    const songId = event.currentTarget.dataset.songId
    wx.navigateTo({
      url: `../tab/tab?songId=${songId}`,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onClickKLButtons(event) {
    const idx = event.detail.idx
    switch (idx) {
      // //编辑
      // case 0: {
      // 	this.setData({ isEditing: !this.data.isEditing })
      // 	break
      // }
      //搜歌词
      case 1:
        {
          wx.navigateTo({
            url: '../search/search',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
          break
        }
        //吉他谱
      case 3:
        {
          const guitarMode = app.setup.guitarMode || false
          app.setup.guitarMode = !guitarMode
          wx.setStorage({
            key: 'setup',
            data: app.setup,
            success: function(res) {
              util.showSuccess(!guitarMode ? '显示吉他谱' : '关闭吉他谱')
            },
            fail: function(res) {},
            complete: function(res) {},
          })

          break
        }

    }
  },

})