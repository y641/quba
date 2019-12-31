import Taro, { Component } from '@tarojs/taro'
const head = {
    header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
    },
     method: 'POST',
    dataType: 'json',
}

const dataConfig = {
    "hotelGroupCode": "EDBG",
    "hotelCode": "EDB1",
}
//拆分成员单
export function SplitMember(params, success, fail) {
    Taro.request({
        url: 'https://openapidev.ipms.cn/igroup/edbg/openapi/v1/order/src/split/one',
       ...head,
        data: {
           ...dataConfig,
            mobile: params.mobile,
            rsvSrcId: params.rsvSrcId,
            name: params.name,
            idNo: params.idNo,
            sex: params.sex,
            idCode: params.idCode,
        },
       
        success: res => {
            if (res) {
                success(res)
            }
        }
    })
}