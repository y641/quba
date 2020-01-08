import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSteps, AtButton, AtDivider } from 'taro-ui'
import {
    inquiry,
    findname,
    findphone,
    findsubscribecard,
    findsubscribename,
    findsubscribephone
} from '../utils/utils'
import './me.scss'
import {get} from '../utils/AppData'

export default class Me extends Component {
    config = {
        navigationBarTitleText: '我的'
    }
    state = {
        getinfo: null,
        orderinfo: null
    }
    componentWillMount() {
        if (get.getInfo) {
            this.setState({ getinfo: get.getInfo })
            this.inquiryMembe(get.getInfo.certNo)
        } else {
            console.log('等待中')
        }
    }
    //身份证号查询成员单
    inquiryMembe = (certNo) => {
        inquiry({ idCode: '01', idNo: certNo }, (res) => {
            if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length === 0) {
                //按照姓名查询成员单
                this.inquiryName()
            } else {
                //查到
                this.setState({ orderinfo: res.data.resultInfo })
            }
        }, () => { Taro.showToast({ title: '请求失败', icon: 'none' }) })
    }
    //姓名查询成员单
    inquiryName = () => {
        findname({ name: this.state.getinfo.userName }, (res) => {
            if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length === 0) {
                //按照手机号查询成员单，没有查询到 按照身份证号查询预订单
                this.inquiryPhone()
            } else {
                //查到
                this.setState({ orderinfo: res.data.resultInfo })
            }
        }, () => { Taro.showToast({ title: '请求失败', icon: 'none' }) })
    }
    //手机号查询成员单
    inquiryPhone = () => {
        findphone({ mobile: this.state.getinfo.mobile }, (res) => {
            if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length === 0) {
                this.inquiryPredetermined()
            } else {
                //查到
                this.setState({ orderinfo: res.data.resultInfo })
            }
        })
    }

    //身份证查询预订单
    inquiryPredetermined = () => {
        findsubscribecard({
            idCode: '01',
            idNo: this.state.getinfo.certNo
        }, (res) => {
            if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length > 0) {
                //查到
                this.setState({ orderinfo: res.data.resultInfo })
            } else {
                //按照姓名查询预定单
                this.inquiryUserName()
            }
        })
    }
    //姓名查询预订单
    inquiryUserName = () => {
        findsubscribename(
            { rsvMan: this.state.getinfo.userName },
            (res) => {
                if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length > 0) {
                    //查到
                    this.setState({ orderinfo: res.data.resultInfo })
                } else {
                    //按照手机号查询预订单
                    this.inquiryMobile()
                }
            }
        )
    }

    //手机号查询预订单
    inquiryMobile = () => {
        findsubscribephone({ mobile: this.state.getinfo.mobile }, (res) => {
            if (res.data && res.data.resultInfo.length > 0) {
                //查到
                this.setState({ orderinfo: res.data.resultInfo })
            }
        })
    }
    retreatRoom = () => {
        Taro.showModal({
            title: '预约退房',
            cancelText:'取消'
        })
            .then(res => {
                if (res.confirm) {
                   Taro.navigateTo({url:'/pages/checkout/checkout'}) 
                }
            })
    }
    render() {
        const items = [
            { 'title': '信息录入' },
            { 'title': '押金支付' },
            { 'title': '已入住' },
            { 'title': '已退房' },
        ]
        const { getinfo } = this.state
        return (
            <View>
                <View className='at-row at-row__align--center' style='background:#fff;margin-top:10px'>
                    <View className='at-article'>
                        <Image style='vertical-align: middle;text-align:center' src={this.state.getinfo.avatar} style='width:70px; height:70px;border-radius:50%;margin:10px 0 10px 20px' />
                    </View>
                    <View className='at-article__h2' style='margin-top:0;margin-left:10px'>
                        {this.state.getinfo.nickName}
                        <View className='at-article__info'>(请凭二维码或身份证至自助机自助取房卡)</View>
                    </View>
                </View>
                <View style='background:#fff;margin-top:10px;padding:10px 0'>
                    <AtSteps
                        items={items}
                        current={ this.state.orderinfo && this.state.orderinfo[0].sta === 'I' ? 2 : 0}
                        onChange={this.doChange}
                    />
                </View>
                {this.state.orderinfo ? this.state.orderinfo.map((item, index) => {
                        return <View>
                            {index === 0 ? <View className='at-row at-row__justify--around' style='background:#fff;margin-top:20px;padding:10px 0 10px 5px'>
                                <View className='at-col at-col-5' style='padding-top:6px'>
                                    个人信息
                                </View>
                                <View className='at-col at-col-5' onClick={this.retreatRoom}>
                                    <AtButton type='secondary' size='small'>预约退房</AtButton>
                                </View>
                            </View> :null}
                            <View style='background:#fff;'>
                                <AtDivider style='height:0rem' />
                            </View>
                            <View className='at-article' style='background:#fff;padding-top:10px' >
                                <View className='at-article'>
                                    <Text className='at-article__p'>{item.name || item.rsvMan}</Text>
                                    <Text style='border:1px solid #eee;height:10px;width:2px'></Text>
                                    <Text className='at-article__p'>{getinfo.mobile}</Text>
                                </View>
                                <View className='at-article__p' >身份信息：{getinfo.certNo}</View>
                                <View className='at-article__p'>入住日期：{item.arr}</View>
                                <View className='at-article__p'>离店日期：{item.dep}</View>
                                <View className='at-article__p' >入住房型：{item.rmtype}</View>
                                <View className='at-article__p'>房号：<Text className='at-article__p' style='color:bule'>{item.ratecode}</Text></View>
                            </View>
                        </View>
                }) : null}
            </View>
        )
    }
}