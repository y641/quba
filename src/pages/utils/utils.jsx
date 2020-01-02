import Taro, { Component } from '@tarojs/taro'
const head = {
    header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
    },
     method: 'POST',
    dataType: 'json',
}
const url ='https://openapidev.ipms.cn/igroup/edbg/'
const dataConfig = {
    "hotelGroupCode": "EDBG",
    "hotelCode": "EDB1",
}
//拆分成员单
export function SplitMember(params, success, fail) {
    Taro.request({
        url: url+'openapi/v1/order/src/split/one',
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
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
}
//小程序授权
export function info(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/alipay/getauthbuyerid',
        ...head,
        data: {
            ...dataConfig,
            authCode: params.authCode
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
}

//获取用户信息
export function getuserinfo(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/alipay/getuserinfobyaccesstoken',
        ...head,
        data: {
            ...dataConfig,
            accessToken:params.accessToken
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
}

//身份证查询成员单
export function inquiry(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/list',
        ...head,
        data: {
            ...dataConfig,
            idCode: params.idCode,
            idNo: params.idNo
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
}

//姓名查询成员单
export function findname(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/list',
        ...head,
        data: {
            ...dataConfig,
            name:params.name
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//手机号查询成员单
export function findphone(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/list',
        ...head,
        data: {
            ...dataConfig,
            mobile:params.mobile
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//身份证查询预订单
export function findsubscribecard(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/src/only/list',
        ...head,
        data: {
            ...dataConfig,
            idCode: params.idCode,
            idNo: params.idNo
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//姓名查询预订单
export function findsubscribename(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/src/only/list',
        ...head,
        data: {
            ...dataConfig,
            rsvMan: params.rsvMan
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//手机号查询预订单
export function findsubscribephone(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/src/only/list',
        ...head,
        data: {
            ...dataConfig,
            mobile: params.mobile
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

export function getmoney(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/rmfee/nonpay',
        ...head,
        data: {
            ...dataConfig,
            masterId: params.masterId
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//查询可用房间
export function searchroom(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/avail/rmno/list',
        ...head,
        data: {
            ...dataConfig,
            rmtype: params.rmtype,
            arr: params.arr,
            dep:params.dep
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//添加同住人
export function addperson(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/src/masteradd',
        ...head,
        data: {
            ...dataConfig,
            name: params.name,
            sex:params.sex,
            idCode: params.idCode,
            idNo:params.idNo,
            masterId:params.masterId
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 


//获取orderstr

export function getorderstr(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/alipay/getunifypay',
        ...head,
        data: {
            ...dataConfig,
            masterId: params.masterId,
            subject: params.subject,
            totalFee: params.totalFee,
            isPreFreeze: params.isPreFreeze,
            buyerId: params.buyerId
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 


//获取tardeNo
export function gettardeno(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/alipay/gettradeno',
        ...head,
        data: {
            ...dataConfig,
            masterId: params.masterId,
            subject: params.subject,
            totalFee: params.totalFee,
            isPreFreeze: params.isPreFreeze,
            buyerId: params.buyerId
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//成员单排房
export function shotgunhouse(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/rmno/assign',
        ...head,
        data: {
            ...dataConfig,
            masterId: params.masterId,
            rmno: params.rmno
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//成员登记单入住
export function checkperson(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/checkin',
        ...head,
        data: {
            ...dataConfig,
            masterId: params.masterId,
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
}


