import React from 'react'
import PropTypes from 'prop-types'
import {Point} from "./Point"
import {getSetup, sleep, orientation} from "./Util"
import p5Types from "p5"
import Sketch from 'react-p5'
import {ColorDict, Color, DimensionDict} from "../util/Style"

interface Props {
    points: Point []
}

interface ColorValue {
    r: number, 
    g: number, 
    b: number 
}

interface PointSolution{
    pointArr: Point[],
    color: Color, 
    width: number
}

const RESULT_LINE_C  = ColorDict.RESULT_LINE
const ACTIVE_LINE_C  = ColorDict.ACTIVE_LINE
const RESUILT_LINE_W = DimensionDict.RESULT_LINE_WIDTH
const ACTIVE_LINE_W = DimensionDict.ACTIVE_LINE_WIDTH

const DivideAndConquer = (props: Props) => {
    
    let {points} = props 
    let solutions: PointSolution[] = []
    let idx = 0
    points.sort((a, b) => a.x - b.x)
    
    const divide = (Hull: Point[]) : Point[] => {
        let res: Point[] = []
        if (Hull.length <= 3) {
            res = sortCounterClockWise(Hull)
            solutions.push( {
                pointArr: Hull, color: RESULT_LINE_C, width: RESUILT_LINE_W})
            return res 
        }
    
        let left: Point [] = []
        let right: Point [] = []
        let mid: number = Math.floor(Hull.length/2)
        
        for (let i = 0; i < mid; i++) {
            left.push(Hull[i])
        }
        console.log("left", left)
        for (let i = mid; i < Hull.length; i++) {
            right.push(Hull[i])
        }
        console.log("right", right)
        
        let right_Hull: Point[] = divide(right)
        let left_Hull: Point[] = divide(left)
        solutions.push({pointArr: right_Hull, color: ACTIVE_LINE_C, width: ACTIVE_LINE_W})
        solutions.push({pointArr: left_Hull, color:  ACTIVE_LINE_C, width: ACTIVE_LINE_W})
        res = merge(left_Hull, right_Hull)
        solutions.push({pointArr: res, color:RESULT_LINE_C, width: ACTIVE_LINE_W})
        return res 
    }
    
    const merge = (A: Point[], B: Point[]): Point[]  => {
        let na = A.length 
        let nb = B.length
        let ia = 0 
        let ib = 0 
        
        for (let i = 0; i < na; i++) {
            if (A[i].x >= A[ia].x) 
                ia = i
        }
        
        for(let i = 0; i < nb; i++){
            if (B[i].x <= B[ib].x) 
            ib = i
        }
        
        let tempa = ia 
        let tempb = ib
        let done = false 
        
        //    finding the upper tangent 
        while (!done) {
            done = true 
            let checka = (tempa + 1) % na 
            while ( orientation(B[tempb], A[tempa], A[checka]) <= 0) {
                tempa = checka 
                checka = (tempa + 1) % na
            }
            
            let checkb = (tempb + nb - 1) % nb
            while (orientation(A[tempa], B[tempb], B[checkb]) >= 0){
                tempb = checkb
                checkb = (tempb + nb - 1) % nb 
                done = false
            }
        }
        
        //  finding the lower tangent 
        done = false 
        let uppera = tempa, upperb = tempb 
        tempa = ia 
        tempb = ib
        
        while (!done) {
            done = true 
            let checkb = (tempb + 1) % nb 
            while (orientation(A[tempa], B[tempb], B[checkb]) <= 0) {
                tempb = checkb 
                checkb = (tempb + 1) % nb 
            }
            
            let checka = (tempa + na - 1) % na 
            while(orientation (B[tempb], A[tempa], A[checka]) >= 0) {
                tempa = checka 
                checka = (tempa + na - 1) % na 
                done = false 
            }
        }
        
        let lowera = tempa , lowerb = tempb 
        
        let res : Point[] = []
        
        let temp = uppera 
        res.push(A[temp])
        while(temp != lowera) {
            temp = (temp + 1) % na 
            res.push(A[temp])
        }
        
        temp = lowerb
        res.push(B[temp])
        while(temp != upperb) {
            temp = (temp + 1) % nb
            res.push(B[temp])
        }
        
        return res
    }
    
    const drawHull  = (Hull: PointSolution, p5: p5Types) => {
        const {pointArr, color, width} = Hull
        p5.stroke(color.r, color.g, color.b)
        pointArr.map((p, idx) => {
            p5.strokeWeight(width)
            let nextPoint = (idx + 1) % pointArr.length
            p.connectLine(p5, pointArr[nextPoint])
        })
    }
    
    const sortCounterClockWise = (Hull: Point []) : Point[]=> {
        let centerX = Hull.reduce((a, b)=> a + b.x, 0) 
        centerX = centerX / Hull.length

        let centerY = Hull.reduce((a, b)=> a + b.y , 0) 
        centerY = centerY / Hull.length

        
        interface PointWithAngle {
            point: Point, 
            angle: number 
        }
        let angles:PointWithAngle[] = []

        Hull.map((p, idx) => {
            const {x, y} = p 
            angles.push(
                {point: p, angle: Math.atan2(y - centerY, x - centerX)})
        })

        angles.sort((a, b) => a.angle - b.angle)

        let res: Point[] = []

        angles.map((p, idx) => res.push(p.point))

        return res
    }

    divide(points)
    const draw = async (p5: p5Types) => {
        drawHull(solutions[idx], p5)
        await sleep(0.1)
        idx += 1
        if (idx == solutions.length) p5.noLoop()
    }
    
    const setup = getSetup(points)
    
    
    return (
        <Sketch setup={setup} draw={draw} />
    )
}

DivideAndConquer.propTypes = {}

export default DivideAndConquer