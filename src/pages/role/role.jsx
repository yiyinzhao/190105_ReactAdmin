import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'

import {PAGE_SIZE} from '../../utils/constants'
import { reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'

/*
角色路由
*/
export default class Role extends Component {
    state={
        roles:[],//所有角色的列表
        role:{},//选中的role
        isShowAdd:false,//是否显示添加界面
        isShowAuth:false,//是否显示设置权限界面
    }    

    constructor (props){
        super(props)
        
        this.auth=React.createRef()
    }



    initColumn=()=>{
        this.columns=[
            {
                title:'Role',
                dataIndex:'name',
            },
            {
                title:'Create Time',
                dataIndex:'create_time',
                render:(create_time)=>formateDate(create_time)
            },
            {
                title:'Authority Time',
                dataIndex:'auth_time',
                render:(auth_time)=>formateDate(auth_time)// 或直接写成：render:formateDate
            },
            {
                title:'Authorizer',
                dataIndex:'auth_name',
            }
        ]
    }
    
    getRoles=async()=>{
        const result=await reqRoles()
        if(result.status===0){
            const roles=result.data
            this.setState({
                roles
            })
        }
    }

    onRow=(role)=>{
        return{
            onClick: event => { // 点击行
                console.log('row onClick()',role)
                this.setState({role})
            },
        }
    }
    
    /*添加角色*/
    addRole=()=>{
        //最先进行表达验证，只有通过了才继续
        this.form.validateFields(async(error,values)=>{
            if(!error){
                //隐藏确认框
                this.setState({isShowAdd:false})

                 //1.收集输入数据
                 const {roleName}=values
                 this.form.resetFields()//清除输入内容
        

                //2.发请求添加
                const result=await reqAddRole(roleName)
                if(result.status===0){
                    //3. 根据结果提示/更新显示
                    message.success('New role is added successfully!')
                    //this.getRoles()//重新取一遍更新后的role列表,可以用这种方法，也可以用以下方法
                    const role=result.data
                    //更新role状态
                    /*const roles=this.state.roles
                    const roles=[...this.state.roles]
                    roles.push(role)
                    this.setState({roles}) */

                    //更新roles状态：基于原本状态数据更新
                    this.setState(state=>({
                        roles:[...state.roles,role]
                    }))
                }else{
                    message.error('Failed to add new role!')
                    }
                }
              
        })
    }

    /*更新角色的回调函数*/
    updateRole=async()=>{
        
        //隐藏确认框
        this.setState({
        isShowAuth:false})
        
        const role=this.state.role
        //得到最新的menus
        const menus= this.auth.current.getMenus()
        role.menus=menus
        role.auth_time=Date.now()
        role.auth_name=memoryUtils.user.username

        //请求更新
        const result=await reqUpdateRole(role)
        if(result.status===0){
            //this.getRoles()
            //如果当前更新的是自己角色的权限，强制退出
            if (role._id===memoryUtils.user.role_id){
                memoryUtils.user={}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('Authorization has been updated, please log in again!')
            }else{
                message.success('Authorization has benn updated successfully!')
                this.setState({
                    roles:[...this.state.roles]
                })
            }

        }else{
            message.error('Failed to upate the role!')
        }

    }




    componentWillMount(){
        this.initColumn()
    }

    componentDidMount(){
        this.getRoles()
    }

    render() {
        const {roles,role,isShowAdd,isShowAuth}=this.state
        const title=(
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>Create New Role</Button> &nbsp; &nbsp;
                <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>Setup Authorization</Button>
            </span>
        )

        return (
           <Card title={title}>
               <Table
                bordered 
                rowKey='_id'
                dataSource={roles} 
                columns={this.columns}
                pagination={{defaultPageSize:PAGE_SIZE}}
                rowSelection={{
                    type:'radio', 
                    selectedRowKeys:[role._id],
                    onSelect:(role)=>{//选择某个radio的时候回调
                        this.setState({
                            role
                    })
            }
            }}
                onRow={this.onRow}
                />   

                <Modal
                    title="Add New Role"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=>{this.setState({
                        isShowAdd:false
                         })
                        this.form.resetFields()}}
                    >
                    <AddForm 
                    setForm={(form)=>{this.form=form}}/>
                </Modal>

                <Modal
                    title="Setup Authorization"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={()=>{this.setState({
                        isShowAuth:false
                         })
                        }}
                    >
                    <AuthForm ref={this.auth} role={role}/>
                </Modal>
           </Card>
        )
    }

}
