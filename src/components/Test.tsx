import React, {useRef, useState, useEffect, useCallback} from "react";
import PointShape, {PointStyle} from "./PointShape";
import Xarrow from "react-xarrows";
import styled from "styled-components";
import {dist, orientation, sleep} from "./Util"
import Button from "./Button"

interface Point {
    x: number, 
    y: number 
}

interface Line {
    start: string, 
    end: string 
}

const pointStyle: PointStyle = {color: "blue", size: "10px", zIndex: 1}
const hullPointStyle: PointStyle = {color: "red", size: "15px", zIndex: 2}

const LINE_WIDTH = 4
const LINE_COLOR = "blue"
const HULL_LINE_WIDTH = 7
const HULL_LINE_COLOR = "red"
const canvasHeight = window.innerHeight * 0.8
const canvasWidth = window.innerWidth

const Canvas = styled.div`
    background-color: black;
    width: ${canvasWidth}px;
    height: ${canvasHeight}px;
    position: relative;
`

const getPointId = (point: Point): string => {
    const xstr = point.x.toString()
    const ystr = point.y.toString()
    const Id = xstr + "--" + ystr 
    return Id
}

export const Test = () => {
    const [points, setPoints] = useState<Point []> ([])
    const [hullPoints, setHullPoints] = useState<Point[]>([])
    const [lines, setLines] = useState<Line[]>([])
    const [hullLines, setHullLines] = useState<Line[]>([])

    const handleMouseClick = useCallback ((event: MouseEvent) => {
        if (event.clientY < window.innerHeight * 0.8) {
            setPoints ( points => [...points!, {x: event.clientX, y: event.clientY}])
        }
    },[])
    
    useEffect (() => {
        window.addEventListener("mousedown", handleMouseClick)
        return () => {
            window.removeEventListener("mousedown", handleMouseClick)
        }
    }, [])


    const solver = async () => {
        //  sort the point 
        setPoints(points => {
            points.sort((a, b) => a.x - b.x)
            return points
        })
        const leftMost = points[0]
        let currentPoint = leftMost
        let nextPoint = leftMost 

        setHullPoints([leftMost])
        let solving = true 

        while (solving) {
            points.map(async (point, idx) => {
                let startId = getPointId(currentPoint)
                let endId = getPointId(point)
                
                // await sleep(2000)
                setLines(lines => [...lines, {start: startId, end: endId}])
                let o = orientation(currentPoint, nextPoint, point)
                let d1 = dist(currentPoint, point)
                let d2 = dist(currentPoint, nextPoint)

                if (nextPoint == currentPoint || o == 1 || (o == 0 && d1 >= d2)){
                    nextPoint = point
                }

                // await sleep(2000)
                setHullPoints(points => [...points, nextPoint])
                setHullLines(lines => [...lines, 
                                        {start: getPointId(currentPoint), 
                                         end: getPointId(nextPoint)}])
                
                currentPoint = nextPoint
                console.log(hullLines, hullPoints)

                if (currentPoint == leftMost) {
                    solving = false
                }
            })
        }


        // initialize the currentpoint, next point,
    }



    return (
        <>
        <Canvas>
         {points?.map((point, idx) => 
                        <PointShape x = {point.x} y = {point.y} 
                                   style={pointStyle} />)}
        {hullPoints?.map((point, idx) => 
                        <PointShape x = {point.x} y = {point.y}
                                style={hullPointStyle}/>)}
        {lines?.map((line, idx) => 
                       <Xarrow start={line.start} end={line.end} 
                               showHead={false} showXarrow={false}
                               zIndex={1} color={LINE_COLOR} strokeWidth={LINE_WIDTH}/>)}
        
        {hullLines?.map((line, idx) => 
                        <Xarrow start={line.start} end={line.end}
                                showHead={false} showXarrow={false}
                                zIndex={2} color={HULL_LINE_COLOR} strokeWidth={HULL_LINE_WIDTH}/> )}
        
        </Canvas>
        <Button text="Solve" onClick={solver}/>
        </>
    );
}

