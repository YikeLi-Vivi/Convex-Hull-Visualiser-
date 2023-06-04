import React, { MouseEventHandler } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

export interface ButtonProps {
    text: string;
    onClick: MouseEventHandler
}

const BlackButton = styled.button `
    width:200px;   
    height:55px; 
    background-color:black;
    color: white;
    font-size:20px;
    border-radius: 7px;
    margin: 50px 5px;
    margin-bottom:10px;
    cursor: pointer;
    padding: 10px 50px;
    text-align: center;
`
const Button = (props: ButtonProps) => {
  return (
    <BlackButton onClick={props.onClick}> {props.text} </BlackButton>
  )
}


export default Button