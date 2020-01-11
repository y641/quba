import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSegmentedControl, AtButton, AtInput, AtForm } from 'taro-ui'
import { SplitMember, searchroom, shotgunhouse } from '../utils/utils'
import './mate.scss'

export default class Mate extends Component {
    config = {
        navigationBarTitleText: '信息匹配',
    }
    state = {
        status: 0,
        mate: '',
        phone: '',
        info: null,
        idcard: '',
        sex: '',
        appid: '',
        rsvNo:''  //纯预留编号
    }
    componentWillMount() {
        let info = JSON.parse(this.$router.params.info)
        Taro.setStorage({ key: 'rsvNo', data: info.rsvNo })
        this.setState({ appid: this.$router.params.appid, info, idcard: this.$router.params.idcard, sex: this.$router.params.sex })
    }
    handleClick = (value) => {
        this.setState({
            status: value
        })
    }
    handleChange = (value) => {
        this.setState({ mate: value })
    }
    doChange = (value) => {
        this.setState({ phone: value })
    }
    handle = () => {
        let gender = ''
        if (this.state.sex === 'f') {
            gender = '女'
        } else {
            gender = "男"
        }
        let mobile = this.state.info.mobile.substring(7)
        if (mobile === this.state.phone || this.state.rsvNo === this.state.mate) {
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
                        this.setState({ item: res.data.resultInfo })
                        this.checkRoom(res.data.resultInfo.rmno, res.data.resultInfo.rmtype, res.data.resultInfo.arr, res.data.resultInfo.dep, res.data.resultInfo.id)
                    } else {
                        Taro.navigateTo({
                            url: `/pages/registration/registration?info=${JSON.stringify(this.state.item)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1`
                        })
                    }
                })
            } else {
                Taro.getStorage({ key: 'info' }).then(res => Taro.navigateTo({
                    url: `/pages/registration/registration?info=${JSON.stringify(res.data)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1`
                }))
            }
        } else {
            Taro.showToast({
                title: '输入错误',
                icon: 'none'
            })
        }
    }
   

    checkRoom = (rmno,roomType, startArr,endDep,id) => {
        // 查询可用房间
        if (rmno === '') {
            searchroom({
                rmtype: roomType,
                arr: startArr,
                dep: endDep
            }, (res) => {
                console.log(res, '查询可用房间')
                if (res.data && res.data.resultInfo.length > 0) { // 有可用房号
                    Taro.setStorage({ key: 'rmnoCode', data: res.data.resultInfo[0].rmno })
                    this.assignRoom(res.data.resultInfo[0].rmno, id)
                } else if (res.data.resultInfo.length === 0) {
                    Taro.navigateTo({ url: '/pages/without/without' })
                }
            })
        } else {
            Taro.navigateTo({ url: `/pages/registration/registration?info=${JSON.stringify(this.state.item)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1&&rmno=${this.state.rmno}` })
        }
    }
    assignRoom = (rmno, id) => {
        shotgunhouse({
            masterId: id,
            rmno
        }, (res) => {
            console.log(res, '排房')
            if (res.data && res.data.resultCode === 0) { // 排房成功
                console.log(res, '排房成功')
                this.setState({ item: { ...this.state.item, rmno: '***' } })
                Taro.navigateTo({ url: `/pages/registration/registration?info=${JSON.stringify(this.state.item)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1&rmno=${rmno}` })
            } else {
                Taro.showToast({
                    title: '排房失败',
                    icon: 'none'
                })
                return
            }
        })
    }
   
    render() {
        Taro.getStorage({ key: 'rsvNo' }).then(res => this.setState({ rsvNo:res.data}))
        return (
            <View style='padding-top:20px'>
                    <AtSegmentedControl
                    values={['手机号码','预订单号']}
                        onClick={this.handleClick}
                        current={this.state.status}
                />
                {
                    this.state.status === 0
                        ? <View className='tab-content'>
                            <AtForm>
                                <AtInput
                                    style='height:300px'
                                    name={this.state.phone}
                                    type='phone'
                                    placeholder='请输入预订手机号后4位'
                                    value={this.state.phone}
                                    onChange={this.doChange}
                                />
                            </AtForm>
                        </View>
                        : null
                }
                    {
                        this.state.status === 1 
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
                   
                <View style='margin:80px 20px 0 20px'>
                    <AtButton type='primary' onClick={this.handle}>确认匹配</AtButton>
                </View>
            </View>
        )
    }
}