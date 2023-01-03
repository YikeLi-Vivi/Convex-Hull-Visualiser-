import React, {useState, useEffect, useRef, useCallback} from 'react'
import Button from './Button'
import Sketch from 'react-p5'
import p5Types from "p5"

interface Line {
    x1: number, 
    y1: number, 
    x2: number,
    y2: number 
}

interface Point {
    x: number, 
    y: number
}

/* find the distance of two points */
const dist = (p1: Point, p2: Point) => {
    return Math.sqrt((p2.y - p1.y)*(p2.y - p1.y) 
                    + (p2.x - p1.x) * (p2.x - p1.x))
}

/* determine which point to pick as the next point */
const orientation = (p1: Point, p2: Point, p3: Point) => {
    const d = (p3.y - p2.y)*(p2.x - p1.x) - (p2.y- p1.y)*(p3.x - p2.x)
    
    if (d > 0) {
        return 1
    } 
    
    if (d == 0) {
        return 0
    }

    if (d < 0) {
        return -1
    }
}

const reload = () => {
    window.location.reload()
}

export const Board = () => {
    /* components that will be draw on the screen */
    const [points, setPoints] = useState<Point[]>([{x:10, y:10}])
    const [hull, setHull] = useState<Point[]>([])
    const [hullLines, setHullLines]   = useState<Line []> ([])

    const [solve, setSolve] = useState(false)

    const [currentPoint, setCurrentPoint] = useState <Point> (points[0])
    const [leftMost, setLeftMost] = useState <Point>(points[0])

    let nextPoint = points[0]
    let solving = true

    const Solver = () => {
        setPoints(points => { 
            points.sort((a, b) => a.x - b.x)
            return points})
        setLeftMost(points[0])
        setCurrentPoint(leftMost)
        setHull([leftMost])
        setSolve(solve => !solve)
        console.log(points)
        window.removeEventListener("mousedown", handleMouseClick)
    }

    const handleMouseClick = useCallback ((event : MouseEvent) => {
        if (event.clientY < window.innerHeight * 0.8 && event.clientX < window.innerWidth){
                setPoints(points => [...points, {x: event.clientX, y:event.clientY}])
            }
        }, [])
        
    const setUp = (p5: p5Types, canvasParentRef: Element) => {
        window.addEventListener("mousedown", handleMouseClick)
        p5.createCanvas(p5.windowWidth, p5.windowHeight * 0.8).parent(canvasParentRef)
    }
    

    const windowResized = (p5: p5Types) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight * 0.8);
      };
      

    const draw = (p5: p5Types) => {
        p5.background(0,0,0)
        points.map((p, i) => p5.ellipse(p.x, p.y, 10))
    }
    
    const drawSolution = (p5: p5Types) => {
        p5.background(0,0,0,0)
        // TODO: change the style of point in hull
        //  draw the point in the hull 
        hull.map((p, i) => 
        {   p5.stroke(255, 0, 0)
            p5.ellipse(p.x,p.y, 20)
        })

        // draw the lines in the hull lines 
        hullLines.map((l, i) => {
            p5.stroke(0,255,0)
            p5.line(l.x1, l.y1, l.x2, l.y2)
        })

        if (solving) {
        //  solve the convex hull 
        nextPoint = leftMost
        
        points.map((point: Point, i: number) => {
            p5.stroke(255)
            p5.line(currentPoint.x, currentPoint.y, point.x, point.y)
            //  TODO: add set time out 
            let d = orientation(currentPoint, nextPoint, point)
            
            if (nextPoint == currentPoint || 
                d == 1 || 
                (d == 0 && dist(currentPoint, point) >=
                    dist(currentPoint, nextPoint))) {
                nextPoint = point
            }
        })

        //  update hull and lines
        setHull(hull => [...hull, nextPoint])
        setHullLines(hullLines => [
            ...hullLines, 
            {x1: currentPoint.x, y1: currentPoint.y, 
             x2: nextPoint.x, y2: nextPoint.y}])

        setCurrentPoint(nextPoint)

        if (currentPoint == points[0]) {
            // p5.noLoop()
        }
        }
    }

    return (
        <div>
            <Sketch 
                windowResized ={windowResized} 
                setup={setUp} 
                draw = {solve? drawSolution: draw} />
            <Button text="solve" onClick={Solver}/>
            <Button text="restart" onClick={reload}/>
        </div>
    )
}
