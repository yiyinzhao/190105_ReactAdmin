import React,{Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon} from 'antd'
import './index.less'
import './index.css'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'

const SubMenu  = Menu.SubMenu

/*左侧导航的组件
*/
class LeftNav extends Component{

    /*
    判断
    */
    hasAuth=(item)=>{
        const {key,isPublic}=item
        const menus=memoryUtils.user.role.menus
        const username=memoryUtils.user.username
        /*1.如果当前用户是admin
          2.如果当然item是公开的：isPublic：true
          3.当前用户有此item的权限：key有没有在menus中
        */
       if (username==='admin'||isPublic || menus.indexOf(key)!==-1){
           return true
       }else if (item.children){//4.如果当前用户有此item的某个子item的权限
           return !! item.children.find(child=>menus.indexOf(child.key)!==-1) //!!是用来强制转换成布尔值
       }
       return false
    }
    
    /* 根据menu的数据数组生成对应的标签数组
        使用map()+递归调用*/
    getMenuNodes_map=(menuList)=>{
        return menuList.map(item=>{
            /*
            {
                title: '首页', // 菜单标题名称
                key: '/home', // 对应的 path
                icon: 'home', // 图标名称
                children:[], //可能有，也可能没有
            }
            会返回：
            <Menu.Item key="home">
                        <Link to ='/home'>
                            <Icon type="pie-chart" />
                            <span>Home</span>
                        </Link>
            </Menu.Item>
            
            <SubMenu
                        key="sub1"
                        title={
                        <span>
                            <Icon type="mail" />
                            <span>Products</span>
                        </span> 
                       }
                    >
                        <Menu.Item />
                        <Menu.Item />
             </SubMenu>           
            */
           if (!item.children){
               return(
                <Menu.Item key={item.key}>
                <Link to ={item.key}>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                </Link>
                </Menu.Item>
               )
           }else{
               return(
                <SubMenu key={item.key}
                title={
                <span>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                </span> 
               }
            >
                {this.getMenuNodes(item.children)}
                </SubMenu>           
               )
           }
        })
    }

     /* 根据menu的数据数组生成对应的标签数组
        使用reduce()+递归调用*/
    getMenuNodes=(menuList)=>{
        //得到当前请求的路由路径
        const path=this.props.location.pathname
        return menuList.reduce((pre,item)=>{
            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)){
                 //向pre中添加<Menu.Item>
            if(!item.children){
                pre.push((
                <Menu.Item key={item.key}>
                <Link to ={item.key}>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                </Link>
                </Menu.Item>))
            }else{
                //查找一个与当前选中路径匹配的子item
                const cItem=item.children.find(cItem=>path.indexOf(cItem.key===0))
                //如果存在，说明当前item的子列表需要打开
                if(cItem){
                this.openKey=item.key
                }
                //向pre中添加<SubMenu>
                pre.push((
                    <SubMenu key={item.key}
                title={
                <span>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                </span> 
               }
            >
                {this.getMenuNodes(item.children)}
                </SubMenu> 
                ))
            }
            }
            return pre
        },[])
    }
    /*在第一次render()之前执行一次
    为第一个render()准备数据（必须同步的）
    */
    componentWillMount(){
        this.menuNodes=this.getMenuNodes(menuList)
    }
    render(){
        const menuNodes= this.getMenuNodes(menuList)
        //得到当前请求的路由路径
        let path=this.props.location.pathname
        if(path.indexOf('/product')===0){ //判断当前请求的是商品还是其子路由
            path='/product'
        }
        //得到需要打开菜单项的key
        const openKey=this.openKey
        return(
            
            <div to='/' className="left-nav">
                <Link to='/'   className='left-nav-header'>
                    <img src={logo} alt="logo" />
                    <h1>Admin Management</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    >

                {
                    this.menuNodes
                }
          
        </Menu>
             
            
            </div>

            
        )
    }
}

/*
withRouter高阶组件
包装非路由组件返回一个新组件
新的组件向非路由组件传递3给属性：history,location,match
*/
export default withRouter(LeftNav)