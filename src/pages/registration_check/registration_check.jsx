import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSteps, AtCard, AtList, AtListItem, AtIcon, AtFloatLayout, AtSwipeAction } from 'taro-ui'
import './registration_check.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '登记确认',
  }
  state = {
    current: 1,
    status: false,
    hasBorder: false,
    getinfo: null,
    money: null,
    isLoading: false,
    name: '',
    idcard: '',
    phone: '',
    appid: '',
    del: [
      {
        text: '取消',
        style: {
          backgroundColor: '#6190E8'
        }
      },
      {
        text: '确认',
        style: {
          backgroundColor: '#FF4949'
        }
      }
    ]
  }
  componentWillMount() {
    let info = JSON.parse(this.$router.params.info)
    let money = JSON.parse(this.$router.params.money)
    this.setState({ getinfo: info, money, name: this.$router.params.name, idcard: this.$router.params.idcard, mobile: this.$router.params.mobile, appid: this.$router.params.appid })
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
          // this.check(res.data.resultInfo[0].rmno)
          this.setState({ room: res.data.resultInfo[0].rmno })
          this.pay()
        } else {
          Taro.showToast({
            title: '无可用房间，请联系酒店前台',
            icon: 'none'
          })
          return 
        }
      }
    })
  }
  check = () => {
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
        rmno:this.state.room
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
          return
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
          Taro.navigateTo({ url: `/pages/success_check/success_check?info=${JSON.stringify(this.state.getinfo)}&name=${this.state.name}&idcard=${this.state.idcard}&mobile=${this.state.mobile}` })
          // this.pay()
          // Taro.navigateTo({ url: `/pages/registration/registration?info=${JSON.stringify(this.state.getinfo)}&appid=${this.state.appid}&mobile=${this.state.mobile}` })
        } else {
          Taro.showToast({
            title: '入住失败 请联系酒店前台',
            icon: 'none'
          })
        }
      }
    })
  }
  pay = () => {
    Taro.request({
      url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/alipay/gettradeno',
      header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
      },
      method: 'POST',
      data: {
        "hotelGroupCode": "EDBG",
        "hotelCode": "EDB1",
        subject: this.state.getinfo.rmtype,
        masterId: this.state.getinfo.id,
        totalFee:this.state.money.nonPay,
        // totalFee:0.01,
        buyerId: this.state.appid
      },
      dataType: 'json',
      success: (res) => {
        console.log(res, '支付接口')
        if (res.data && res.data.resultCode === 0) {
          my.tradePay({
            tradeNO: res.data.resultInfo,
            success: (res) => {
              console.log(res,'支付接口')
              if (res.result && res.memo === "") {
                this.check()
              }
              // else {
              //   this.check()
              //   // Taro.navigateTo({ url: `/pages/success_check/success_check?info=${JSON.stringify(this.state.getinfo)}&name=${this.state.name}&idcard=${this.state.idcard}&mobile=${this.state.mobile}` })
              // }
            },
            fail: (res) => {
            }
          });
        } else {
          Taro.showToast({
            title: '付款失败'
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
      <View>
        {this.state.isLoading ? this.state.isLoading : <View className='registration'>
          {/* 步骤条 */}
          <AtSteps
            items={items}
            current={this.state.current}
            onChange={this.onChange}
          />
          {/* 登记确认 */}
          <AtCard
            onClick={() => { console.log('111') }}
          >
            <View className='room'>
              <Text>绿云大酒店</Text>
              <Text className='roomcode'>1003</Text>
            </View>
            <View className='room'>
              <View className='check'>入住：{this.state.getinfo.arr}</View>
              <View className='check'>离店：{this.state.getinfo.dep}</View>
              <Text className='check'>共{this.state.getinfo.rmnum} 1晚</Text>
            </View>
          </AtCard>
          <View className='at-article'>
            <Text className='person_check'>入住人</Text>
            <Text className='person'>添加同住人</Text>
          </View>
          <View className='line'></View>
          <View className='at-article'>
            <View className='at-article__p'>{this.state.getinfo.name || this.state.getinfo.rsvMan}</View>
            <View className='at-article__p'>{`手机号：${this.state.getinfo.mobile}`}</View>
            <View className='at-article__p'>{`身份证：${this.state.getinfo.idNo}`}</View>
          </View>
          <View className='content'>
            <Text className='person_check'>同住人</Text>
            <View className='line'></View>
          </View>
          <AtSwipeAction options={this.state.del}>
            <View className='at-article'>
              <View className='at-article__p'>{this.state.name}</View>
              <View className='at-article__p'>{`手机号：${this.state.mobile}`}</View>
              <View className='at-article__p'>{`身份证：${this.state.idcard}`}</View>
            </View>
          </AtSwipeAction>

          {/* 费用明细 */}
          <View className='momey'>
            <Text onClick={() => {
              this.setState({ status: !this.state.status })
            }}>
              <Text className='money_r'>{`￥${this.state.money.nonPay}`}</Text>
              <Text className='money_t'>明细</Text>
              {this.state.status ? <AtFloatLayout isOpened title="费用明细">
                <View className='at-row at-row__justify--between'>
                  <View className='at-col at-col-9'>{this.state.getinfo.arr}</View>
                  <View className='at-col at-col-2'>{`￥${this.state.money.rmFeeTtl}`}</View>
                </View>
                <View className='at-row at-row__justify--between'>
                  <View className='at-col at-col-9'>{this.state.getinfo.dep}</View>
                  <View className='at-col at-col-2'>{`￥${this.state.money.rmFeeTtl}`}</View>
                </View>
                <View className='at-row at-row__justify--end'>
                  <View className='at-col at-col-5'></View>
                  <View className='at-col at-col-5'>{`订单总计：￥${this.state.money.nonPay}`}</View>
                </View>
              </AtFloatLayout> : null}
            </Text>
            <AtIcon value='chevron-up' size='20' color='#666' className='icon'></AtIcon>
            <Text className='money_p' onClick={this.list}>确认登记并支付押金</Text>
          </View>
        </View>}
      </View>
    )
  }
}