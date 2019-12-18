import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtInput, AtForm, AtIcon, AtButton } from 'taro-ui'
import './add_check.scss'

export default class Index extends Component {
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
    money: null,
    appid: ''
  }
  componentWillMount() {
    let info = JSON.parse(this.$router.params.info)
    let money = JSON.parse(this.$router.params.money)
    this.setState({ getinfo: info, money, appid: this.$router.params.appid })
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
          this.setState({ name: res.name, mobile: res.mobile })
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
            onChange={(value) => { this.setState({ mobile: value }) }}
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
            onChange={(value) => { this.setState({ idCard: value }) }}
          />
        </AtForm>
        <View onClick={this.choosePhoneContact} style={{ width: '5rem' }}>
          <AtIcon value='user' size='25' color='#1F90E6'></AtIcon>
        </View>
        <AtButton type='primary' onClick={() => {
          if (this.state.name === '') {
            Taro.showToast({ title: '姓名不能为空', icon: 'none' }
            )
            return
          } else if (this.state.mobile === "") {
            Taro.showToast({ title: '手机号不能为空', icon: 'none' }
            )
            return
          } else if (this.state.idCard === "") {
            Taro.showToast({ title: '身份证号不能为空', icon: 'none' }
            )
            return
          } else {
            Taro.request({
              url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/src/masteradd',
              header: {
                'Content-Type': 'application/json',
                'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
              },
              method: 'POST',
              data: {
                "hotelGroupCode": "EDBG",
                "hotelCode": "EDB1",
                name: this.state.name,
                sex: '女',
                idCode: '01',
                idNo: this.state.idCard,
                masterId: this.state.getinfo.id
              },
              dataType: 'json',
              success: (res) => {
                console.log(res, '添加同住人')
                Taro.navigateTo({ url: `/pages/registration_check/registration_check?name=${this.state.name}&mobile=${this.state.mobile}&selector=${this.state.selectorChecked}&idcard=${this.state.idCard}&info=${JSON.stringify(this.state.getinfo)}&money=${JSON.stringify(this.state.money)}&appid=${this.state.appid}` })
              }
            })
          }



        }}>确定</AtButton>
      </View>
    )
  }
}