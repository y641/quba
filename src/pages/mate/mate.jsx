import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSegmentedControl, AtButton, AtInput, AtForm } from 'taro-ui'
import { SplitMember } from '../utils/utils'

export default class Mate extends Component {
    config = {
        navigationBarTitleText: '信息匹配',
    }
    state = {
        cuurent: 0,
        mate: '',
        phone: '',
        info: null,
        idcard: '',
        sex: '',
        appid:''
    }
    componentWillMount() {
        let info = JSON.parse(this.$router.params.info)
        console.log(info)
        this.setState({appid:this.$router.params.appid, info, idcard: this.$router.params.idcard, sex: this.$router.params.sex })
    }
    handleClick = (value) => {
        this.setState({
            current: value
        })
    }
    handleChange = (value) => {
        this.setState({ mate: value })
    }
    doChange = (value) => {
        this.setState({ phone: value })
    }
    doClick = () => {
        if (this.state.info.rsvNo === this.state.mate) {
            let gender = ''
            if (this.state.sex === 'f') {
                gender = '女'
            } else {
                gender = "男"
            }
            //拆分成员单
            if (this.state.info.rsvSrcId) {
                SplitMember({
                    mobile: this.state.info.mobile,
                    rsvSrcId: this.state.info.rsvSrcId,
                    name: this.state.info.rsvMan,
                    idNo: this.state.idcard,
                    sex: gender,
                    idCode: '01',
                }, (res) => {
                        if (res.data && res.data.resultCode === 0) {
                            Taro.navigateTo({
                                url: `/pages/registration/registration?info=${JSON.stringify(res.data.resultInfo)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1`
                            })
                        } else {
                            Taro.showToast({title:'请求失败',icon:'none'})
                        }
                   
                })
            } else {
                Taro.navigateTo({
                    url: `/pages/registration/registration?info=${JSON.stringify(this.state.info)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1`
                })
            }
           

        } else {
            Taro.showToast({
                title: '预订单号输入错误',
                icon: 'none'
            })
        }
    }
    handle = () => {
        let gender = ''
        if (this.state.sex === 'f') {
            gender = '女'
        } else {
            gender = "男"
        }
        let mobile = this.state.info.mobile.substring(7)
        if (mobile === this.state.phone) {
            if (this.state.info.rsvSrcId) {
                SplitMember({
                    mobile: this.state.info.mobile,
                    rsvSrcId: this.state.info.rsvSrcId,
                    name: this.state.info.rsvMan,
                    idNo: this.state.info.idNo,
                    sex: gender,
                    idCode: '01',
                }, (res) => {
                        if (res.data && res.data.resultCode === 0) {
                            Taro.navigateTo({
                                url: `/pages/registration/registration?info=${JSON.stringify(res.data.resultInfo)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1`
                            })
                        } else {
                            Taro.showToast({ title: '请求失败', icon: 'none' })  
                   }
                })
            } else {
                Taro.navigateTo({
                    url: `/pages/registration/registration?info=${JSON.stringify(this.state.info)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1`
                })
            }
        } else {
            Taro.showToast({
                title: '输入错误',
                icon: 'none'
            })
        }
    }
    render() {
        return (
            <View style='padding-top:20px'>
                <View>
                    <AtSegmentedControl
                        values={['预订单号', '手机号码']}
                        onClick={this.handleClick}
                        current={this.state.current}
                    />
                    {
                        this.state.current === 0 
                            ? <View className='tab-content'>
                                <AtForm>
                                    <AtInput
                                        style='height:300px'
                                        name={this.state.mate}
                                        type='number'
                                        placeholder='请输入预订确认号'
                                        value={this.state.mate}
                                        onChange={this.handleChange}
                                    />
                                </AtForm>
                            </View>
                            : null
                    }
                    {
                        this.state.current === 1
                            ? <View className='tab-content'>
                                <AtForm>
                                    <AtInput
                                        style='height:300px'
                                        name={this.state.phone}
                                        type='phone'
                                        placeholder='预订手机后4位'
                                        value={this.state.phone}
                                        onChange={this.doChange}
                                    />
                                </AtForm>
                            </View>
                            : null
                    }
                </View>
                {this.state.current === 0 ? <View style='margin:100px 20px 0 20px'>
                    <AtButton type='primary' onClick={this.doClick}>确认匹配</AtButton>
                </View> : <View style='margin:100px 20px 0 20px'>
                        <AtButton type='primary' onClick={this.handle}>确认匹配</AtButton>
                    </View>}
            </View>
        )
    }
}