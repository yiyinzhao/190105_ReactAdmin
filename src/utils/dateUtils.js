/*包含 n 个日期时间处理的工具函数模块
*/
/*格式化日期
*/
export function formateDate(time) {
if (!time) return ''
let date = new Date(time)
return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
+ ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}