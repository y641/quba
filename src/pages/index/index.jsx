import Taro, { Component } from '@tarojs/taro'
import { View,  Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtList, AtListItem, AtCard, AtDivider } from 'taro-ui'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '绿云大酒店'
  }
  state = {
    hasBorder: false,
    IdCard: '341221199307118587',
   isLoading: 'isLoading',
    appid:null
  } 
  componentDidMount() {
    my.getAuthCode({
      scopes: 'auth_user',
       success: (res) => {
      this.mebme(res.authCode)
      }
    });
 }
 //小程序授权
 mebme = (code) => {
  console.log(code)
  Taro.request({
   url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/alipay/getauthbuyerid',
   header: {
    'Content-Type': 'application/json',
    'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
   },
   method:'POST',
   data: {
    "hotelGroupCode": "EDBG",
    "hotelCode": "EDB1",
    authCode:code
   },
   dataType: 'json',
   success: (res) => {
    console.log(res, '小程序授权')
    if (res.data && res.data.resultCode===0) {
     this.setState({ appid: res.data.resultInfo })
    }
   }
  })
 }

//按照身份证号查询成员单
  inquiryMembe = () => {
    Taro.request({
      url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/item/list',
      header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
      },
      method: 'POST',
      data: {
        "hotelGroupCode": "EDBG",
        "hotelCode": "EDB1",
        idCode: '01',
        idNo:'341221199207118587'
      },
      dataType: 'json',
      success: (res) => {
        console.log(res, '身份证查询成员单')
         //通过身份证没有查询到成员单
        if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length === 0) {
          //按照姓名查询成员单  
          this.inquiryName()
        } else {
          Taro.navigateTo({ url: `/pages/order_check/order_check?info=${JSON.stringify(res.data.resultInfo[0])}&appid=${this.state.appid}` })
        }
      },
      fail: (res) => {
        console.log(res, '失败')
      }
    })
  }
  //按照姓名查询成员单
  inquiryName = () => {
    Taro.request({
      url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/item/list',
      header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
      },
      method: 'POST',
      data: {
        "hotelGroupCode": "EDBG",
        "hotelCode": "EDB1",
        name:'杨利萍'
      },
      dataType: 'json',
      success: (res) => {
        console.log(res, '姓名查询成员单')
        if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length === 0) {
          //按照姓名查询成员单，没有查询到 按照身份证号查询预订单
          this.inquiryPredetermined()
        } else {
          Taro.hideLoading()
         Taro.navigateTo({ url: `/pages/order_check/order_check?info=${JSON.stringify(res.data.resultInfo[0])}&appid=${this.state.appid}` })
        }
      },
      fail: (res) => {
        console.log(res, '失败')
      }
    })
  }

  //按照身份证号查询预定单
  inquiryPredetermined = () => {
    Taro.request({
      url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/src/only/list',
      header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
      },
      method: 'POST',
      data: {
        "hotelGroupCode": "EDBG",
        "hotelCode": "EDB1",
        idCode: '01',
        idNo:'341221199207118587'
      },
      dataType: 'json',
      success: (res) => {
        console.log(res, '身份证查询预定单')
        if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length > 0) {
          //按照身份证查询到预定单 ,查询到预订单 拆分
          this.getContnet(res.data.resultInfo[0])
        } else {
          //按照姓名查询预定单
          this.inquiry()
        }
      },
      fail: (res) => {
        console.log(res, '失败')
      }
    })
  }
  //按姓名查询预定单
  inquiry = () => {
    Taro.request({
      url: 'https://openapidev.ipms.cn/igroup/edbg//openapi/v1/order/src/only/list',
      header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
      },
      method: 'POST',
      data: {
        "hotelGroupCode": "EDBG",
        "hotelCode": "EDB1",
        rsvMan:'杨利萍'
      },
      dataType: 'json',
      success: (res) => {
        console.log(res, '姓名查询预定单')
        if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length > 0) {
          this.getContnet(res.data.resultInfo[0])
        }
      }
    })
  }
  //拆分预定单
  getContnet = (info) => {
    Taro.request({
      url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/src/split/one',
      header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
      },
      method: 'POST',
      data: {
        "hotelGroupCode": "EDBG",
        "hotelCode": "EDB1",
        mobile: info.mobile,
        rsvSrcId: info.rsvSrcId,
        name: info.rsvMan,
        idNo: '341221199207118587',
        sex: '女',
        idCode: '01',
        race: '汉',
        address:'合肥市蜀山区'
      },
      dataType: 'json',
      success: (res) => {
        console.log(res, '拆分成员单')
        if (res.data && res.data.resultCode === 0) {
          // Taro.hideLoading()
         Taro.navigateTo({ url: `/pages/order_check/order_check?info=${JSON.stringify(res.data.resultInfo)}&appid=${this.state.appid}` })
        }       
      },
      fail: (res) => {
        console.log(res, '失败')
      }
    })
 }
  render() {
    return (
      <View className='choose_check'>
        {/* 轮播图 */}
        <Swiper
          className="swiper-container"
          circular
          indicatorDots
          indicatorColor='#999'
          indicatorActiveColor='#bf708f'
          autoplay>
            <SwiperItem>
              <Image className="swiper-img" mode="widthFix" src={require('../../img/1.jpg')}></Image>
          </SwiperItem>
          <SwiperItem>
            <Image className="swiper-img" mode="widthFix" src={require('../../img/2.jpg')}></Image>
          </SwiperItem>
          <SwiperItem>
            <Image className="swiper-img" mode="widthFix" src={require('../../img/3.jpg')}></Image>
          </SwiperItem>
        </Swiper>
        {/* 卡片 */}
          <AtCard>
          <AtList hasBorder={this.state.hasBorder}>
            <AtListItem title='散客入住' note='FIT' loading onClick={() => {
              // Taro.showLoading({
              //   title: '匹配中'
              // })
              this.inquiryMembe()
              }}/>
              <AtListItem
                note='GROUP'
              title='团队入住'
              hasBorder={this.state.hasBorder}
              />
            </AtList>
        </AtCard>
      <AtDivider content='客房介绍' fontColor='#000' lineColor='#000' />
      <button open-type='getAuthorize'
       onGetAuthorize={() => {
        my.getOpenUserInfo({
         fail: (res) => {
          console.log(res, '失败')
         },
         success: (res) => {
          console.log(res, '授权')
         }
        });
       }} >
    会员基础信息授权
</button>
      </View>
    )
  }
}
