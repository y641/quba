import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
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
        getinfo: null, //订单信息,
        payMoney:''
    }
    componentWillMount() {
        var getinfo = JSON.parse(this.$router.params.getinfo)
        this.setState({ appid: this.$router.params.appid, getinfo, payMoney:this.$router.params.money})
    }
    getOrder(e) {
        if (e.preFreeze) {
            getorderstr({
                masterId: this.state.getinfo[0].id,
                subject: this.state.getinfo[0].rmtype,
                // totalFee: this.state.payMoney,
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
                    this.success()
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
            totalFee:0.01,
            // totalFee: this.state.payMoney,
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
                    Taro.navigateTo({ url:'/pages/success/success'})
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
                    <Text style='color:#000;fontweight:800'>￥{this.state.payMoney ? this.state.payMoney :null}</Text>
                </View>
                <View style='border-bottom:1px solid #ddd'></View>
                <View style='padding:20px 120px 20px 120px;background:#fff'>
                    <View>还需支付</View>
                    <View style='color:red;fontweight:800;padding-top:5px'>￥{this.state.payMoney ? this.state.payMoney : null}</View>
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