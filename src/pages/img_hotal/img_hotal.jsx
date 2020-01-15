import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Img } from '../utils/utils'
import { AtTag } from 'taro-ui'
import './img_hotal.scss'
import "taro-ui/dist/style/components/flex.scss"


function getNowTime() {
    // 加0
    function add_10(num) {
        if (num < 10) {
            num = '0' + num
        }
        return num;
    }
    var myDate = new Date();
    myDate.getYear(); //获取当前年份(2位)
    myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    myDate.getMonth(); //获取当前月份(0-11,0代表1月)
    myDate.getDate(); //获取当前日(1-31)
    myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
    myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
    myDate.getHours(); //获取当前小时数(0-23)
    myDate.getMinutes(); //获取当前分钟数(0-59)
    myDate.getSeconds(); //获取当前秒数(0-59)
    myDate.getMilliseconds(); //获取当前毫秒数(0-999)
    myDate.toLocaleDateString(); //获取当前日期
    var nowTime = myDate.getFullYear() + '-' + add_10(myDate.getMonth()) + '-' + myDate.getDate() + ' ' + add_10(myDate.getHours()) + ':' + add_10(myDate.getMinutes()) + ':' + add_10(myDate.getSeconds());
    return nowTime;
}
export default class imgHotal extends Component {
    config = {
        navigationBarTitleText: '酒店介绍',
    }
    state = { Img: null, titleImg: null, active: true, selected: '', roomTypeDescript: '', complete: true,currentIndex:-1 }
    componentWillMount() {
        Img({ arr: getNowTime() }, (res) => {
            if (res.data.resultCode === 0) {
                res.data.resultInfo.forEach((item => {
                    if (item.imageMaps[0] && item.imageMaps[0].id) {
                        item.imgSrc = "https://openapidev.ipms.cn/igroup/edbg/filedownload?id=" + item.imageMaps[0].id + '&x-authorization=331bf2cb743368b4a0d01e0ac8b26332'
                    }
                    this.setState({ Img: res.data.resultInfo }, () => { console.log(this.state.Img, '获取图片') })
                }))
            }
        })

    }
    onClick = (imgSrc, roomTypeDescript, index) => {
        this.setState({ selected: imgSrc, roomTypeDescript, complete: false,currentIndex:index })
    }
    doClick = (name) => {
        this.setState({ complete: true,currentIndex:-1 })
    }
    render() {
        return (
            <View>
                <AtTag
                    name='tag-1'
                    type='primary'
                    circle
                    active={this.state.currentIndex===-1}
                    onClick={this.doClick}
                >
                    全部
                </AtTag>
                {this.state.Img ? this.state.Img && this.state.Img.map((item, index) => {
                    return (
                        <AtTag
                            name={index + ''}
                            type='primary'
                            circle
                            active={index===this.state.currentIndex}
                            onClick={this.onClick.bind(this, item.imgSrc, item.roomTypeDescript,index)}
                        >
                            {item.roomTypeDescript}
                        </AtTag>
                    )
                }) : null}
                {this.state.complete ? this.state.Img.map((item, index) => {
                    return (
                        <View>
                            <Text style='padding:10px 20px;font-size:20px'>{item.roomTypeDescript}</Text>
                            <View style='padding:5px'>
                                <Image style='width:50%' src={item.imgSrc}></Image>
                            </View>
                        </View>
                    )
                })
                    : <View>
                        <Text style='padding:10px 20px;font-size:20px'>{this.state.roomTypeDescript}</Text>
                        <View style='padding:5px'>
                            <Image style='width:100%' src={this.state.selected}></Image>
                        </View>
                    </View>}
            </View>
        )
    }
}