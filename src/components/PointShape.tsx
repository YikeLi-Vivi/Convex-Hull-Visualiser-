import React from 'react'
import PropTypes from 'prop-types'
import styled from "styled-components"

export interface PointStyle {
    color: string,
    size: string, 
    zIndex: number, 
}
export interface PointShapeProp {
    x: number, 
    y: number,
    style: PointStyle 
}


const StyledPoint = styled.div `
    border-radius: 50%;
    position: absolute;
`

const PointShape =( props: PointShapeProp) => {
    const {x, y, style} = props 
    const {color, size, zIndex } = style 

  return (
    <StyledPoint style={{top: y, left: x, width: size, 
                         height: size, backgroundColor:color, zIndex: zIndex}}
                id = {x.toString + "--" + y.toString}/>
  )
}

PointShape.propTypes = {}

export default PointShape