/*
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是一个Promise对象

1.优化：统一处理请求异常
在外层抱一个自己创建的 promise对象
在请求出错时，不用reject(error),而是提示错误信息，用antd里面的message功能
2.优化：异步得到的不是response，而是response.data
在请求成功resolve时，resolve(response.data)
*/
import axios from 'axios'
import {message}from 'antd'

export default function ajax(url,data={},type='GET'){
    return new Promise ((resolve,reject)=>{
        let promise
        //1.执行异步ajax请求
        if(type==="GET"){//发送get请求
           promise=axios.get(url,{
                params:data//指定参数
            })
        }else{//发生post请求
            promise=axios.post(url,data)
        }
        //2.如果成功了，调用resolve（value）
        promise.then(response=>{
            resolve(response.data)
        //3.如果失败了，不调用reject（reason）,而是提示异常信息    
        }).catch(error=>{
            //这里不写reject(error),而是给提示信息
            message.error('request is failed!!'+error.message)
        })
    
        
    })
    
}