import Taro, { Component, chooseInvoiceTitle } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Img } from '../utils/utils'
import { AtTag } from 'taro-ui'
import './img_hotal.scss'


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
export default class Index extends Component {
    config = {
        navigationBarTitleText: '酒店介绍',
    }
    state = { Img: null, titleImg: null, active: false, selected:0}
    componentWillMount() {
        Img({ arr: getNowTime() }, (res) => {
            console.log(res)
            let id = res.data.resultInfo[0].imageMaps[0].id
            console.log(id,'id')
            this.getImg(id)
            this.setState({ Img: res.data.resultInfo })
        })
        
    }
    getImg = (imgId) => {
        Taro.request({
            header: {
                'Content-Type': 'application/json',
                'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
            },
            url: 'https://openapidev.ipms.cn/igroup/edbg/filedownload',
            method:'GET',
            dataType: 'JSON',
            data: {
                id: imgId
           },
            success: res => {
                console.log(res,'图片')
            }
        })
    }
    onClick = (name, active) => {
        console.log(name)
        this.setState({ selected: name.name });
    }
    render() {
        if (this.state.Img) {
            const img = this.state.Img.map(element => {
                return element.roomTypeDescript
            });

        }
        return (
            <View>
                {this.state.Img ? this.state.Img.map((item,index) => {
                    if (index === 0) {
                        return (
                            <AtTag
                                name='tag-1'
                                type='primary'
                                circle
                                onClick={this.onClick}
                            >
                                全部
                            </AtTag>
                        )
                    }
                    return (
                            <AtTag
                                name={index}
                                type='primary'
                            circle
                            active={this.state.active}
                                onClick={this.onClick}
                            >
                                {item.roomTypeDescript}
                            </AtTag>
                    )
                }) : null}
                <View> {this.state.selected}</View>
            </View>
        )
    }
}