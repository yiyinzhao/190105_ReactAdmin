import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd'
import LinkButton from '../link-button'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import './index.less'
import './index.css'

 class Header extends Component {
    state={
        currentTime:formateDate(Date.now()),//当前时间字符串格式
    }

    getTime=()=>{
        //每格一秒获取当前时间，并更新状态数据
       this.intervalId= setInterval(()=>{
            const currentTime=formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getTitle=()=>{
        const path=this.props.location.pathname
        let title
        menuList.forEach(item=>{
            if (item.key===path){//如果当前item对象的key与path一致，item的title就是要显示的title
                title=item.title
            }else if(item.children){
                //在所有的子item中查找匹配的
                const cItem = item.children.find(cItem=>path.indexOf(cItem.key)===0)
                //如果有值才说明有匹配的
                if(cItem){
                    //取出他的title作为显示的title
                    title=cItem.title
                }
            }
        })
        return title
    }
    
    //退出登录
    logout=()=>{
        //显示确认框
        Modal.confirm({
            content: 'Do you Want to log out?',
            onOk: ()=> {
              //console.log('OK');
              //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user={}
               

            //跳转到login界面
              this.props.history.replace('/login')
            },
            
          })

    }
    /*
    第一次render（）之后执行一次
    一般在此执行异步操作：发ajax请求、启动定时器
    */
   componentDidMount(){
        this.getTime()
   }

   //当前组件卸载之前调用
   componentWillUnmount(){
    //清除定时器
       clearInterval(this.intervalId)

   }
    render() {
        const {currentTime}=this.state
        const username=memoryUtils.user.username
        //得到当前需要显示的title
        const title=this.getTitle()
        return (
            <div className="header">
                <div className='header-top'>
                    <span>Welcome ,{username}</span>
                    <LinkButton onClick={this.logout}>Log out</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src="http://www.bom.gov.au/images/symbols/large/rain.png" alt="weather" />
                        <span>Rain</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)