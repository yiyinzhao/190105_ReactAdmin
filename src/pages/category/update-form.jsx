import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 
{Form,
Select,
Input,
 }from 'antd'
import { get } from 'store'


const Item=Form.Item
const Option=Select.Option 
/*更新分类的form组件*/

class UpdateForm extends Component {
    static propTypes={
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }

    componentWillMount(){
        //将form对象通过setForm（）传递给父组件
        this.props.setForm(this.props.form)
}    

    render() {
        const {categoryName}=this.props
        const {getFieldDecorator}=this.props.form
        return (
          <Form>
              <Item>  
              {
                      getFieldDecorator('categoryName',{
                          initialValue:categoryName,
                          rules:[
                              {required:true,message:'must entry Category Name'}                            
                            ]
                      })(
                        <Input placeholder='please enter Category Name'/>
                      )
                  }
              
              </Item>
          </Form>
        )
    }
}

export default Form.create()(UpdateForm)
