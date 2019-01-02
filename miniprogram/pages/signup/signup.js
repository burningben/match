import WxValidate from '../../utils/WxValidate.js'
const app = getApp()

Page({
    data: {
        showTopTips: false,
        topTips: '',
        incomeIndex: 2,
        incomeArray: ['2K~6K', '6K~10W', '1W~1.5W', '1.5W~2W', '2W~5W', '5W以上'],
        heightIndex: 20,
        heightArray: [],
        heightMinIndex: 0,
        heightMinArray: [],
        heightMaxIndex: 0,
        heightMaxArray: [],
        ageMinIndex: 0,
        ageMinArray: [],
        ageMaxIndex: 0,
        ageMaxArray: [],
        incomeRangeIndex: 0,
        incomeRangeArray: ['不限', '2K以上', '6K以上', '1W以上', '1.5W以上', '2W以上', '5W以上'],
        educationRangeIndex: 0,
        educationRangeArray: ['不限','大专及以上','本科及以上','硕士及以上','博士及以上'],
        educationIndex: 1,
        // educationArray: {'高中':'高中','本科':'本科','硕士':'硕士','博士':'博士'},
        educationArray: ['大专','本科','硕士','博士'],

        date: "1995-01-01",

        isAgree: false,
        evalList: [{ tempFilePaths: [], imgList: [] }],
        files: [],
        maxFiles: 3,
        cloudFileIds: [],
        wechatUserInfo: {},
    },
    showTopTips: function(topTips){
        var that = this;
        this.setData({
            showTopTips: true,
            topTips: topTips
        });
        setTimeout(function(){
            that.setData({
                showTopTips: false
            });
        }, 3000);
    },

    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },

    bindAgreeChange: function (e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },
    checkAuth: function () {
      // 查看是否授权
      var that = this
      wx.getSetting({
        success (res){
          console.log('haha got')
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                that.setData({
                  wechatUserInfo: res.userInfo,
                  defaultNickName: res.userInfo.nickName,
                })
                console.log(res.userInfo)
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
    getPhoneNumber(e) {
      console.log(e.detail.encryptedData)
      this.setData({
        // phone: e.detail.encryptedData
      })
    },
    onReady: function () {
        this.checkAuth()
        // var now = new Date()
        // this.setData({date: now.getFullYear() + '-' + (Number(now.getMonth()) + 1) + '-' + now.getDate()})
        var heightArray = []
        var heightRangeArray = ["不限"]
        for (var i = 140; i <= 200; i++) {
            heightArray.push(i + "cm")
            heightRangeArray.push(i + "cm")
        }
        this.setData({
            heightArray:heightArray,
            heightMinArray:heightRangeArray,
            heightMaxArray:heightRangeArray,
        })
        var age = ["不限"]
        for (var i = 18; i <= 40; i++) {
            age.push(i + "岁")
        }
        this.setData({
            ageMinArray:age,
            ageMaxArray:age,
            // phone: 13322224444,
        })
    },

    bindIncomeChange: function(e){
        console.log('picker height code 发生选择改变，携带值为', e.detail.value);

        this.setData({
            incomeIndex: e.detail.value
        })
    },
    bindHeightChange: function(e){
        console.log('picker height code 发生选择改变，携带值为', e.detail.value);

        this.setData({
            heightIndex: e.detail.value
        })
    },
    bindHeightMinChange: function(e){
        this.setData({
            heightMinIndex: e.detail.value
        })
    },
    bindHeightMaxChange: function(e){
        this.setData({
            heightMaxIndex: e.detail.value
        })
    },
    bindAgeMinChange: function(e){
        this.setData({
            ageMinIndex: e.detail.value
        })
    },
    bindAgeMaxChange: function(e){
        this.setData({
            ageMaxIndex: e.detail.value
        })
    },
    bindIncomeRangeChange: function(e){
        this.setData({
            incomeRangeIndex: e.detail.value
        })
    },
    bindEducationRangeChange: function(e){
        this.setData({
            educationRangeIndex: e.detail.value
        })
    },
    bindEducationChange: function(e){
        console.log('picker education code 发生选择改变，携带值为', e.detail.value);

        this.setData({
            educationIndex: e.detail.value
        })
    },

    onLoad() {
        // this.getuser()
        this.initValidate()//验证规则函数
    },

    //报错 
    showModal(error) {
        wx.showModal({
          content: error.msg,
          showCancel: false,
        })
      },
    //验证函数
    initValidate() {
        const rules = {
          nick_name: {
            required: true,
            minlength:1
          },
          wechat_id: {
            required: true,
            minlength:4
          },
          city: {
            required: true,
            minlength:2
          },
          profession: {
            required: true,
            minlength:2
          },
          university: {
            required: true,
            minlength:4
          },
          hobbies: {
            required: true,
            minlength:4
          },
          say_something: {
            required: true,
            minlength:4
          },
          phone:{
            required:true,
            tel:true
          },
          is_agree:{
            required:true,
          },
          images_length:{
            required:true,
            min:1
          }
        }
        const messages = {
          nick_name: {
            required: '请填写昵称',
            minlength:'请输入正确的昵称，至少1个字符'
          },
          wechat_id: {
            required: '请填写微信号',
            minlength:'请输入正确的微信号'
          },
          city: {
            required: '请填写所在城市',
            minlength:'请输入正确的所在城市'
          },
          profession: {
            required: '请填写职业',
            minlength:'请输入正确的职业，至少2个字符'
          },
          university: {
            required: '请填写毕业学院',
            minlength:'请输入正确的毕业学院，至少4个字符'
          },
          hobbies: {
            required: '请填写兴趣爱好',
            minlength:'请输入正确的兴趣爱好，至少4个字符'
          },
          say_something: {
            required: '请填写内心独白',
            minlength:'请输入正确的内心独白，至少4个字符'
          },
          phone:{
            required: '请填写手机号',
            tel:'请填写正确的手机号'
          },
          is_agree:{
            required: '请阅读并同意《相关条款》',
          },
          images_length:{
            required: '请上传图片',
            min: '请上传图片',
          }
        }
        this.WxValidate = new WxValidate(rules, messages)
      },
    //调用验证函数
     formSubmit: function(e) {
        console.log('form发生了submit事件，携带的数据为：', e.detail.value)
        // console.log(this.data.isAgree)
        const params = e.detail.value
        if (this.data.isAgree) {
            params.is_agree = this.data.isAgree   
        }
        params.images_length = this.data.files.length

        // console.log(params)
        //校验表单
        if (!this.WxValidate.checkForm(params)) {
          const error = this.WxValidate.errorList[0]
          this.showModal(error)
          return false
        }

        // console.log(params)

        var data = this.formatData(params)
        console.log(data)
        // 提交数据到DB
        wx.cloud.init()
        const db = wx.cloud.database()
        const _ = db.command

        // max account id 自增
        db.collection('config').doc('max_account').update({
            data: {
            value: _.inc(1)
            }
        // 获取 max account id
        }).then(res => {
            wx.showLoading({
              title: '提交中...',
            })

            db.collection('config').doc('max_account').get().then(max_account => {

                console.log(max_account)
                data.id = max_account.data.value
                // data._id = max_account.data.value // 用_id就报错，暂不知道原因，先用id

                // 上传图片到cloud
                var fileIndex = 1
                var uploadCount = 1
                data.images_cloud_file_ids = []
                for (var i = this.data.files.length - 1; i >= 0; i--) {
                  var file = this.data.files[i]
                  // 将图片上传至云存储空间
                  wx.cloud.uploadFile({
                    // 指定上传到的云路径
                    cloudPath: 'account_images/' + data.id + '_' + data.nick_name + '_' + fileIndex,
                    // 指定要上传的文件的小程序临时文件路径
                    filePath: file,
                    // 成功回调
                    success: res => {
                      console.log('图片上传至云存储空间成功', res)
                      data.images_cloud_file_ids.push(res.fileID)

                      // 上传是异步处理的，所以这里等最后一张图片上传完再创建账号
                      console.log(uploadCount)
                      console.log(this.data.files.length)
                      if (uploadCount===this.data.files.length) {
                        // 创建 account 
                        console.log(data)
                        db.collection('account').add({
                          // data 字段表示需新增的 JSON 数据
                          data: data,
                          success(res) {
                            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                            console.log(res)
                            wx.hideLoading()

                            wx.showToast({
                              title: '提交成功',
                              icon: 'success',
                              duration: 1000
                            })
                            setTimeout(function(){
                                wx.navigateTo({
                                  url: '/pages/match/match?account_id=' + max_account.data.value,
                                })
                            }, 1500);

                          },
                          fail(res) {
                            wx.hideLoading()
                            wx.showModal({
                              content: '提交失败',
                              showCancel: false,
                            })
                            console.log('add fail' + res)
                          }
                        })
                      }
                      uploadCount++
                    },
                    fail(res) {
                        wx.hideLoading()
                        wx.showModal({
                          content: '图片上传失败',
                          showCancel: false,
                        })
                        console.log('images upload fail, res: ' + res)
                    }
                  })
                  fileIndex++
                }

            })
        })

      },

      formatData: function (data) {
          var birth_date = new Date(data.birth)
          data.birth_time = birth_date.getTime() / 1000
          data.birth_year = birth_date.getFullYear()
          data.birth_month = birth_date.getMonth()+1
          data.birth_day = birth_date.getDate()
          delete data.birth

          data.spouse_condition = {}

          var age_min = 18
          if (data.age_min) {
              data.age_min = Number(data.age_min) + age_min - 1
          }
          data.spouse_condition.age_min = Number(data.age_min) + age_min - 1
          delete data.age_min

          if (data.age_max) {
              data.age_max = Number(data.age_max) + age_min - 1
          }
          data.spouse_condition.age_max = Number(data.age_max) + age_min - 1
          delete data.age_max

          var height_min = 140
          if (data.height_min) {
              data.height_min = Number(data.height_min) + height_min - 1
          }
          data.spouse_condition.height_min = Number(data.height_min) + height_min - 1
          delete data.height_min

          if (data.height_max) {
              data.height_max = Number(data.height_max) + height_min - 1
          }
          data.spouse_condition.height_max = Number(data.height_max) + height_min - 1
          delete data.height_max

          var income_map = {
            0:0,
            1:2000,
            2:6000,
            3:10000,
            4:15000,
            5:20000,
            6:50000,
          }
          data.spouse_condition.income_min = income_map[data.income_min]
          delete data.income_min
          data.income = Number(data.income) + 1;
          data.education = Number(data.education) + 1;
          data.height = Number(data.height) + 140;
          data.spouse_condition.education_min = Number(data.education_min);
          delete data.education_min

          // 默认数据
          var currentTime = Math.round(new Date().getTime() / 1000)
          data.created_time = currentTime
          data.last_moded_time = currentTime
          data.wechat_user_info = this.data.wechatUserInfo

          return data
      },

      chooseImage: function (e) {
        console.log(this.data.files.length)
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    }


});