import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtInput, AtForm, AtIcon, AtButton } from 'taro-ui'
import { addperson,newid} from '../utils/utils'
import './add_check.scss'

var info = []
//验证身份证号的真实性
function IdentityCodeValid(code) {
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var tip = "";
    var pass = true;

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    }

    else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    }
    else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    return pass;
}

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
        console.log(IdentityCodeValid(this.state.idCard))
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
    } else if (this.state.idCard === "") {
        Taro.showToast({ title: '身份证号不能为空', icon: 'none' })
        return
    } else if (IdentityCodeValid(this.state.idCard)===false) {
        console.log('验证身份证号')
            Taro.showToast({ title: '身份证号有误', icon: 'none' })
            return
    }  else {
        let gender = ''
        this.state.sex==='f'?gender='女' :gender='男'
        addperson({
            name: this.state.name,
            sex: gender,
            idCode: '01',
            idNo: this.state.idCard,
            mobile:this.state.mobile,
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
            placeholder='请与证件保持一致'
                    onChange={(value) => { this.setState({ idCard: value })
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