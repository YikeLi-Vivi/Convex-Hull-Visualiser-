import {Point} from "./Point"
import { orientation, dist, sleep, getSetup, windowResized } from "./Util"
import {ColorDict, DimensionDict} from "../util/Style"
import Sketch from "react-p5"

const AL_C = {r:255, g:255, b:255}
const RL_C = ColorDict.RESULT_LINE
const CL_C = ColorDict.ACTIVE_LINE
const AL_W = 2
const RL_W = 5
const CL_W = 3

interface Props {
    points: Point[]
}

interface Line {
    start: Point,
    end: Point 
}

const GiftWrap = (props: Props) => {
    let {points} = props 
    
    points.sort ((a, b) => a.x - b.x)
    let leftMost = points[0]
    let currentPoint = points[0]
    let nextPoint = points[0]
    let currentIdx = 0 
    let hullLines: Line[] = []

    const setup = getSetup(points)

    const draw = (p5: any) => {
        p5.stroke(255)
        points.map((p,i) => p.draw(p5, 10))
        /* draw normal points */
        p5.stroke(255)

        /* draw hull points */
        p5.stroke(0,255,0)
        currentPoint.draw(p5, 20)

        let checkPoint = points[currentIdx]
        sleep(1)
        p5.stroke(CL_C.r, CL_C.g, CL_C.b)
        p5.strokeWeight(CL_W)
        currentPoint.connectLine(p5,nextPoint)
        sleep(1)
        p5.strokeWeight(AL_W)
        p5.stroke(AL_C.r, AL_C.g, AL_C.b)

        currentPoint.connectLine(p5, checkPoint)

        let d = orientation(currentPoint, nextPoint, checkPoint)

        if(nextPoint == currentPoint || 
            d == 1 ||
            d == 0 && dist(currentPoint, checkPoint) 
            >= dist(currentPoint, nextPoint)) {
                p5.color(AL_C.r, AL_C.g, AL_C.b)
                p5.strokeWeight(AL_W)
                currentPoint.connectLine(p5, nextPoint)
                nextPoint = checkPoint
            } 
        
        currentIdx += 1

        if (currentIdx == points.length) {
            currentIdx = 0
            p5.stroke(RL_C.r,RL_C.g,RL_C.b)
            p5.strokeWeight(RL_W)
            currentPoint.connectLine(p5, nextPoint)
            hullLines.push({start:currentPoint, end: nextPoint})
            currentPoint = nextPoint
            nextPoint = leftMost

            hullLines.map((line, idx) => line.start.connectLine(p5,line.end))

            if (currentPoint == leftMost){
                p5.noLoop()
            }
        }
    }
        
    return (
        <Sketch setup={setup} 
                draw={draw} 
                windowResized={windowResized}/>
    )
    

}




export default GiftWrap