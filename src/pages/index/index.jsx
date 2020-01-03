import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtList, AtListItem, AtCard, AtDivider } from 'taro-ui'
import {get} from '../utils/AppData'
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
                Taro.showLoading({title:'获取信息中...'})
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
            })
    }

    //获取用户信息

    getinfo = (token) => {
        getuserinfo(
            { accessToken: token },
            (res) => {
                if (res.data && res.data.resultCode === 0) {
                    Taro.hideLoading()
                    get.getInfo = res.data.resultInfo
                    this.setState({ getinfo: res.data.resultInfo })
                    
                } else {
                    Taro.showToast({
                        title: '获取信息失败',
                        icon: 'none'
                    })
                }
            }, 
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
        },()=>{Taro.showToast({title:'请求失败',icon:'none'})}) 
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
        }, () => { Taro.showToast({ title: '请求失败', icon: 'none' }) })
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
        }, () => { Taro.showToast({ title: '请求失败', icon: 'none' }) })
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
        }, () => { Taro.showToast({ title: '请求失败', icon: 'none' }) })
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
            }, () => { Taro.showToast({ title: '请求失败', icon: 'none' }) }
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
                Taro.navigateTo({url:'/pages/not_found/not_found'})
            }
        }, () => { Taro.showToast({ title: '请求失败', icon: 'none' }) })
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
                        <Image className="swiper-img" mode="widthFix" src={require('../../img/1.jpg')}></Image>
                    </SwiperItem>
                    <SwiperItem>
                        <Image className="swiper-img" mode="widthFix" src={require('../../img/2.jpg')}></Image>
                    </SwiperItem>
                    <SwiperItem>
                        <Image className="swiper-img" mode="widthFix" src={require('../../img/3.jpg')}></Image>
                    </SwiperItem>
                </Swiper>
                {/* 卡片 */}
                <AtCard>
                    <AtList hasBorder={this.state.hasBorder}>
                        <AtListItem title='散客入住' note='FIT' loading onClick={this.doClick} />
                        <AtListItem
                            note='GROUP'
                            title='团队入住'
                            hasBorder={this.state.hasBorder}
                        />
                    </AtList>
                </AtCard>
                <AtDivider content='客房介绍' fontColor='#000' lineColor='#000' />
            </View>
        )
    }
}
