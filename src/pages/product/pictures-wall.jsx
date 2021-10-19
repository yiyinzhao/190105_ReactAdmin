import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import {reqDeleteImg} from '../../api'
import PropTypes from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constants'


//用于图片上传的组件

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}



export default class PicturesWall extends React.Component {
  static propTypes={
    imgs:PropTypes.array
  }

  state = {
    previewVisible: false,//标识是否显示大图预览界面
    previewImage: '',//大图的url，地址
    fileList: [
      /*{
        uid: '-1', //每个file都有自己唯一的id
        name: 'image.png',//图片文件名
        status: 'done', //图片状态：代表已经上传图片。uploading:正在上传中；removed：已删除
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',//图片地址
      },*/
     
    ],
  };

  constructor (props) {
    super (props)
    let fileList=[]
    //如果传入了一个imgs属性，应该根据它来生成一个数组
    const {imgs}=this.props
    if (imgs && imgs.length>0){
      fileList=imgs.map((img,index)=>({
        uid: '-index', //每个file都有自己唯一的id
        name: img,//图片文件名
        status: 'done', //图片状态：代表已经上传图片。uploading:正在上传中；removed：已删除
        url: BASE_IMG_URL + img
      }))
    }

    //初始化状态
    this.state={
      previewVisible: false,//标识是否显示大图预览界面
      previewImage: '',//大图的url，地址
      fileList //所有已上传图片的数组

    }
  }

  /*获取所有已上传图片文件名的数组*/
  getImgs=()=>{
    return this.state.fileList.map(file=>file.name)
  }

  //隐藏大图modal
  handleCancel = () => this.setState({ previewVisible: false });
  /*显示指定file对应的大图  */
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /*
    fileList: 是所有已上传图片文件对象的数组  
    file:是当前操作的图片文件（上传或删除）
    */
  handleChange = async({file, fileList }) => {
    console.log('handleChange()',file.status,fileList.length, file)

    //一旦上传成功，将当前上传的file的信息修正(name, url地址)
    if (file.status==='done'){
      const result=file.response //{status:0, data:{name:'xxx.jpg',url:'图片地址'}}
      if (result.status===0){
        message.success('upload picture successfully!')
        const {name,url}=result.data
        file=fileList[fileList.length-1]
        file.name=name
        file.url=url
      }else{
        message.error('failed to upload picture!')
      }
    }else if (file.status==='removed'){//删除图片
        const result= await reqDeleteImg(file.name)
        if (result.status===0){
          message.success('image deleted successfully')
        }else{
          message.error('failed to delete image!')
        }
    }


    //在操作（上传或删除）过程中及时跟新fieldList的状态
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" /*上传图片的接口地址 */
          accept='image/*'  /*只接收图片格式 */
          name='image' /*请求参数名  */
          listType="picture-card" /*卡片样式  */
          fileList={fileList} /*所有已上传图片文件对象的数组  */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

/*
1. 子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
2. 父组件调用子组件的方法:在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法

*/