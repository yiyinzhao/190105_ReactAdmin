import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 
{Form,
Select,
Input,
 }from 'antd'
import { get } from 'store'
import Category from './category'


const Item=Form.Item
const Option=Select.Option 
/*添加分类的form组件*/

class AddForm extends Component {
    static propTypes={
        setForm:PropTypes.func.isRequired,//用来传递form对象的函数        
        categorys: PropTypes.array.isRequired,//接收一级分类列表
        parentId:PropTypes.string.isRequired//接收父分类id
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        const {categorys,parentId}=this.props
        const {getFieldDecorator}=this.props.form
        return (
          <Form>
              <Item>
                  {
                      getFieldDecorator('parentId',{
                          initialValue:parentId
                      })(
                        <Select>
                        <Option value='0'>Primary Class</Option>
                        {
                            categorys.map(c=><Option value={c._id}>{c.name}</Option>)
                        }
                        </Select>
                      )
                  }
                    
              </Item>

              <Item>  
              {
                      getFieldDecorator('categoryName',{
                          initialValue:'',
                          rules:[
                            {required:true,message:'must entry Category Name'}                            
                          ]
                      })(
                        <Input placeholder='please enter Catergory Name'/>
                      )
                  }
              
              </Item>
          </Form>
        )
    }
}

export default Form.create()(AddForm)
