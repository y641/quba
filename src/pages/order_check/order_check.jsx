import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import { AtSteps, AtCard, AtButton, AtDivider } from 'taro-ui'
import './order_check.scss'
import { rmnoRoom } from '../utils/AppData'
import { SplitMember, noPassByMobile, noPassByName, searchroom, shotgunhouse } from '../utils/utils'

export default class Order extends Component {
    config = {
        navigationBarTitleText: '订单核对',
    }
    state = {
        current: 0,
        icon: '#ff0',
        checkcircle: '#f0f',
        iconcheck: true,
        getinfo: null, //订单信息
        appid: null,  //userid
        mobile: '', //手机号
        username: '', //真实姓名
        idcard: '', //身份证号码
        list: null,
        info: null,
        sex: '',
        item: null,
        currentIndex: '-1',
        resultInfo: null,
        rmno: ''
    }
    componentWillMount() {
        let list = [...JSON.parse(this.$router.params.info)]
        this.setState({ order: list, appid: this.$router.params.appid, mobile: this.$router.params.mobile, username: this.$router.params.username, idcard: this.$router.params.idcard, sex: this.$router.params.sex })
    }
    choose = () => {
        if (this.state.currentIndex >= 0) {
            Taro.navigateTo({ url: `/pages/mate/mate?info=${JSON.stringify(this.state.item)}&appid=${this.state.appid}&mobile=${this.state.mobile}&username=${this.state.username}&num=1&sex=${this.state.sex}&idcard=${this.state.idcard}` })
        } else {
            Taro.showToast({
                title: '请选择',
                icon: 'none'
            })
        }
    }
    textContent = (item, index) => {
        this.setState({ item, currentIndex: index })
    }
    checkRoom = (rmno, id) => {
        // 查询可用房间
        if (rmno === '') {
            searchroom({
                rmtype: this.state.item.rmtype,
                arr: this.state.item.arr,
                dep: this.state.item.dep
            }, (res) => {
                if (res.data && res.data.resultInfo.length > 0) { // 有可用房号
                    let roomType = res.data.resultInfo[0].rmno
                    Taro.setStorage({ key: 'rmnoCode', data: res.data.resultInfo[0].rmno })
                    rmnoRoom.rmnoCode = roomType
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
            if (res.data && res.data.resultCode === 0) { // 排房成功
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
    handle = () => {
        if (this.state.currentIndex >= 0) {
            if (this.state.item.rsvSrcId) {
                console.log('3')
                let gender = ''
                this.state.sex === 'f' ? gender = '女' : gender = '男'
                //拆分订单
                SplitMember({
                    mobile: this.state.item.mobile,
                    rsvSrcId: this.state.item.rsvSrcId,
                    name: this.state.item.rsvMan,
                    idNo: this.state.idcard,
                    sex: gender,
                    idCode: '01'
                }, (res) => {
                    if (res.data && res.data.resultCode === 0) {
                        this.setState({ item: res.data.resultInfo })
                        this.checkRoom(res.data.resultInfo.rmno, res.data.resultInfo.id)
                    } else {
                        Taro.navigateTo({ url: `/pages/registration/registration?info=${JSON.stringify(this.state.item)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1` })
                    }
                })
            } else {
                Taro.navigateTo({ url: `/pages/registration/registration?info=${JSON.stringify(this.state.item)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1` })
            }
        } else {
            Taro.showToast({
                title: '请选择',
                icon: 'none'
            })
        }
    }

    list = (typeRoom, arrBuffer, depBuffer) => {
        //查询可用房间
        searchroom({
            rmtype: typeRoom,
            arr: arrBuffer,
            dep: depBuffer
        }, (res) => {
            if (res.data && res.data.resultInfo.length > 0) {
            } else if (res.data.resultInfo.length === 0) {
                Taro.navigateTo({ url: '/pages/without/without' })
            } else {
                Taro.showToast({ title: '请求失败', icon: 'none' })
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
            <View className='order_check'>
                {/* 步骤条 */}
                <AtSteps
                    items={items}
                    current={this.state.current}
                    onChange={() => { }}
                />
                {/* 预定信息 */}
                {this.state.order ? this.state.order.map((item, index) => {
                    return (
                        <View style='background:#fff' onClick={this.textContent.bind(this, item, index)} style='position:relative;'>
                            <View style='padding:0.2rem 0 0 0.2rem'>{index === 0 ? '请选择预订信息' : null}</View>
                            <AtDivider />
                            <View style='margin-top:0rem'>
                                <Text className='at-article__p'>{noPassByName(item.rsvMan)}</Text>
                                <Text className='at-article__p'>{noPassByMobile(item.mobile)}</Text>
                            </View>
                            <Text style='position:absolute;top:80px;left:287px'>
                                <icon type="success" size='30' color={index === this.state.currentIndex ? '#6190E8' : '#ddd'} />
                            </Text>
                            <View>
                                <Text className='at-article__p'>抵离日期：{this.state.order ? item.arr.slice(0, 10) : null}~{this.state.order ? item.dep.slice(0, 10) : null}</Text>
                            </View>
                            <View>
                                <Text className='at-article__p'>入住房型：{item.rmtype}</Text>
                            </View>
                            <View>
                                <Text className='at-article__p'>房间数量：共1间</Text>
                            </View>
                            <View>
                                <Text className='at-article__p'>预订渠道：飞猪</Text>
                            </View>
                            {index >= 1 ? <AtDivider /> : null}
                        </View>
                    )
                }) : null}
                {this.state.order && this.state.order.length === 1 ? <View className='at-article'>
                    <AtButton type='primary' onClick={this.handle}>确认选择</AtButton>
                </View> : <View className='at-article'>
                        <AtButton type='primary' onClick={this.choose}>确认选择</AtButton>
                    </View>}
            </View>
        )
    }
}