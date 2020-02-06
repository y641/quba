import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import './index.scss'
import {
    info,
    getuserinfo,
    inquiry,
    findname,
    findphone,
    findsubscribecard,
    findsubscribename,
    findsubscribephone
} from '../utils/utils'

export default class Index extends Component {
    config = {
        navigationBarTitleText: '绿云大酒店',
    }
    state = {
        hasBorder: false,
        appid: null,
        getinfo: null,  //用户信息
    }
    componentWillMount() {
        this.getCode()
    }
    getCode = () => {
        my.getAuthCode({
            scopes: 'auth_user',
            success: (res) => {
                Taro.showLoading({ title: '加载中' })
                this.mebme(res.authCode)
            },
            fail: () => {
                my.alert({
                    content: '请先进行授权',
                    success: () => {
                        this.getCode()
                    }
                })

            }
        });
    }
    mebme = (code) => {
        info({ authCode: code },
            (res) => {
                if (res.data && res.data.resultCode === 0) {
                    Taro.hideLoading()
                    Taro.setStorage({ key: 'buyerId', data: res.data.resultInfo.buyerId })
                    this.getinfo(res.data.resultInfo.accessToken)
                    this.setState({ appid: res.data.resultInfo.buyerId })
                }
            }, () => {
                Taro.hideLoading()
                my.alert({ content: '请求失败' })
            })
    }

    // 获取用户信息
    getinfo = (token) => {
        getuserinfo(
            { accessToken: token },
            (res) => {
                if (res.data && res.data.resultCode === 0) {
                    Taro.setStorage({ key: 'getInfo', data: res.data.resultInfo })
                    this.setState({ getinfo: res.data.resultInfo })
                    Taro.hideLoading()
                } else {
                    Taro.hideLoading()
                    Taro.showToast({
                        title: '获取信息失败',
                        icon: 'none'
                    })
                }
            },
            () => {
                Taro.hideLoading()
                my.alert({ content: '请求失败' })
            }
        )
    }

    //身份证号查询成员单
    inquiryMembe = () => {
        inquiry({ idCode: '01', idNo: this.state.getinfo.certNo }, (res) => {
            if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length === 0) {
                //按照姓名查询成员单
                this.inquiryName()
            } else if (res.data && res.data.resultInfo.length > 0 && res.data.resultInfo[0].sta === 'I') {
                Taro.hideLoading()
                console.log(res,'订单查询')
                Taro.navigateTo({ url: `/pages/check_success/check_success?checksuccess=${JSON.stringify(res.data.resultInfo)}` })
            } else {
                Taro.hideLoading()
                Taro.navigateTo({ url: `/pages/order_check/order_check?info=${JSON.stringify(res.data.resultInfo)}&appid=${this.state.appid}&mobile=${this.state.getinfo.mobile}&username=${this.state.getinfo.userName}&idcard=${this.state.getinfo.certNo}&sex=${this.state.getinfo.gender}` })
            }
        }, () => {
            Taro.hideLoading()
            my.alert({ content: '请求失败' })
        })
    }
    //姓名查询成员单
    inquiryName = () => {
        findname({ name: this.state.getinfo.userName }, (res) => {
            if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length === 0) {
                //按照手机号查询成员单，没有查询到 按照身份证号查询预订单
                this.inquiryPhone()
            } else {
                Taro.hideLoading()
                Taro.navigateTo({ url: `/pages/order_check/order_check?info=${JSON.stringify(res.data.resultInfo)}&appid=${this.state.appid}&mobile=${this.state.getinfo.mobile}&username=${this.state.getinfo.userName}&idcard=${this.state.getinfo.certNo}&sex=${this.state.getinfo.sex}` })
            }
        }, () => {
            Taro.hideLoading()
            my.alert({ content: '请求失败' })
        })
    }
    //手机号查询成员单
    inquiryPhone = () => {
        findphone({ mobile: this.state.getinfo.mobile }, (res) => {
            if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length === 0) {
                this.inquiryPredetermined()
            } else {
                Taro.hideLoading()
                Taro.navigateTo({ url: `/pages/order_check/order_check?info=${JSON.stringify(res.data.resultInfo)}&appid=${this.state.appid}&mobile=${this.state.getinfo.mobile}&username=${this.state.getinfo.userName}&idcard=${this.state.getinfo.certNo}&sex=${this.state.getinfo.sex}` })
            }
        }, () => {
            Taro.hideLoading()
            my.alert({ content: '请求失败' })
        })
    }

    //身份证查询预订单
    inquiryPredetermined = () => {
        findsubscribecard({
            idCode: '01',
            idNo: this.state.getinfo.certNo
        }, (res) => {
            if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length > 0) {
                //按照身份证查询到预定单 ,查询到预订单
                console.log(res,'====')
                Taro.hideLoading()
                Taro.navigateTo({ url: `/pages/order_check/order_check?info=${JSON.stringify(res.data.resultInfo)}&appid=${this.state.appid}&username=${this.state.getinfo.userName}&idcard=${this.state.getinfo.certNo}&sex=${this.state.getinfo.gender}` })
            } else {
                //按照姓名查询预定单
                this.inquiryUserName()
            }
        }, () => {
            Taro.hideLoading()
            my.alert({ content: '请求失败' })
        })
    }
    //姓名查询预订单
    inquiryUserName = () => {
        findsubscribename(
            { rsvMan: this.state.getinfo.userName },
            (res) => {
                if (res.data && res.data.resultCode === 0 && res.data.resultInfo.length > 0) {
                    Taro.hideLoading()
                    Taro.navigateTo({ url: `/pages/order_check/order_check?info=${JSON.stringify(res.data.resultInfo)}&appid=${this.state.appid}&username=${this.state.getinfo.userName}&idcard=${this.state.getinfo.certNo}&sex=${this.state.getinfo.gender}` })
                } else {
                    //按照手机号查询预订单
                    this.inquiryMobile()
                }
            }, () => {
                Taro.hideLoading()
                my.alert({ content: '请求失败' })
            }
        )
    }

    //手机号查询预订单
    inquiryMobile = () => {
        findsubscribephone({ mobile: this.state.getinfo.mobile }, (res) => {
            if (res.data && res.data.resultInfo.length > 0) {
                Taro.hideLoading()
                Taro.navigateTo({ url: `/pages/order_check/order_check?info=${JSON.stringify(res.data.resultInfo)}&appid=${this.state.appid}&username=${this.state.getinfo.userName}&idcard=${this.state.getinfo.certNo}&sex=${this.state.getinfo.sex}` })
            } else if (res.data && res.data.resultInfo.length === 0) {
                Taro.hideLoading()
                my.alert({ content: '没有查询到您的订单' })
            }
        }, () => {
            Taro.hideLoading()
            my.alert({ content: '请求失败' })
        })
    }
    doClick = () => {
        Taro.showLoading({
            title: '匹配中'
        })
        this.inquiryMembe()
    }
    componentDidHide() {
        Taro.hideLoading()
        this.getCode()
    }
    render() {
        return (
            <View className='choose_check'>
                {/* 轮播图 */}
                <View style='position:relative'>
                    <Swiper
                        className="swiper-container"
                        circular
                        indicatorDots
                        indicatorColor='#999'
                        indicatorActiveColor='#bf708f'
                        autoplay>
                        <SwiperItem>
                            <Image className="swiper-img" mode="widthFix" src={require('../../img/4.jpg')}></Image>
                        </SwiperItem>
                        <SwiperItem>
                            <Image className="swiper-img" mode="widthFix" src={require('../../img/5.jpg')}></Image>
                        </SwiperItem>
                        <SwiperItem>
                            <Image className="swiper-img" mode="widthFix" src={require('../../img/6.jpg')}></Image>
                        </SwiperItem>
                        <SwiperItem>
                            <Image className="swiper-img" mode="widthFix" src={require('../../img/7.jpg')}></Image>
                        </SwiperItem>
                        <SwiperItem>
                            <Image className="swiper-img" mode="widthFix" src={require('../../img/8.jpg')}></Image>
                        </SwiperItem>
                        <SwiperItem>
                            <Image className="swiper-img" mode="widthFix" src={require('../../img/9.jpg')}></Image>
                        </SwiperItem>
                    </Swiper>
                    <View style='position:absolute;bottom:1%;left:80%' onClick={() => {
                        Taro.navigateTo({url:'/pages/img_hotal/img_hotal'})
                    }}>
                        <Image style='width:25px;height:25px;vertical-align:middle;text-align:center' src={require('../../img/img002.png')}></Image>
                        <Text style='margin-left:3px;color:#fff;vertical-align:middle;text-align:center'>更多</Text>
                    </View>
              </View>

                <View style='padding:0 5%;' onClick={this.doClick}>
                    <View className='at-row at-row__justify--between' style='background:#fff;margin:20% 0 5% 0;border:1px solid #eee;border-radius:5px'>
                        <View className='at-col at-col-5'>
                            <View className='at-article__p'
                                style="color:#000;font-size:20px;margin:20% 0 0  20%">散客入住</View>
                            <View className='at-article__p' style='margin:0.1rem 0.6rem 0;font-size:18px;'>FIT</View>
                            </View>
                        <View className='at-col at-col-5' style='margin-left:5%'>
                            <Image mode="widthFix" style='width:75%;' src={require('../../img/img_01.png')}></Image>
                        </View>
                    </View>
                </View>
                <View style='padding:0 5%;'>
                    <View className='at-row at-row__justify--between' style='background:#fff;border:1px solid #eee;border-radius:5px'>
                        <View className='at-col at-col-5'>
                            <View className='at-article__p'
                                style="color:#000;font-size:20px;margin:20% 0 0  20%">团队入住</View>
                            <View className='at-article__p' style='margin:0.1rem 0.6rem 0;font-size:18px;'>GROUP</View>
                        </View>
                        <View className='at-col at-col-5'>
                            <Image mode="widthFix" style='width:100%;' src={require('../../img/img_02.png')}></Image>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
