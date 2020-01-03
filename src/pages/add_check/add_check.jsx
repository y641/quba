import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtInput, AtForm, AtIcon, AtButton } from 'taro-ui'
import { addperson,newid} from '../utils/utils'
import './add_check.scss'

var info = []
export default class Addcheck extends Component {
  config = {
    navigationBarTitleText: '添加同住',
  }
  state = {
    selector: ['身份证', '临时身份证', '军（警）官证', '士兵证'],
    selectorChecked: '身份证',
    name: '',
    mobile: '',
    idCard: '',
    getinfo: null,
      appid: '',
    sex:''
  }
  componentWillMount() {
    console.log(this.$router.params,'haha')
    info = [...info,this.$router.params.info]
    let getinfo = JSON.parse(info[0])
    this.setState({ getinfo, appid:this.$router.params.appid,sex:this.$router.params.sex })
  }
  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }

  choosePhoneContact = () => {
    my.choosePhoneContact({
      success: (res) => {
            if (res) {
          let phone = res.mobile.split("-").join("")
          this.setState({ name: res.name, mobile: phone })
        } else {
          my.alert({ content: '请重试' })
        }
      },
      fail: (res) => {
        my.alert({
          content: '读取失败，请重新读取'
        });
      },
    });
  }
    choose = () => {
    if (this.state.name === '') {
      Taro.showToast({ title: '姓名不能为空', icon: 'none' }
      )
      return
    } else if (this.state.mobile === "") {
        Taro.showToast({ title: '手机号不能为空', icon: 'none' })
      return
    } else if (this.state.mobile.length !== 11) {
        Taro.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
        
    } else {
        let gender = ''
        this.state.sex==='f'?gender='女' :gender='男'
        addperson({
            name: this.state.name,
            sex: gender,
            idCode: '01',
            idNo: this.state.idCard,
            masterId: this.state.getinfo.id
        }, (res) => {
                console.log(res)
                if (res.data && res.data.resultCode === 0) {
                    Taro.navigateTo({
                        url: `/pages/registration/registration?info=${JSON.stringify({
                            name: this.state.name, mobile: this.state.mobile, selector: this.state.selectorChecked, idcard: this.state.idCard
                        })}&appid=${this.state.appid}&num=3&newid=${[res.data.resultInfo]}`
                    })
                } else {
                    Taro.showToast({
                        title: '请求失败',
                        icon:'none'
                    })
                    return
                }
                
        }, (err) => {
            Taro.showToast({
                title: '请求失败',
                icon: 'none'
            })
            return})
    }
    }
    
  render() {
    return (
      <View className='add_check'>
        <AtForm>
          <AtInput
            name='name'
            title='姓名*'
            editable={this.state.editable}
            type='text'
            placeholder='请输入同住人真实姓名'
            value={this.state.name}
            onChange={(value) => { this.setState({ name: value }) }}
          />

          <AtInput
            name="mobile"
            title='手机*'
            type='phone'
            placeholder='请输入有效手机号码'
            value={this.state.mobile}
                    onChange={(value) => {
                        this.setState({ mobile: value })
                    }}
          />
          <View className='container'>
            <View className='page-body'>
              <View className='page-section'>
                <View>
                  <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                    <View className='picker' style={{ padding: '0.3rem 0', paddingBottom: '0.4rem', borderBottom: '1px solid #EFF5F9' }}>
                      <Text style={{ padding: '0.3rem' }}>证件类型</Text>
                      <Text style={{ paddingLeft: '0.5rem' }}>
                        {this.state.selectorChecked}
                      </Text>
                      <Text style={{ paddingLeft: '1.9rem', color: '#1F90E6' }}>更换证件</Text>
                    </View>
                  </Picker>
                </View>
              </View>
            </View>
          </View>
          <AtInput
            name='idCard'
            title='证件号码'
            type='idcard'
            value={this.state.idCard}
            placeholder='请与证件保持一致（非必填项）'
                    onChange={(value) => {
                        console.log(value)
                        this.setState({ idCard: value })
                    }}
          />
        </AtForm>
        <View onClick={this.choosePhoneContact} style={{ width: '5rem' }}>
          <AtIcon value='user' size='25' color='#1F90E6'></AtIcon>
        </View>
        <AtButton type='primary' onClick={this.choose}>确定</AtButton>
      </View>
    )
  }
}