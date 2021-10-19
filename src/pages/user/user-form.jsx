import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import 
{Form,
Select,
Input,
 }from 'antd'
import { get } from 'store'




const Item=Form.Item
const Option=Select.Option
 
/*添加/修改用户的form组件*/

class UserForm extends PureComponent {
    static propTypes={
        setForm:PropTypes.func.isRequired,//用来传递form对象的函数        
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
          const {roles}=this.props
          const user= this.props.user || {}
          //指定role布局的配置对象
          const formItemLayout = {
            labelCol: { span: 5 },//左侧label的宽度
            wrapperCol: { span: 15 },//指定右侧包裹的宽度
          };

        const {getFieldDecorator}=this.props.form
        return (
          
          <Form  {...formItemLayout}>
              <Item label='User Name'>  
              {
                      getFieldDecorator('username',{
                          initialValue: user.username
                      })(
                        <Input placeholder='please enter User Name'/>
                      )
                  }            
              </Item>

              {
                user._id ? null: (
                  <Item label='Password'>  
                   {
                      getFieldDecorator('password',{
                          initialValue:user.password,
                      })(
                        <Input type='password' placeholder='please enter password'/>
                      )
                   }              
                  </Item>
                )
              }
              
              <Item label='Mobile'>  
              {
                      getFieldDecorator('phone',{
                          initialValue:user.phone,
                      })(
                        <Input placeholder='please enter Mobile Number'/>
                      )
                  }
              
              </Item>
              <Item label='Email'>  
              {
                      getFieldDecorator('email',{
                          initialValue:user.email,
                      })(
                        <Input placeholder='please enter User Email Address'/>
                      )
                  }
              
              </Item>
              <Item label='Role'>  
              {
                      getFieldDecorator('role_id',{
                          initialValue:user.role_id,
                      })(
                        <Select>
                          {
                            roles.map(role=><Option key={role._id} value={role._id}>{role.name}</Option>)
                          }
                          
                        </Select>  
                        
                      )
                  }
              
              </Item>
          </Form>
        )
    }
}

export default Form.create()(UserForm)
