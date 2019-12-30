import Taro, { Component, initPxTransform } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import { AtSteps, AtCard, AtButton, AtIcon, AtRadio, AtAccordion, AtList, AtListItem  } from 'taro-ui'
import './order_check.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '订单核对',
  }
  state = {
    current: 0,
    icon: '#ff0',
    // checkcircle: '#6190E8',
    checkcircle: '#f0f',
    iconcheck:true,
    getinfo: null, //订单信息
    appid: null,  //userid
    mobile: '', //手机号
    username: '', //真实姓名
    idcard: '', //身份证号码
      list: null,
      info: null,
      sex: '',
      item: null,
    currentIndex:'0'
  }
    componentWillMount() {
        let list = [...JSON.parse(this.$router.params.info)]
        console.log(list,'list')
        this.setState({ order: list, appid: this.$router.params.appid, mobile: this.$router.params.mobile, username: this.$router.params.username, idcard: this.$router.params.idcard,sex:this.$router.params.sex})
  }
  choose = () => {
    // if (this.state.iconcheck === false) {
    //   Taro.navigateTo({ url: `/pages/registration/registration?info=${JSON.stringify(this.state.getinfo)}&appid=${this.state.appid}&mobile=${this.state.mobile}&username=${this.state.username}&rmnum=${this.state.rmnum}` })
    // } else {
    //   Taro.showToast({
    //     title: '请选择',
    //     icon: 'none'
    //   })
    // }
    }
    getContainer = () => {
        let gender = this.state.sex
        if (gender === 'f') {
            gender='女'
        } else {
            gender='男'
        }
        if (this.state.item.rsvSrcId) {
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
                    mobile: this.state.item.mobile,
                    rsvSrcId: this.state.item.rsvSrcId,
                    name: this.state.item.rsvMan,
                    idNo: this.state.idcard,
                    sex: gender,
                    idCode: '01',
                },
                dataType: 'json',
                success: (res) => {
                    console.log(res, '拆分成员单')
                    if (res.data && res.data.resultCode === 0) {
                        Taro.navigateTo({ url: `/pages/registration/registration?info=${JSON.stringify(res.data.resultInfo)}&appid=${this.state.appid}&mobile=${this.state.mobile}&username=${this.state.username}&num=1` })
                    }
                },
                fail: (res) => {
                    Taro.hideLoading()
                    Taro.showToast({
                        title: '请求失败',
                        icon: 'none'
                    })
                    return
                }
            })
        } else {
            Taro.navigateTo({ url: `/pages/registration/registration?info=${JSON.stringify(this.state.item)}&appid=${this.state.appid}&mobile=${this.state.mobile}&username=${this.state.username}&num=1` })
        }  
    }
    textContent = (item,index) => {
        this.setState({ item,currentIndex:index})
        console.log(item,'eeee')
    }
  render() {
    const items = [
      { 'title': '房间选择' },
      { 'title': '登记确认' },
      { 'title': '登记成功' }
    ]
    return (
      <View className='order_check'>
        {/* 步骤条 */}
        <AtSteps
          items={items}
          current={this.state.current}
          onChange={this.onChange}
        />
            {/* 预定信息 */}
            {this.state.order ? this.state.order.map((item, index) => {
                    return (
                        <View className='post'>
                            <AtCard
                                title={index===0 ? '请选择预订信息' : null}
                                onClick={this.textContent.bind(this,item,index)}
                            >
                            <View>
                                <Text className='at-article'>预定人：{item.rsvMan}</Text>
                                <Text className='at-article ditch'>预定渠道：飞猪</Text>
                            </View>
                                <View>
                                    <icon type="success" size='30' className='icon' color={index === this.state.currentIndex ? '#6190E8' :'#ddd'}/>
                            </View>
                            <View className='at-article'>联系电话：{item.mobile || this.state.mobile}</View>
                            <View className='at-article'>入住日期：{item.arr}</View>
                            <View className='at-article'>离店日期：{item.dep}</View>
                            <View className='at-article'>入住房型：{item.rmtype}</View>
                                <View className='at-article'>房间数量：共{item.rmnum}间</View>
                            </AtCard>
                        </View>
                    )
                }):null}
        <View className='at-article'>
        <AtButton type='primary' onClick={this.getContainer}>确认选择</AtButton>
        </View>
      </View>
    )
  }
}