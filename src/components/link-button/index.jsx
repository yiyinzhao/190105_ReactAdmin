import React, { Component } from 'react'
import './index.less'
import './index.css'

/*
外形像链接的按钮
*/
export default function LinkButton(props){
    return <button {...props} className="link-button"></button>
}