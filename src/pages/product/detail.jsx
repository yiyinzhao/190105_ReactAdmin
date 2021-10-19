import React, { Component } from 'react'
import{
    Card,
    Icon,
    List,

} from 'antd'

import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'

const Item=List.Item

/* Product 的详情的子路由组件 */
export default class ProductDetail extends Component {
    state={
        cName1:'',//一级分类名称
        cName2:'',//二级分类名称
    }
    
    async componentDidMount(){
        //得到当前商品的分类id，一个是父分类id，一个是当前分类id
        const {pCategoryId,categoryId}=this.props.location.state.product
        if (pCategoryId==='0'){//一级分类下商品
            const result= await reqCategory(categoryId)
            const cName1=result.data.name
            this.setState({cName1})
        }else{//二级分类下的商品
            /*
            //通过多个await的方式发送请求：后面一个请求是在前一个请求成功返回后才发生
            const result1= await reqCategory(pCategoryId)//获取一级分类列表
            const result2= await reqCategory(categoryId)//获取二级分类列表
            const cName1=result1.data.name
            const cName2=result2.data.name
            
            */

            //一次性发送多个请求，只有都成功了才正常处理
            const results=await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            const cName1=results[0].data.name
            const cName2=results[1].data.name


            this.setState({cName1,cName2})
        }
    }


    render() {
        //读取携带过来的state状态数据
        const {name,desc,price,detail,imgs}= this.props.location.state.product
        const {cName1,cName2}=this.state

        const title=(
            <span>
                <LinkButton>
                <Icon 
                    type="arrow-left" 
                    style={{ marginRight:10, fontSize:20,}} 
                    onClick={()=>this.props.history.goBack()}/>
                </LinkButton>
                <span>Product Detail</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">Product Name:</span>
                        <span className="right">{name}</span>
                    </Item>

                    <Item>
                        <span className="left">Product Description:</span>
                        <span className="right">{desc}</span>
                    </Item>

                    <Item>
                        <span className="left">Product Price:</span>
                        <span>{price}</span>
                    </Item>

                    <Item>
                        <span className="left">Class:</span>
                        <span>{cName1} {cName2?'-->'+cName2 : ''}</span>
                    </Item>

                    <Item>
                        <span className="left">Product Picture:</span>
                        <span>
                            {
                                imgs.map((img)=>(
                                    <img 
                                    key={img}
                                    src={BASE_IMG_URL + img}
                                    className="product-img"                                     
                                    alt="img" />

                                ))
                            }
                            <img className="product-img" src="" alt="img" />
                        </span>
                    </Item>

                    <Item>
                        <span className="left">Product Detail:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}>
                        </span>    

                    </Item>


                   
                </List>

            </Card>
        )
    }
}

