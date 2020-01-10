import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import './paymentPage.scss'
import { gettardeno, getorderstr } from '../utils/utils'
import { getInfo, regtion} from '../utils/AppData'
export default class paymentPage extends Component {
    config = {
        navigationBarTitleText: '绿云收银台',
         'usingComponents': {
            'unify-pay': 'plugin://myPlugin/UnifyPay'
        }
    }
    state = {
        appid: '',
        getinfo:null //订单信息
    }
    componentWillMount() {
        console.log(getInfo, regtion,'哈哈')
        console.log(this.$router.params.appid, 'pay页面')
        var getinfo = JSON.parse(this.$router.params.getinfo)
        this.setState({ appid: this.$router.params.appid,getinfo})
    }
    getOrder(e) {
        if (e.preFreeze) {
            getorderstr({
                masterId: this.state.getinfo[0].id,
                subject: this.state.getinfo[0].rmtype,
                // totalFee: this.state.money.nonPay,
                totalFee: 0.01,
                isPreFreeze: 'T',
                buyerId: this.state.appid
            }, (res) => {
                if (res.data && res.data.resultCode === 0) {
                    this.orderStr(res.data.resultInfo)
                } else {
                    Taro.showToast({ title: '请求失败', icon: 'none' })
                }
            })
        } else {
            this.TradeNo()
        }
    }

    orderStr = (order) => {
        my.tradePay({
            orderStr: order,
            success: (res) => {
                if (res.result && res.memo === "") {
                    
                }
            },
            fail: () => {
                Taro.showToast({
                    title: '请求失败',
                    icon: 'none'
                })
                return
            }
        });
    }

    TradeNo = () => {
        gettardeno({
            masterId: this.state.getinfo[0].id,
            subject: this.state.getinfo[0].rmtype,
            totalFee: 0.01,
            // totalFee: this.state.money.nonPay,
            buyerId: this.state.appid
        }, (res) => {
            if (res.data && res.data.resultCode === 0) {
                this.success(res.data.resultInfo)
            } else {
                Taro.showToast({ title: '请求失败', icon: 'none' })
            }
        })
    }
    //唤起收银台
    success = (trade) => {
        my.tradePay({
            tradeNO: trade,
            success: (res) => {
                if (res.result && res.memo === "") {
                    order.status = 1
                    this.list()
                }
            },
            fail: () => {
                Taro.showToast({
                    title: '请求失败',
                    icon: 'none'
                })
                return
            }
        });
    }
    onTimeUp() {
        Taro.showToast({
            title: '时间到',
            icon: 'success',
            duration: 2000
        })
    }
    render() {
        return (
            <View style='border-top:1px solid #ddd'>
                <View style='padding:30px 100px 30px 100px;background:#fff'>
                    <Text>订单总价:</Text>
                    <Text style='color:#000;fontweight:800'>￥3000</Text>
                    <AtCountdown
                        format={{minutes: ':', seconds: '' }}
                        minutes={10}
                        onTimeUp={this.onTimeUp.bind(this)}
                    />
                </View>
                <View style='border-bottom:1px solid #ddd'></View>
                <View style='padding:20px 120px 20px 120px;background:#fff'>
                    <View>还需支付</View>
                    <View style='color:red;fontweight:800;padding-top:5px'>￥3000</View>
                </View>
                <View style="margin:20px 10px 0 10px;">
                        <unify-pay
                            userId={this.state.appid}
                            serviceId='2019122400000000000003655000'
                            onClick={this.getOrder}
                        />
                    </View>
            </View>
        )
    }
}