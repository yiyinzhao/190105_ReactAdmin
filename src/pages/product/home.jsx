import React, { Component } from 'react'
import{
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message,

}from 'antd'

import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option=Select.Option

/* Product 的默认子路由组件 */
export default class ProductHome extends Component {
    state={
        total:0,//商品的总数量
        products:[],//商品的数组
        loading:false,//是否正在加载中
        searchName:'',//搜索的关键字
        searchType:'productName',//根据哪个字段搜索
    }

    //初始化table表格的列的数组
    initColumns=()=>{
        this.columns = [
            {
              title: 'Product Name',
              dataIndex: 'name',
            },
            {
              title: 'Product Description',
              dataIndex: 'desc',
              key: 'age',
            },
            {
              title: 'Price',
              dataIndex: 'price',
              render: (price)=>'$'+price,//当前指定了对应的属性，传入的是对应的属性值
            },
            {   
                width:100,
                title: 'Status',
                //dataIndex: 'status',
                render: (product)=>{
                    const {status,_id}=product
                return(
                    <span>
                        <Button 
                            type='primary' 
                            onClick={()=>this.updateStatus(_id,status===1 ? 2 : 1)}
                        >
                            {status===1? 'out stock' :'on sale'}
                        </Button>
                        <span>{status===1? 'on sale':'out stock'}</span>
                    </span>
                )
                }    
              },

              {
                width:100,  
                title: 'Action',
                render: (product)=>{

                return(
                    <span>
                        {/*将product对象作为state传递给目标路由组件 */}
                        <LinkButton onClick={()=>this.props.history.push('/product/detail', {product})}>Detail</LinkButton>
                        <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>Edit</LinkButton>
                    </span>
                )
                }    
              },
          ];
    }

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getProducts(1)
    }

    //获取指定数据显示
    getProducts=async(pageNum)=>{
        this.pageNum=pageNum //保存pageNum，让其他方法可以看到
        this.setState({loading:true})
        const {searchName,searchType}=this.state
        //如果搜索关键字有值，就是要做搜索分页，否则就是一般分页
        let result
        if(searchName){
            result=await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{//一般分页
            result=await reqProducts(pageNum, PAGE_SIZE)
        }
     
        this.setState({loading:false})
        if(result.status===0){
            //取出分页数据，更新状态，显示分页列表
            const{total,list}=result.data
            this.setState({
                total,
                products:list
            })
        }
    }

    /*
    更新指定页码的列表数据显示
    */
    updateStatus=async(productId, status)=>{
        const result= await reqUpdateStatus(productId, status)
        if(result.status===0){
            message.success('update successfully!')
            this.getProducts(this.pageNum)
        }
    }
   

    render() {

        //取出状态数据
        const {total,products,loading,searchType,searchName}=this.state
          


        const title=(
            <span>
                <Select value={searchType} 
                        style={{width:160}} 
                        onChange={value=>this.setState({searchType:value})}>
                    <Option value='productName'>search by Name</Option>
                    <Option value='productDesc'>search by description</Option>
                </Select>

                <Input placeholder='keywords' 
                style={{width:150, margin:'0 15px'}} 
                value={searchName}
                onChange={event=>this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick={()=>this.getProducts(1)}>Search</Button>
            </span>
        )

        const extra=(
            <Button type="primary" onClick={()=>this.props.history.push('/product/addupdate')}>
                <Icon type="plus"/>
                Add Product
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table 
                bordered
                loading={loading}
                rowKey='_id'
                dataSource={products} 
                columns={this.columns}
                pagination={{
                    current:this.pageNum,
                    total, 
                    defaultPageSize:PAGE_SIZE, 
                    showQuickJumper:true,
                    onChange: this.getProducts
                    }} />;
            </Card>
        )
    }
}

