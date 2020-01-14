import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSteps, AtCard, AtButton, AtDivider } from 'taro-ui'
import './success.scss'
import { shotgunhouse, checkperson, noPassByMobile, noPassByName } from '../utils/utils'
import { order, getInfo, regtion } from '../utils/AppData'

export default class success extends Component {

    config = {
        navigationBarTitleText: '登记确认'
    }
    state = {
        current: 2,
        getinfo: null,
        money: null,
        rmno: '',
        newid: null
    }
    componentWillMount() {
        console.log(getInfo, regtion, 'success')
        if (getInfo.newid) {
            this.setState({ getinfo: getInfo.list, newid: getInfo.newid }, () => { this.checkin()})
        } else {
            this.setState({ getinfo: regtion.regtionOrder }, () => { this.checkin()})
        }
    }
    // 成员单登记入住
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
                <View style='background:#fff;margin-bottom:5px'>
                    <AtSteps
                        items={items}
                        current={this.state.current}
                        onChange={this.onChange}
                    />
                </View>
                <View style='padding:40px 0;background:#fff'>
                    <View className='at-row at-row__justify--center' style='padding-bottom:10px'>
                        <View className='at-col at-col-5  at-col__offset-2' style='font-size:24px'>登记成功</View>
                    </View>
                    <View className='at-row at-row__justify--center'>
                        <View className='at-col at-col-5' style='font-size:16px'>请去线下自助机拿房卡入住</View>
                    </View>
               </View>
                <View className='at-row at-row__justify--between at-article'>
                    <View className='at-col at-col-5 at-article__p' style='padding:5px 0px'>登记信息</View>
                    <View className='at-col at-col-5 at-article__p' style='border:1px solid rgb(97, 144, 232);padding:5px 0px 5px 35px;border-radius:5px;color:rgb(97, 144, 232);background:#fff' onClick={() => {
                        Taro.navigateTo({ url: `/pages/add/add?id=${this.state.getinfo[0].id}`})
                    }}>
                        添加入住人
                    </View>
                </View>
                <AtDivider />
                {/* 入住人信息 */}
                {this.state.getinfo ? this.state.getinfo.map((item, index) => {
                    if (index === 0) {
                        var idcard = item.idNo.replace(/^(.{4})(?:\d+)(.{4})$/, "$1******$2")
                    } else {
                        var card = item.idcard.replace(/^(.{4})(?:\d+)(.{4})$/, "$1******$2")
                    }
                    return  <View className='at-article' style='background:#fff;padding:10px 0px'>
                    <Text className='at-article__p'>{noPassByName(item.name)}</Text>
                    <Text className='at-article__info' style='border-left:1px solid #ddd'></Text>
                    <Text className='at-article__p'>{noPassByMobile(item.mobile)}</Text>
                    <View className='at-article__p'>证件号码：{index === 0 ? idcard : card}</View>
                </View>
                }) : null}
                <View style='margin:30px 20px 0 20px'>
                    <AtButton type='secondary' onClick={() => {
                        Taro.navigateBack({ delta: 100 })
                    }}>返回首页</AtButton>
                </View>
            </View>
        )
    }
}
