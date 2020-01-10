import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtList, AtListItem, AtCard, AtDivider } from 'taro-ui'
import { get } from '../utils/AppData'
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
                Taro.showLoading({ title: '获取信息中...' })
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
                    Taro.hideLoading()
                    get.getInfo = res.data.resultInfo
                    Taro.setStorage({ key: 'getInfo', data: res.data.resultInfo}).then(res=>{console.log(res)})
                    this.setState({ getinfo: res.data.resultInfo })

                } else {
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
    render() {
        return (
            <View className='choose_check'>
                {/* 轮播图 */}
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
                {/* 散客入住 */}
                <View style='height:60px;background:#fff;border:1px solid #eee;border-radius:5px;margin:50px 30px 0 30px;padding:20px 0 10px 20px;position:reletive;' onClick={this.doClick}>
                    <View className='at-article__p'
                        style="margin:0;color:#000;font-size:20px;padding-bottom:5px">散客入住</View>
                    <View className='at-article__p' style='margin:0;'>FIT</View>
                    <Image style='position:absolute;bottom:188px;left:226px;height:60px;width:110px' mode="widthFix" src={require('../../img/img_01.png')}></Image>
                </View>
                {/* 团队入住 */}
                <View style='height:60px;background:#fff;border:1px solid #eee;border-radius:5px;margin:10px 30px 0 30px;padding:20px 0 10px 20px;position:reletive;'>
                    <View className='at-article__p'
                        style="margin:0;color:#000;font-size:20px;padding-bottom:5px">团队入住</View>
                    <View className='at-article__p' style='margin:0;'>GROUP</View>
                    <Image style='position:absolute;bottom:87px;left:226px;height:80px;width:110px' mode="widthFix" src={require('../../img/img_02.png')}></Image>
                </View>
            </View>
        )
    }
}
