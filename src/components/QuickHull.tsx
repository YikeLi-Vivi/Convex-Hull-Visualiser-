import React from 'react'
import PropTypes from 'prop-types'
import {Point} from "./Point"

import { orientation,  windowResized, getSetup, sortCounterClock, Line, sleep, lineDist, drawHull} from './Util'
import Sketch from "react-p5"
import p5Types from "p5"
import { ColorDict } from '../util/Style'
interface Prop{
    points: Point[]
}

const AL_C = ColorDict.ACTIVE_LINE
const RL_C = ColorDict.RESULT_LINE

const QuickHull = (props: Prop) => {
    const {points} = props 
    let segLine : Line | null = null 
    let hull: Point[] = []
    const setup = getSetup(points)
    const solveHull = () => {
        if (points.length <= 3)  {
            return 
        }

        let min_x = points.reduce((a, b) => a.x < b.x ? a: b, points[0])
        let max_x = points.reduce((a, b) => a.x > b.x ? a: b, points[0])

        segLine = {start: min_x, end: max_x} 
        quickHull(min_x, max_x, -1)
        quickHull(min_x, max_x, 1)
    }
    
    const quickHull = (p1: Point, p2: Point, side: number) => {
    let ind = -1;
    let max_dist = 0;
    points.map((p, idx) => {
        let temp = lineDist(p1, p2, p)
        if(orientation(p1, p2, p) == side && temp > max_dist) {
            ind = idx 
            max_dist = temp 
        }
    })

    if (ind == -1 ) {
        hull.push(p1)
        hull.push(p2)
        return 
    }

    let side1 = orientation(points[ind], p1, p2)
    let side2 = orientation(points[ind], p2, p1)
 
    quickHull(points[ind], p1, -side1)
    quickHull(points[ind], p2, -side2)
}
    
    solveHull()

    let currIdx = 0

    const draw = (p5: any) => {
        segLine?.start.connectLine(p5, segLine.end)
        sleep(1)
        p5.stroke(AL_C.r, AL_C.g, AL_C.b)
        p5.strokeWeight(4)
        console.log(hull.length)
        hull[currIdx].draw(p5, 20)
        currIdx += 1

        if (currIdx == hull.length){
            p5.stroke(RL_C.r, RL_C.g, RL_C.b)
            hull = sortCounterClock(hull)
            drawHull(hull, p5)
            p5.noLoop()
        }
    }
  return (
    <Sketch setup={setup}
            draw={draw}
            windowResized={windowResized}/>
  )
}

QuickHull.propTypes = {}

export default QuickHull