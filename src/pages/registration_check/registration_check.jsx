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
    phone: ''
  }
  componentWillMount() {
    let info = JSON.parse(this.$router.params.info)
    let money = JSON.parse(this.$router.params.money)
    this.setState({ getinfo: info, money, name: this.$router.params.name, idcard: this.$router.params.idcard, mobile: this.$router.params.mobile })
  }
  onChange = (value) => {
    this.setState({ current: value })
  }
  handleClose = () => {  
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
            <br />
            <View className='room'>地址：西湖区文三路</View>
          </AtCard>
          <View className='content'>
            <Text className='person_check'>入住人</Text>
            <Text className='person'>添加同住人</Text>
          </View>
          <View className='line'></View>
          <AtList>
          {/* 入住人信息 */}
            <AtListItem title={this.state.getinfo.rsvMan} />
            <AtListItem title={`手机号：${this.state.getinfo.mobile}`} />
            <AtListItem title={`身份证：${this.state.getinfo.idNo}`} />
          </AtList>
          <View className='content'>
            <Text className='person_check'>同住人</Text>
            <View className='line'></View>
          </View>
          <AtSwipeAction options={[
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
          ]}>
            <View className='normal'>
              <AtList>
                <AtListItem title={this.state.name} />
                <AtListItem title={`手机号：${this.state.mobile}`} />
                <AtListItem title={`身份证：${this.state.idcard}`} />
              </AtList>
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
             
            }}>确认登记并支付押金</Text>
          </View>
        </View>}
      </View>
    )
  }
}