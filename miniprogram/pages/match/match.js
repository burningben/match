//index.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    "account" : {},
    avatarUrl: './user-unlogin.png',
    imgUrls: [],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    nextMatchAccountIds: [],
    account_id: 0,
  },

  onLoad: function (options) {
    console.log(options)
    if (options.account_id) {
      this.setData ({
        account_id: Number(options.account_id),
      })
    }
  },

  onReady: function () {

    this.genNextMatchAccountIds()
    console.log(this.data.nextMatchAccountIds)

    db.collection('account').where({
      id : _.in(this.data.nextMatchAccountIds)
    }).orderBy('id', 'desc').get({
      success: res => {
        console.log(res)
        var data = res.data[0]
        this.show(data)
        this.genNextMatchAccountIds()
        console.log(this.data.nextMatchAccountIds)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  show: function (data) {

    this.setData({imgUrls:data.images_cloud_file_ids})

    var age = Math.floor((Math.round(new Date().getTime()/1000) - data.birth_time) / 31104000) + "岁"
    // console.log(age)
    var astro = this.getAstro(data.birth_month, data.birth_day) 
    var short_info = [data.city, age, astro + '座', data.profession] 
    // console.log(short_info)

    var education_map = {
      0 : '不限',
      1 : '大专',
      2 : '本科',
      3 : '硕士',
      4 : '博士',
    }

    var spouse_condition_flex = [
      [
        data.spouse_condition.age_min + '至' + data.spouse_condition.age_max + '岁',
        data.spouse_condition.height_min + (data.spouse_condition.height_max ? '至' + data.spouse_condition.height_max + "cm" : 'cm以上'),
      ],
      [
        data.spouse_condition.income_min ?  Number(data.spouse_condition.income_min / 1000) + "K以上" : '收入不限',data.spouse_condition.education_min ? education_map[data.spouse_condition.education_min] + "及以上" : '学历不限',
      ],
    ];

    var income_map = {
      1: '2K~6K', 
      2: '6K~10W', 
      3: '1W~1.5W', 
      4: '1.5W~2W', 
      5: '2W~5W', 
      6: '5W以上',
    }

    // if (data.spouse_condition.in_come) {
    //   spouse_condition.push(data.spouse_condition.income_min ? '收入' + data.spouse_condition.income_min + "元/月以上" : '收入不限')
    // }

    // var spouse_condition_flex = [];
    // for(var i=0,len=data.spouse_condition.length;i<len;i+=3){
    //    spouse_condition_flex.push(data.spouse_condition.slice(i,i+3));
    // }
    // console.log(spouse_condition_flex)
    var list = [
      {
        "type" : "flex",
        "title" : "基本信息",
        "flex" : [
          [data.height + "cm", education_map[data.education], age, income_map[data.income]],
          [data.profession, data.university],
        ],
      },
      {
        "type" : "flex",
        "title" : "择偶条件",
        "flex" : spouse_condition_flex,
      },
      {
        "type" : "desc",
        "title" : "内心独白",
        "desc" : data.say_something,
      },
      {
        "type" : "desc",
        "title" : "兴趣爱好",
        "desc" : data.hobbies,
      }
    ]
    var account = {
      "id" : data.id,
      "nick_name" : data.nick_name,
      "short_info" : short_info.join('  '),
      "list" : list,
      "wechat_id" : data.wechat_id,
    }
    // console.log(account)

    this.setData({account:account})

    // body...
  },
  next: function () {
    console.log('selected account:' + this.data.nextMatchAccountIds)
    db.collection('account').where({
      id : _.in(this.data.nextMatchAccountIds)
    }).orderBy('id', 'desc').get({
      success: res => {
        console.log(res)
        var data = res.data[0]
        this.show(data)
        this.genNextMatchAccountIds()
        console.log(this.data.nextMatchAccountIds)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  showModal(msg) {
    wx.showModal({
      content: msg,
      showCancel: false,
    })
  },
  like: function () {
    // 查看是否授权
    var that = this
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              var msg = that.data.account.nick_name + ' 的微信号是: ' + that.data.account.wechat_id + '，复制并联系 TA ？';
              wx.showModal({
                content: msg,
                confirmText: '复制',
                success: function (res) {
                  if (res.confirm) {
                    wx.setClipboardData({
                      data: that.data.account.wechat_id,
                      success (res) {
                        wx.getClipboardData({
                          success (res) {
                            console.log(res.data)
                          }
                        })
                      }
                    })
                  }
                }
              })

            }
          })
        } else {
          wx.navigateTo({
            url: '/pages/auth/auth',
          })
          console.log('got no auth')
        }
      }
    })

  },
  signup: function () {
    wx.navigateTo({
      url: '/pages/signup/signup',
    })
  },

  /** 
   * 第一次加载先从打底里随机取，往后都是请求完先提前算好Next，提高加载速度
   */
  genNextMatchAccountIds: function () {
    if (this.data.account_id) {
      this.setData({
        nextMatchAccountIds: [this.data.account_id]
      })
      console.log('nextMatchAccountIds, this.data.account_id has value ' + this.data.nextMatchAccountIds)
      return
    }
    var randomPlanBAccountIdIndex = parseInt(Math.random()*(app.globalData.planBAccountIds.length),10)
    if (this.data.nextMatchAccountIds.length) {
      db.collection('config').doc('max_account').get().then(max_account => {

        var randAccountIds = [
          // 从 app.globalData.minAccountId 到 max_account_id 之间随机取3个account id
          parseInt(Math.random()*(max_account.data.value-app.globalData.minAccountId+1)+app.globalData.minAccountId,10),
          // parseInt(Math.random()*(max_account.data.value-app.globalData.minAccountId+1)+app.globalData.minAccountId,10),
          // parseInt(Math.random()*(max_account.data.value-app.globalData.minAccountId+1)+app.globalData.minAccountId,10),
          app.globalData.planBAccountIds[randomPlanBAccountIdIndex],
        ]

        this.setData({
          nextMatchAccountIds: randAccountIds,
        })
        console.log('nextMatchAccountIds, random db ' + this.data.nextMatchAccountIds)
        // 去重，与当前account id 不一致
        for (var i = 0; i < this.data.nextMatchAccountIds.length; i++) {
          if (this.data.nextMatchAccountIds[i] == this.data.account.id) {
            console.log('remove account id ' + this.data.nextMatchAccountIds[i])
            this.data.nextMatchAccountIds.splice(i, 1)
          }
        }      
      })
    } else {
        this.setData({
          nextMatchAccountIds: [app.globalData.planBAccountIds[randomPlanBAccountIdIndex]],
        })
        console.log('nextMatchAccountIds, default account ' + this.data.nextMatchAccountIds)
    }

  },
  // 根据生日的月份和日期，计算星座。 
  getAstro: function (m,d) { 
      return "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m*2-(d<"102223444433".charAt(m-1)- -19)*2,2); 
  } 

})
