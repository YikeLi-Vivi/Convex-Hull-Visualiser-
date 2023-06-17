import React from 'react'
import PropTypes from 'prop-types'
import p5Types from "p5"
import { Point } from './Point'
import {dist, orientation, polarAngle, sleep} from "./Util"
import Sketch from 'react-p5'
import {ColorDict, DimensionDict } from "../util/Style"

interface Props {
    points: Point[]
}

interface Line {
    start: Point, 
    end: Point 
}

const AL_C = ColorDict.ACTIVE_LINE
const RL_C = ColorDict.RESULT_LINE
const AL_W = DimensionDict.RESULT_LINE_WIDTH
const RL_W = DimensionDict.ACTIVE_LINE_WIDTH


const GrahamScan = (props: Props) => {
    let {points} = props 
    let bottom = points.reduce(
        (prev, cur) => {
            if (prev.y > cur.y){
                return prev
            } else if (prev.y == cur.y){
                return prev.x < cur.x? prev: cur
            } else {
                return cur
            }})

    points.sort(
        (a, b) => {
            let d = polarAngle(bottom, b) - polarAngle(bottom, a)
            if(d != 0) {
                return d
            } else {
                return dist(bottom, a) - dist(bottom, b)
            }})
    

    let hull: Point[] = [bottom]
    let currentIdx = 0 

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight * 0.8).parent(canvasParentRef)
        p5.background(0)
        p5.stroke(255)
        p5.frameRate(5)
        points.map((p, idx) => p.draw(p5, 10))
    }

    const windowResized = (p5: p5Types) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight * 0.8)
    }

    const draw = async (p5: p5Types) => {
        p5.background(0)
        p5.stroke(255)
        points.map((p, idx) => p.draw(p5, 10))
       
        
        p5.stroke(AL_C.r,AL_C.g,AL_C.b)
        /* draw points  on the hull */
        hull.map((p, idx) => p.draw(p5, 20))
        let length = hull.length
        console.log("hull length", length)
        /* draw line on the hull */
        p5.strokeWeight(AL_W)
        hull.map((p, idx)=> {
            if (idx != length - 1) {
                p.connectLine(p5, hull[idx + 1])
            } 
        }) 
        
        if (currentIdx == points.length) {
            hull[length - 1].connectLine(p5, hull[0])
            p5.stroke(RL_C.r, RL_C.g, RL_C.b)
            hull.map((p, idx) => p.draw(p5, 20))
            p5.strokeWeight(RL_W)
            hull.map((p, idx) => {
                const nextIdx = (idx + 1) % hull.length
                p.connectLine(p5, hull[nextIdx])
            })

            p5.noLoop()
        }

        let p1 = hull[length - 2]
        let p2 = hull[length - 1]
        while (length > 1 && orientation(p2, p1, points[currentIdx]) != 1) {
            hull.pop()
            length = hull.length
            p1 = hull[length - 2]
            p2 = hull[length - 1]
            await sleep(0.1)
        } 
        console.log("pushed")
        if (points[currentIdx] != bottom){hull.push(points[currentIdx])}
        currentIdx += 1
    }

  return (
    <Sketch setup={setup} draw={draw} windowResized={windowResized} />
  )
}

GrahamScan.propTypes = {}

export default GrahamScan