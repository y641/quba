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
   getinfo:null
  }
  componentWillMount() {
   let info = JSON.parse(this.$router.params.info)
   console.log(info)
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
        <AtList>
          <AtListItem title={this.state.getinfo.name} />
          <AtListItem title={`手机号：${this.state.getinfo.mobile}`} />
          <AtListItem title={`身份证:${this.state.getinfo.idNo}`} />
        </AtList>
        {/* <AtList>
          <AtListItem title='刘德' />
          <AtListItem title='手机号：150****5150' />
          <AtListItem title='身份证：3***************9' />
        </AtList> */}
        <AtButton type='primary' onClick={() => {
        }}>添加同住人</AtButton>
      </View>
    )
  }
}
