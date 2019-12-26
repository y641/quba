import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSteps, AtButton, AtDivider } from 'taro-ui'
import './me.scss'

export default class Me extends Component{
  config = {
    navigationBarTitleText:'我的'
    }
    state = {
        getinfo: null,
        current:0
    }
  componentWillMount() {
   this.getCode()
    }
    getCode = () => {
        my.getAuthCode({
            scopes: 'auth_user',
            success: (res) => {
                this.mebme(res.authCode)
            }
        });
    }
    //小程序授权
    mebme = (code) => {
        Taro.request({
            url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/alipay/getauthbuyerid',
            header: {
                'Content-Type': 'application/json',
                'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
            },
            method: 'POST',
            data: {
                "hotelGroupCode": "EDBG",
                "hotelCode": "EDB1",
                authCode: code
            },
            dataType: 'json',
            success: (res) => {
                console.log(res, '小程序授权')
                if (res.data && res.data.resultCode === 0) {
                    this.getUserInfo(res.data.resultInfo.accessToken)
                }
            }
        })
    }
    //获取用户信息
    getUserInfo = (token) => {
        Taro.request({
            url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/alipay/getuserinfobyaccesstoken ',
            header: {
                'Content-Type': 'application/json',
                'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
            },
            method: 'POST',
            data: {
                "hotelGroupCode": "EDBG",
                "hotelCode": "EDB1",
                accessToken: token
            },
            dataType: 'json',
            success: (res) => {
                console.log(res, '获取用户信息')
                this.setState({getinfo:res.data.resultInfo})
            }
        })
    }
    render() {
        const items = [
            { 'title': '信息录入' },
            { 'title': '押金支付' },
            { 'title': '办理入住'},
            { 'title': '已入住'},
            { 'title': '已退房'},
        ]
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
                    current={this.state.current}
                    onChange={()=>{}}
                />
            </View>
            <View className='at-row at-row__justify--around' style='background:#fff;margin-top:20px;padding:10px 0 10px 5px'>
                <View className='at-col at-col-5' style='padding-top:6px'>
                    个人信息
                </View>
                <View className='at-col at-col-5'>
                    <AtButton type='secondary' size='small'>预约退房</AtButton>
                </View>
            </View>
            <View  style='background:#fff;'>
                <AtDivider style='height:0rem'/>
            </View>
            <View className='at-article' style='background:#fff;padding-top:10px' >
                <View className='at-article'>
                    <Text className='at-article__p'>江雪琴</Text>
                    <Text style='border:1px solid #eee;height:10px;width:2px'></Text>
                    <Text className='at-article__p'>15222568965</Text>
                </View>
                <View className='at-article__p' >身份信息：341221199656523659</View>
                <View className='at-article__p'>入住日期：2019-3-8  15:00</View>
                <View className='at-article__p'>离店日期：2019-3-9  12:00</View>
                <View className='at-article__p' >入住房型：豪华大床房</View>
                <View className='at-article__p'>房号：<Text className='at-article__p' style='color:bule'>1003</Text></View>
            </View>
           
      </View>
    )
  }
}