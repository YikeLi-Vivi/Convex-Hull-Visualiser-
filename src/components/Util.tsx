import p5Types from "p5"
import { Point } from "./Point"


export interface Line {
    start: Point, 
    end: Point 
}

export const windowResized = (p: p5Types) =>{
    p.background(0)
    p.resizeCanvas(p.windowWidth, p.windowHeight * 0.8)
}


export const getSetup = (points: Point[]) => {
    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight * 0.8).parent(canvasParentRef)
        p5.background(0)
        p5.stroke(255)
        points.map((p, idx)=> p.draw(p5, 10))
    }

    return setup 
}


export const dist = (p1: Point, p2: Point) => {
    return Math.sqrt((p2.y - p1.y)*(p2.y - p1.y) 
                    + (p2.x - p1.x) * (p2.x - p1.x))
}

export const orientation = (p1: Point, p2: Point, p3: Point) => {
    const d = (p3.y - p2.y)*(p2.x - p1.x) - (p2.y- p1.y)*(p3.x - p2.x)
    
    if (d > 0) {
        return 1
    } 

    if (d < 0) {
        return -1
    }
    return 0 
}

export const refresh = () => {
    window.location.reload()
}

export const sleep = (time: number)  => {
    for (let index = 0; index < time*100000000; index++) {
    }
}

export const polarAngle = (p1: Point, p2: Point) => {
    if (p1.x == p2.x) {
        return -Math.PI
    }

    let dy = p1.y - p2.y 
    let dx = p1.x - p2.x 

    return Math.atan2(dy, dx)
}

export const sortCounterClock = (Hull : Point[]) => {
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

export const lineDist = (p1: Point, p2: Point, p: Point) => 
{
    return Math.abs ((p.y - p1.y) * (p2.x - p1.x) -  
                     (p2.y - p1.y) * (p.x - p1.x));
}


export const drawHull = (hull: Point[], p5: p5Types) => {
    hull.map((p, idx) => {
        let nextPoint = (idx + 1) % hull.length
        p.connectLine(p5, hull[nextPoint])
    })
}