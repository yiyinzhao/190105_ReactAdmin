import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 
{Form,
Select,
Input,
 }from 'antd'
import { get } from 'store'




const Item=Form.Item
 
/*添加分类的form组件*/

class AddForm extends Component {
    static propTypes={
        setForm:PropTypes.func.isRequired,//用来传递form对象的函数        
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
          //指定role布局的配置对象
          const formItemLayout = {
            labelCol: { span: 5 },//左侧label的宽度
            wrapperCol: { span: 15 },//指定右侧包裹的宽度
          };

        const {getFieldDecorator}=this.props.form
        return (
          <Form>
              <Item label='Role Name' {...formItemLayout}>  
              {
                      getFieldDecorator('roleName',{
                          initialValue:'',
                          rules:[
                            {required:true,message:'must entry Role Name'}                            
                          ]
                      })(
                        <Input placeholder='please enter Role Name'/>
                      )
                  }
              
              </Item>
          </Form>
        )
    }
}

export default Form.create()(AddForm)
