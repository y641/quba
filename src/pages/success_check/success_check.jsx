import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSteps, AtCard, AtList, AtListItem, AtButton } from 'taro-ui'
import './success_chenck.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '登记确认'
  }
  state = {
    current: 3,
    getinfo: null,
    idcard: '',
    mobile: '',
    name:''
  }
  componentWillMount() {
    console.log(this.$router.params)
    let info = JSON.parse(this.$router.params.info)
    this.setState({ getinfo: info ,idcard:this.$router.params.idcard,mobile:this.$router.params.mobile,name:this.$router.params.name})
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
      <View className='success'>
        {/* 步骤条 */}
        <AtSteps
          items={items}
          current={this.state.current}
          onChange={this.onChange}
        />
        <AtCard>
          登记成功！请去线下自助机拿房卡入住!
        </AtCard>
        <View className='at-article__h2'>
         登记信息
        </View>
        <View className='line'></View>
        {/* 入住人信息 */}
        <View className='at-article__p'>{this.state.getinfo.name || this.state.getinfo.rsvMan}</View>
        <View className='at-article__p'>{`手机号：${this.state.getinfo.mobile}`}</View>
        <View className='at-article__p'>{`身份证：${this.state.getinfo.idNo}`}</View>
        <View className='at-article__h2'>
          同住人 
        </View>
        <View className='at-article'>
          <View className='at-article__p'>{this.state.name}</View>
          <View className='at-article__p'>{`手机号：${this.state.mobile}`}</View>
          <View className='at-article__p'>{`身份证：${this.state.idcard}`}</View>
       </View>
        <View className='at-article'>
          <AtButton type='primary' onClick={() => {
          }}>添加同住人</AtButton>
       </View>
      </View>
    )
  }
}
