import Taro, { Component} from '@tarojs/taro'
import { View,Text  } from '@tarojs/components'
import { AtSteps, AtCard, AtButton } from 'taro-ui'
import './success.scss'
import { shotgunhouse, checkperson} from '../utils/utils'
import { order } from '../utils/AppData'

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
        if (this.$router.params.newid) {
            this.setState({ newid: JSON.parse(this.$router.params.newid)})
        }
   let info = JSON.parse(this.$router.params.info)
        this.setState({ getinfo: info, rmno: this.$router.params.rmno})
    }
    componentDidMount() {
        this.check()
    }
    //成元单排房
    check = () => {
        shotgunhouse({
            masterId: this.state.getinfo[0].id,
            rmno: this.state.rmno
        }, (res) => {
                console.log(res,'排房')
                if (res.data && res.data.resultCode === 0) {
                    this.checkin()
                } else {
                    Taro.showToast({
                        title: '排房失败',
                        icon:'none'
                    })
                    return 
                }
                
        })
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
        {this.state.getinfo && this.state.getinfo.map((item,index) => {
          return <View className='at-article__h1'>
            <View className='at-article__p'>{item.name}</View>
            <View className='at-article__p'>手机号：{item.mobile}</View>
            <View className='at-article__p'>身份证:{index===0 ? item.idNo : item.idcard}</View>
            <View className='line'></View>
          </View>
        })}
        <AtButton type='primary' style='margin:30px 15px 0 15px' onClick={() => {
          Taro.navigateBack({delta:100})
        }}>返回首页</AtButton>
      </View>
    )
  }
}
