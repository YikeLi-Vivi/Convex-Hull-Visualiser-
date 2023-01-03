import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {Point} from "./Point"
import {dist, orientation, refresh} from "./Util"
import Sketch from 'react-p5'
import p5Types from "p5"
import Button from "./Button"
import { createBox } from 'framer-motion'

interface Line {
    x1: number,
    y1: number,
    x2: number, 
    y2: number 
}

const GiftWrappingBoard = () => {
    const [points, setPoints] = useState<Point[]>([new Point({x: 10, y: 10})])
    const [currentPoint, setCurrentPoint] = useState<Point>(new Point ({x:10, y:10}))
    const [leftMost, setLeftMost] = useState<Point>(new Point({x:10, y:10}))
    // let hull: Point[] = []
    // let hullLines: Line[] = []
    let nextPoint: Point 
    let currentIdx: number = 0


    const [hull, setHull]  = useState<Point[]>([])
    const [hullLines, setHullLines] = useState<Line[]> ([])
    const [solve, setSolve] = useState(false)
    
    const handleMouseClick = useCallback ((event: MouseEvent) => {
        if (event.clientY < window.innerHeight * 0.8 && event.clientX < window.innerWidth ) {
            setPoints(points => [...points, new Point({x: event.clientX, y: event.clientY})])
        }
    },[])
    
    const startSolve = () => {
        setPoints(points => {
            points.sort((a, b) => a.x - b.x)
            return points
        })
        setLeftMost(points[0])
        setCurrentPoint(leftMost)
        setHull ([points[0]])
        window.removeEventListener("mousedown", handleMouseClick)
        setSolve(true)
    }


    const setup = (p5: p5Types, canvasParentRef: Element) => {
        window.addEventListener("mousedown", handleMouseClick)
        p5.createCanvas(p5.windowWidth, p5.windowHeight * 0.8).parent(canvasParentRef)
    }

    const windowResized = (p5: p5Types) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight * 0.8)
    }

    const draw = (p5: p5Types) => {
        p5.background(0)
        points.map((p, i) => p.draw(p5, 10))
    }

    const solverSetup = (p5: p5Types, canvasParentRef: Element) => {
        setCurrentPoint(leftMost)
        p5.createCanvas(p5.windowWidth, p5.windowHeight * 0.8).parent(canvasParentRef)
    }


    const drawSolution = (p5: p5Types) => {

        p5.background(0)
        points.map((p, i) => p.draw(p5, 10))

        setHull(hull => [...hull, currentPoint])
        
        hull.map((p,i) => {
            p5.stroke(255, 0, 0)
            p.draw(p5, 20)
        })

        hullLines.map((l, i) => {
            p5.stroke(0,255, 0)
            p5.line(l.x1, l.y1, l.x2, l.y2)
        })

    
        
        nextPoint = leftMost
        let checkPoint = points[currentIdx]
        p5.stroke(255)
        currentPoint.connectLine(p5, nextPoint)
        currentPoint.connectLine(p5, checkPoint)

        let d = orientation(currentPoint, nextPoint, checkPoint)
        if (nextPoint == currentPoint || 
            d == 1 ||
            d == 0 && dist(currentPoint, checkPoint) >= 
            dist(currentPoint, nextPoint)) {
                nextPoint = checkPoint
            }
        
        currentIdx += 1 
        if (currentIdx == points.length){
            currentIdx = 0 
            setHullLines (hullLines => [...hullLines, {
                x1: currentPoint.x, 
                y1: currentPoint.y, 
                x2: currentPoint.x, 
                y2: currentPoint.y}])
            setCurrentPoint(nextPoint)
        }
    } 
    
    return (
    <div>
        <Sketch setup={solve? solverSetup : setup} 
                windowResized={windowResized} 
                draw={solve? drawSolution : draw}/>
        <Button text='solve' onClick={startSolve}/>
        <Button text='restart' onClick={refresh}/>
    </div>
  )
}

GiftWrappingBoard.propTypes = {}

export default GiftWrappingBoard