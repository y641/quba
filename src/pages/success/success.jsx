import Taro, { Component} from '@tarojs/taro'
import { View,Text  } from '@tarojs/components'
import { AtSteps, AtCard, AtList, AtListItem, AtButton } from 'taro-ui'
import './success.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '登记确认'
  }
  state = {
   current: 3,
    getinfo: null,
   money:null
  }
  componentWillMount() {
   let info = JSON.parse(this.$router.params.info)
   console.log(info,'你好好好')
   this.setState({getinfo:info})
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
        <View className='content'>
          <Text className='person_check'>登记信息</Text>
        </View>
        <View className='line'></View>
        {/* 入住人信息 */}
        {/* <View className='at-article__p'>{this.state.getinfo.name || this.state.getinfo.rsvMan}</View>
        <View className='at-article__p'>{`手机号：${this.state.getinfo.mobile}`}</View>
        <View className='at-article__p'>{`身份证：${this.state.getinfo.idNo}`}</View> */}
        {this.state.getinfo && this.state.getinfo.map((item) => {
          return <View className='at-article__h1'>
            <View className='at-article__p'>{item.name}</View>
            <View className='at-article__p'>手机号：{item.mobile}</View>
            <View className='at-article__p'>身份证{item.idcard}</View>
            <View className='line'></View>
          </View>
        })}
        <AtButton type='primary' onClick={() => {
          Taro.navigateTo({ url: `/pages/add_check/add_check?info=${JSON.stringify(this.state.getinfo[0])}`})
        }}>添加同住人</AtButton>
      </View>
    )
  }
}
