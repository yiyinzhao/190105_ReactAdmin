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

//获取一级、二级分类的列表
export const reqCategorys=(parentId)=>ajax(BASE+'/manage/category/list',{parentId},'GET')
//添加分类
export const reqAddCategory=(parentId,categoryName)=>ajax(BASE+'/manage/category/add',{parentId,categoryName},'POST')
//更新分类
export const reqUpdateCategory=({categoryId,categoryName})=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')
//获取商品分页列表
export const reqProducts=(pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize},'GET')
//获取一个分类
export const reqCategory=(categoryId)=>ajax(BASE+'/manage/category/info',{categoryId})
//更新商品的上架、下架操作
export const reqUpdateStatus=(productId,status)=>ajax(BASE+'manage/product/updateStatus',{productId,status},'POST')
//删除指定名称的图片
export const reqDeleteImg=(name)=>ajax(BASE+'/manage/img/delete',{name}, 'POST')
//添加或修改商品
export const reqAddOrUpdateProduct=(product)=>ajax(BASE+'/manage/product/'+ (product._id? 'update' : 'add'), product,'POST')
//获取所有角色的列表
export const reqRoles=()=>ajax(BASE+'/manage/role/list')
//添加角色
export const reqAddRole=(roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST')
//获取最新的role的信息
export const reqUpdateRole=(role)=>ajax(BASE+'/manage/role/update',role,'POST')//role 是对象，就要去掉花括号{}
//获取所有用户（user）列表
export const reqUsers=()=>ajax(BASE+'/manage/user/list')//
//删除指定用户
export const reqDeleteUser=(userId)=>ajax(BASE+'/manage/user/delete',{userId},'POST')
//添加/更新用户
export const reqAddOrUpdateUser=(user)=>ajax(BASE+'/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')


/*搜索商品分页列表(根据商品名称/商品描述)
searchType: 搜索类型，productName/productDesc
*/
export const reqSearchProducts=({pageNum,pageSize,searchName,searchType})=>ajax(BASE+'/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName,
})