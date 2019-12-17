import Taro, { Component} from '@tarojs/taro'
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
    isLoading: true,
  }
 componentWillMount() {
  console.log(this.$router.params)
  const info = JSON.parse(this.$router.params.info)
  this.setState({ getinfo: info, appid: this.$router.params.appid})
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
        masterId:id
      },
      success: (res) => {
        console.log(res, '押金')
        if (res.data && res.data.resultCode === 0) {
          this.setState({isLoading:false,money:res.data.resultInfo})
        }
      }
    })
  }
  onChange = (value) => {
    this.setState({ current: value })
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
            <View className='room'>
              <Text>绿云大酒店</Text>
              <Text className='roomcode'>1003</Text>
            </View>
            <View className='room'>
              <View className='check'>入住：{this.state.getinfo.arr}</View>
              <View className='check'>离店：{this.state.getinfo.dep}</View>
              <Text className='check'>共{this.state.getinfo.rmnum} 1晚</Text>
            </View>
            <br />
            <View className='room'>地址：西湖区文三路</View>
          </AtCard>
          <View className='content'>
            <Text className='person_check'>入住人</Text>
            <Text className='person' onClick={() => {
              Taro.navigateTo({ url: `/pages/add_check/add_check?info=${JSON.stringify(this.state.getinfo)}&money=${JSON.stringify(this.state.money)}` })
            }}>添加同住人</Text>
          </View>
          <View className='line'></View>
          {/* 入住人信息 */}
          <AtList>
            <AtListItem title={this.state.getinfo.rsvMan} />
            <AtListItem title={`手机号：${this.state.getinfo.mobile}`} />
            <AtListItem title={`身份证：${this.state.getinfo.idNo}`} />
          </AtList>


          {/* 费用明细 */}
          <View className='momey'>
            <Text onClick={() => {
              this.setState({ status: !this.state.status })
            }}>
              <Text className='money_r'>{`￥${this.state.money && this.state.money.nonPay}`}</Text>
              <Text className='money_t'>明细</Text>
              {this.state.status ? <AtFloatLayout isOpened title="费用明细">
                <AtList hasBorder={this.state.hasBorder}>
                  <AtListItem title={this.state.getinfo.arr} extraText={`￥${this.state.money.rmFeeTtl}`} hasBorder={this.state.hasBorder} />
                  <AtListItem title={this.state.getinfo.dep} extraText={`￥${this.state.money.rmFeeTtl}`} hasBorder={this.state.hasBorder} />
                  <AtListItem title='押金' extraText={`￥${this.state.money.nonPay}`} hasBorder={this.state.hasBorder} />
                  <AtListItem title='' extraText={`订单总计：￥${this.state.money.nonPay}`} hasBorder={this.state.hasBorder} />
                </AtList>
              </AtFloatLayout> : null}
            </Text>
            <AtIcon value='chevron-up' size='20' color='#666' className='icon'></AtIcon>
        <Text className='money_p' onClick={() => {
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
           subject:"豪华大床房",
           masterId: this.state.getinfo.id,
           totalFee: 0.01,
           buyerId:this.state.appid
          },
          dataType: 'json',
          success: (res) => {
           console.log(res.data.resultInfo, '支付接口')
           my.tradePay({
              tradeNO: res.data.resultInfo ,
                success: (res) => {
                 console.log(res, '唤起收银台')
                 if (res.result === "" && res.resultCode==='6001') {
                  return 
                 } else {
                  Taro.navigateTo({url:`/pages/success/success?info=${JSON.stringify(this.state.getinfo)}`})
                 }
                },
                fail: (res) => {
                }
              });
          }
         })
              
            }}>确认登记并支付押金</Text>
          </View>
        </View>
     </View>
    )
  }
}