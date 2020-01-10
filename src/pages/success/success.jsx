import Taro, { Component} from '@tarojs/taro'
import { View,Text  } from '@tarojs/components'
import { AtSteps, AtCard, AtButton } from 'taro-ui'
import './success.scss'
import { shotgunhouse, checkperson,noPassByMobile,noPassByName} from '../utils/utils'
import { order, getInfo, regtion} from '../utils/AppData'

export default class success extends Component {

  config = {
    navigationBarTitleText: '登记确认'
  }
  state = {
   current: 2,
    getinfo: null,
    money: null,
      rmno: '',
    newid:null
  }
    componentWillMount() {
        console.log(getInfo, regtion,'success')
        if (getInfo.newid) {
            this.setState({ getinfo: getInfo.list, newid: getInfo.newid }, () => { this.checkin() })
        } else {
            this.setState({ getinfo: regtion.regtionOrder }, () => { this.checkin() }) 
        }
    }
    //成员单登记入住
    checkin = () => {
            var id = [this.state.getinfo[0].id,]
        if (this.state.newid && this.state.newid.length > 0) {
            id.push(...this.state.newid)
        }
        checkperson({ masterId:id  }, (res) => {
            console.log(res,'入住')
            if (res.data && res.data.resultCode === 0) {
                order.status = 2
            } else {
                Taro.showToast({
                    title: '入住失败，请联系酒店前台',
                    icon:'none'
                })
                return 
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
            {this.state.getinfo ?this.state.getinfo.map((item, index) => {
                if (index === 0) {
                    var idcard = item.idNo.replace(/^(.{4})(?:\d+)(.{4})$/, "$1******$2")   
                } else {
                    var card = item.idcard.replace(/^(.{4})(?:\d+)(.{4})$/, "$1******$2")   
                }
          return <View className='at-article__h1'>
              <View className='at-article__p'>{noPassByName(item.name)}</View>
              <View className='at-article__p'>手机号：{noPassByMobile(item.mobile)}</View>
              <View className='at-article__p'>身份证:{index === 0 ? idcard : card}</View>
            <View className='line'></View>
          </View>
        }):null}
        <AtButton type='primary' style='margin:30px 15px 0 15px' onClick={() => {
          Taro.navigateBack({delta:100})
        }}>返回首页</AtButton>
      </View>
    )
  }
}
