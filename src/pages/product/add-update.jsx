import React, { Component } from 'react'
import {
    Card,
    Form,
    Input,
    Icon,
    Cascader,
    Upload,
    Button,
    message
}from 'antd'

import RichTextEditor from './rich-text-editor'
import PicturesWall from './pictures-wall'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'

const {Item}=Form
const { TextArea } = Input


/* Product 的添加和更新子路由组件 */
class ProductAddUpdate extends Component {

    state = {
        options:[],
      };

    constructor (props){
        super(props)
        //创建用来保存ref标识的标签对象的容器对象,把这个对象保存到组件对象上的某一个变量上的某一个属性上
        this.pw = React.createRef()
        this.editor=React.createRef()
    }
      



    initOptions=async(categorys)=>{
        //根据categorys数组生产options数组
        const options= categorys.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false //不是叶子
        }))
        //如果是一个二级分类商品的更新
        const {isUpdate,product}=this
        const {pCategoryId,categoryId}=product
        if( isUpdate && pCategoryId!=='0'){
            //说明这是一个二级分类商品的类型
            //获取对应的二级分类列表
            const subCategorys=await this.getCategorys(pCategoryId)
            //生产二级下拉列表的options
            const childOptions=subCategorys.map((c)=>({
                value: c._id,
                label: c.name,
                isLeaf: true 
            }))
            //找到当前商品对应的一级option对象
            const targetOption=options.find(option=>option.value===pCategoryId)
            //关联到对应的一级option上去
            targetOption.children=childOptions
        }

        //更新options的状态
        this.setState({options})
    }

    /*异步获取一级，二级分类列表，并显示  
    async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
    */
    getCategorys=async(parentId)=>{
       const result= await reqCategorys(parentId) //{status:0, data:categorys}
      // debugger
       if(result.status===0){
            const categorys=result.data
            if(parentId==='0'){//如果是一级分类的话,就获取一级分类列表
              this.initOptions(categorys)  
            }else{//二级列表
                return categorys //返回二级列表=》当前async函数返回的promise就会成功且value为categorys

                
            }
            
       }
    }  

    /*
    验证价格的自定义验证函数
    */
    validatePrice=(rule,value,callback)=>{
        console.log(value,typeof value)
        if(value*1 > 0){
            callback() //验证通过
        }else{
            callback('price must be more than 0') //验证没通过
        }   
    }

    /*
    用于加载下一级列表的回调函数
    */
    loadData = async selectedOptions => {
        //得到选择的option对象
        const targetOption = selectedOptions[0]
        //显示loading
        targetOption.loading = true
        //根据选中的分类，请求二级分类列表
        const subCategorys=await this.getCategorys(targetOption.value)
        //隐藏loading
        targetOption.loading = false
        //二级分类列表有数据
        if(subCategorys && subCategorys.length>0){
            //生成一个二级列表的options
            const childOptions=subCategorys.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true 
            }))
            //关联到当前option上
            targetOption.children=childOptions
        }else{//当前选中的没有二级分类
            targetOption.isLeaf=true
        }
            //更新options状态
          this.setState({
            options: [...this.state.options],
          });
        }
      


    submit=()=>{
        //进行表单验证，如果通过了，才发送请求
        this.props.form.validateFields(async(error,values)=>{
            if (!error){
                //1.收集数据,并封装成product对象
                const {name,desc,price,categoryIds,}=values
                let pCategoryId, categoryId
                if (categoryIds.length===1){
                    pCategoryId='0'
                    categoryId=categoryIds[0]
                }else{
                    pCategoryId=categoryIds[0]
                    categoryId=categoryIds[1]
                }
                const imgs= this.pw.current.getImgs()
                const detail=this.editor.current.getDetail()

                const product={name, desc,price,imgs,detail,pCategoryId,categoryId}
                //如果是更新，需要添加“_id”
                if (this.isUpdate){//是更新
                    product._id=this.product._id
                }

                //2.调用接口请求函数去添加/更新
                const result= await reqAddOrUpdateProduct(product)
                
                //3.根据结果提示
                if (result.status===0){
                    message.success(`${this.isUpdate ? 'Update' : 'Add'} product successfully!`)
                    this.props.history.goBack()
                }else{
                    message.error(`Failed to ${this.isUpdate ? 'update' : 'add'} product!`)
                }

            }
        })
    }

    componentDidMount(){
        this.getCategorys('0')
    }

    componentWillMount(){
        //取出携带的state
        const product =this.props.location.state //如果是添加就没值，如果是修改就有值
        //保存是否是更新的标识
        this.isUpdate=!!product
        //保存商品，如果没有，要指定一个空对象
        this.product=product || {}
    }

    render() {
        const {isUpdate, product}=this
        const {pCategoryId,categoryId,imgs,detail}=product
        //用来接收级联分类ID的数组
        const categoryIds=[]
        if (isUpdate){
            //商品是一个一级分类的商品
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{//商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
                
            }
        }

        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },//左侧label的宽度
            wrapperCol: { span: 8 },//指定右侧包裹的宽度
          };

        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                <Icon type='arrow-left' style={{fontSize:20}}/>
                </LinkButton>
                <span>{isUpdate ? 'Edit Product' : 'Add Product'}</span>
            </span>
        )

            const {getFieldDecorator}=this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="Product Name">
                        {getFieldDecorator('name',{
                            initialValue:product.name,
                            rules:[
                                {required:true, message:'must input product name'}
                            ]
                        })(<Input placeholder='Please input Product Name'/>)}                       
                    </Item>
                    <Item label="Description">
                        {getFieldDecorator('desc',{
                                initialValue:product.desc,
                                rules:[
                                    {required:true, message:'must input product description'}
                                ]
                            })(<TextArea placeholder="Please input product description:" autoSize={{minRows:2, maxRows:6}}/>)}                   
                    </Item>
                    <Item label="Product Price">
                    {getFieldDecorator('price',{
                                initialValue:product.price,
                                rules:[
                                    {required:true, message:'must input product price'},
                                    {validator:this.validatePrice}
                                ]
                            })(<Input type='number' addonBefore='$'  placeholder='Please input Product Price' />)
                    }
                        
                    </Item>
                    <Item label="Product Category">
                    {getFieldDecorator('categoryIds',{
                                initialValue:categoryIds,
                                rules:[
                                    {required:true, message:'must select product category'},
                                ]
                            })(<Cascader
                                placeholder='please select product category'
                                options={this.state.options}//需要显示的列表数据数组
                                loadData={this.loadData} //当选择某个列表项，加载下一级列表的监听回调
                            />)
                    }    
                        
                    </Item>
                    <Item label="Product Picture">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="Product Detail" labelCol={{span:2}} wrapperCol={{span:20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>Submit</Button>
                    </Item>



                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)