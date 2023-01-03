import React from 'react';
import styled from 'styled-components';
import p5Types from "p5";
import Sketch  from 'react-p5';

export interface PointProps {
    x: number;
    y: number
}

export interface Point {
    x: number ;
    y: number ;
}

export class Point extends React.Component {
    constructor(props: PointProps) {
        super(props);
        const { x, y} = props; 
        this.x = x; 
        this.y = y;
    }

    connectLine(p5:p5Types, point: Point){
        p5.line(this.x, this.y, point.x, point.y)
    }

    draw(p5: p5Types, size: number){
        p5.ellipse(this.x, this.y, size)
    }

}
