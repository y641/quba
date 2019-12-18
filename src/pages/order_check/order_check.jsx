import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import { AtSteps, AtCard, AtButton, AtIcon } from 'taro-ui'
import './order_check.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '订单核对',
  }
  state = {
    current: 0,
    icon: 'check',
    iconcheck: false,
    getinfo: null,
    appid: null,
     mobile:''
  }
  componentWillMount() {
    console.log(this.$router.params)
    let info = JSON.parse(this.$router.params.info)
    this.setState({ getinfo: info, appid: this.$router.params.appid, mobile:this.$router.params.mobile })
  }
  onChange = (value) => {
    this.setState({ current: value })
  }
  list = () => {
    //查询可用房间
    Taro.request({
      url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/avail/rmno/list',
      header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
      },
      method: 'POST',
      data: {
        "hotelGroupCode": "EDBG",
        "hotelCode": "EDB1",
        rmtype: this.state.getinfo.rmtype,
        arr: this.state.getinfo.arr,
        dep: this.state.getinfo.dep
      },
      dataType: 'json',
      success: (res) => {
        console.log(res, '查询可用房')
        if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length > 0) {
          this.check(res.data.resultInfo[0].rmno)
        } else {
          Taro.showToast({
            title: '无可用房间，请联系酒店前台',
            icon: 'none'
          })
        }
      }
    })
  }
  check = (room) => {
    Taro.request({
      url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/item/rmno/assign',
      header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
      },
      method: 'POST',
      data: {
        "hotelGroupCode": "EDBG",
        "hotelCode": "EDB1",
        masterId: this.state.getinfo.id,
        rmno: room
      },
      dataType: 'json',
      success: (res) => {
        console.log(res, '成员单排房')
        if (res.data && res.data.resultCode === 0) {
          this.checkin()
        } else {
          Taro.showToast({
            title: '已入住状态',
            icon: 'none'
          })
        }
      }
    })
  }
  checkin = () => {
    Taro.request({
      url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/item/checkin',
      header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
      },
      method: 'POST',
      data: {
        "hotelGroupCode": "EDBG",
        "hotelCode": "EDB1",
        masterId: this.state.getinfo.id,
      },
      dataType: 'json',
      success: (res) => {
        console.log(res, '成员单登记入住')
        if (res.data && res.data.resultCode === 0) {
          Taro.navigateTo({ url: `/pages/registration/registration?info=${JSON.stringify(this.state.getinfo)}&appid=${this.state.appid}&mobile=${this.state.mobile}` })
        } else {
          Taro.showToast({
            title: '入住失败 请联系酒店前台',
            icon: 'none'
          })
        }
      }
    })
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
        <AtCard
          title='请选择预定信息'
          onClick={() => {
            this.setState({ iconcheck: !this.state.iconcheck })
          }}
        >
          <View>
            <Text className='at-article'>预定人：{this.state.getinfo.name}</Text>
            <Text className='at-article ditch'>预定渠道：飞猪</Text>
          </View>
          <View className='at-article'>联系电话：{this.state.getinfo.mobile || this.state.mobile}</View>
          <View className='at-article'>入住日期：{this.state.getinfo.arr}</View>
          <View className='at-article'>离店日期：{this.state.getinfo.dep}</View>
          <View className='at-article'>入住房型：{this.state.getinfo.rmtype}</View>
          <View className='at-article'>房间数量：共1间</View>
        </AtCard>
        <AtIcon value={this.state.iconcheck ? this.state.icon : ""} size='30' color='#6190E8'></AtIcon>
        {/* 入住信息 */}
        <AtCard
          title='请选择入住信息'
          onClick={() => { console.log('111') }}
        >
          <View className='at-article'>入住人：{this.state.getinfo.name}（本人）</View>
          <View className='at-article'>联系电话：{this.state.getinfo.mobile || this.state.mobile}</View>
          <View className='at-article'>证件：{this.state.getinfo.idNo}</View>
          <View className='at-article'>入住房型：{this.state.getinfo.rmtype}</View>
          <View className='at-article'>房间数量：共1间</View>
        </AtCard>
        {/* <AtButton type='primary' onClick={this.list}>确认选择</AtButton> */}
        <AtButton type='primary' onClick={() => {
          Taro.navigateTo({ url: `/pages/registration/registration?info=${JSON.stringify(this.state.getinfo)}&appid=${this.state.appid}&&mobile=${this.state.mobile}` })
        }}>确认选择</AtButton>
      </View>
    )
  }
}