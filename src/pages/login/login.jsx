import React, { Component } from 'react'
import './login.less'
import './login.css'
import logo from './images/logo.png'
import { Form, Icon, Input, Button } from 'antd'
//import { FormProvider } from 'antd/lib/form/context'

const Item=Form.Item//不能写在import前面

/*登陆的路由组件 */
class Login extends Component {
    handleSubmit=(event)=>{
      //阻止事件的默认行为 
      event.preventDefault()
      //对所有form对象字段进行验证
      this.props.form.validateFields((err, values) => {
        //检验成功 
        if (!err) {
          console.log('提交登录的ajax请求，Received values of form: ', values);
        }else{
          console.log('校验失败')
        }
      });
      //得到form对象
      // const form=this.props.form
        //const values=form.getFieldsValue()
        //console.log("handleSubmit",values) 
    }

    /*
    对密码进行自定义验证
    */
   validatePwd=(rule,value,callback)=>{
     console.log('validatePwd()',rule,value)
     if(!value){
       callback('must enter password')
     }else if(value.length<4){
       callback('password must more than 4 number')
     }else if(value.length>12){
       callback('password must be less than 12 number')
     }else if (!/^[a-zA-Z0-9_]+$/.test(value)){
       callback('username must includes letter,number and "_"!')
     }else{
       callback()//验证通过 
     }
   }
   
    render() {
      //具有 强大功能的form对象 
        const form=this.props.form
        const { getFieldDecorator } =form
     return (
        <div className="login">
            <header className="login-header">
             <img src={logo} alt="logo"/>
             <h1>React Project: Admin Management System</h1>
            </header>
            <section className="login-content">
             <h2>Login</h2> 
             <Form onSubmit={this.handleSubmit} className="login-form">
                <Item>
              { /*
                  用户名/密码的的合法性要求

                    1). 必须输入
                  2). 必须大于等于 4 位
                  3). 必须小于等于 12 位
                  4). 必须是英文、数字或下划线组成
              */}
                {getFieldDecorator('username', {
                  //声明式验证：直接使用别人定义好的验证规则进行验证
                  rules: [{ required: true, message: 'Please input your username!' },
                          { min: 4, message: 'minimum 4 digit number' },
                          { max: 12, message: 'maximum 12 digit number' },
                          { pattern: /^[a-zA-Z0-9_]+$/, message: 'username must includes letter,number and "_"!' },
                ],
                initialValue:"admin"//指定初始值
                })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="Username"
                    />,
                  )}
                </Item>
                <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{ 
                      validator:this.validatePwd
                    }],

                  })(
                    <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="Password"
                    />,
                  )}
                </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      Log in
                    </Button>
                  </Form.Item>
               </Form>                  
          </section>                
      </div>
    )
    }
  }

  
/*
1.高阶函数
 1)一类特别的函数 
    a.接受函数类型的参数 
    b.返回值是函数 
  2.常见的高阶函数：
    a.定时器 ：setTimeout()/setInterval()  
    b.Promise: Promise(()=>()) then(value=>{},reason=>{})
    c.数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
    d.函数对象的bind()
    e.Form.create()() / getFieldDecorator()()
  3.高阶函数更新动态，更具有扩展性  

2.高阶组件
1).本质是一个函数 
2）接收一个组件（被包装组件），返回一新的组件（包装组件），包装组件会向被包装组件传入特定属性
3）作用：扩展组件功能
4）高阶组件也是一个高阶函数：接收一个组件函数，返回的是一个组件函数


*/

/*
包装Form组件生成一个新的组件:Form(Login)
新组件会向Form组件传递一个强大的对象属性 :form
*/
const WrapLogin=Form.create()(Login)
export default WrapLogin

