/*
要求：能根据接口文档定义接口请求
包含应用中所有接口侵权函数的模块
每个函数的返回值都是Promise对象

*/

import ajax from './ajax'

//cost BASE='http://localhost:5000'//不能写死
const BASE=""//指当前项目的地址

//login登录
/* export function reqLogin(username,password){
    return ajax('./Login',{username,password},'POST')
}*/
export const reqLogin=(username,password)=>ajax(BASE+'/login',{username,password},'POST')

//add users添加用户
export const reqAddUser=(user)=>ajax(BASE+'/manage/user/add',user,'POST')