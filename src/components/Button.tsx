import React, { MouseEventHandler } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

export interface ButtonProps {
    text: string;
    onClick: MouseEventHandler
}

const BlackButton = styled.button `
    background-color:black;
    color: white;
    font-size:20px;
    border-radius: 7px;
    margin: 10px 5px;
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