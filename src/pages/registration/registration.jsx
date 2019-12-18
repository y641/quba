import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSteps, AtCard, AtList, AtListItem, AtIcon, AtFloatLayout } from 'taro-ui'
import "taro-ui/dist/style/components/float-layout.scss";
import './registration.scss'

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
    appid: '',
    mobile:''
  }
  componentWillMount() {
    console.log(this.$router.params)
    const info = JSON.parse(this.$router.params.info)
    console.log(info)
    this.setState({ getinfo: info, appid: this.$router.params.appid, mobile: this.$router.params.mobile })
    this.getMoney(info.id)
  }
  getMoney = (id) => {
    Taro.request({
      url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/item/rmfee/nonpay',
      header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
      },
      method: 'POST',
      data: {
        "hotelGroupCode": "EDBG",
        "hotelCode": "EDB1",
        masterId: id
      },
      success: (res) => {
        console.log(res, '押金')
        if (res.data && res.data.resultCode === 0) {
          this.setState({ isLoading: false, money: res.data.resultInfo })
        }
      }
    })
  }
  onChange = (value) => {
    this.setState({ current: value })
  }
  pay = () => {
    console.log(this.state.appid, this.state.getinfo.id)
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
        subject: "豪华大床房",
        masterId: this.state.getinfo.id,
        totalFee: 0.01,
        buyerId: this.state.appid
      },
      dataType: 'json',
      success: (res) => {
        console.log(res, '支付接口')
        if (res.data && res.data.resultCode === 0) {
          my.tradePay({
            tradeNO: res.data.resultInfo,
            success: (res) => {
              console.log(res, '唤起收银台')
              if (res.result === "" && res.resultCode === '6001') {
                return
              } else {
                Taro.navigateTo({ url: `/pages/success/success?info=${JSON.stringify(this.state.getinfo)}` })
              }
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
        <View className='registration'>
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
            <View className='at-article '>
              <Text >绿云大酒店</Text>
              <Text className='at-article disthapp '>1003</Text>
            </View>
            <View className='at-article '>
              <View className='at-article '>入住：{this.state.getinfo.arr}</View>
              <View className='at-article '>离店：{this.state.getinfo.dep}
                <Text className='at-article disth'>共{this.state.getinfo.rmnum} 1晚</Text>
              </View>
            </View>
          </AtCard>
          <View className='at-article'>
            <Text className='at-article__h3 at-article'>入住人</Text>
            <Text className='person at-article ' onClick={() => {
              Taro.navigateTo({ url: `/pages/add_check/add_check?info=${JSON.stringify(this.state.getinfo)}&money=${JSON.stringify(this.state.money)}&appid=${this.state.appid}` })
            }}>添加同住人</Text>
          </View>
          <View className='line'></View>
          {/* 入住人信息 */}
          <View className='at-article__p'>入住人:{this.state.getinfo.name || this.state.getinfo.rsvMan}</View>
          <View className='at-article__p'>{`手机号：${this.state.getinfo.mobile || this.state.mobile}`}</View>
          <View className='at-article__p'>{`身份证：${this.state.getinfo.idNo}`}</View>
          {/* 费用明细 */}
          <View className='momey'>
            <Text onClick={() => {this.setState({ status: !this.state.status })}}>
              <Text className='money_r'>{`￥${this.state.money && this.state.money.nonPay}`}</Text>
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
            <Text className='money_p' onClick={this.pay}>确认登记并支付押金</Text>
          </View>
        </View>
      </View>
    )
  }
}