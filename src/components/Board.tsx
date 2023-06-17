import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {Point} from "./Point"
import {dist, orientation} from "./Util"
import Sketch from 'react-p5'
import p5Types from "p5"
import Button from "./Button"
import SketchGiftWrap from "./GiftWrap"
import GrahamScan from "./GrahamScan"
import GiftWrap from './GiftWrap'
import DivideAndConquer from "./DivideAndConquer"
import ComboBox from "./ComBoBox"
import QuickHull from "./QuickHull"
import Select, {SelectChangeEvent} from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import PopUpBox from './PopUpBox'
import { FormLabel, Menu } from '@mui/material'

interface Line {
    x1: number,
    y1: number,
    x2: number, 
    y2: number 
}


const Board = () => {
    const [insOpen, setInsOpen] = useState(false);
    const [points, setPoints] = useState<Point[]>([])
    const [algo, setAlgo] = useState<string>("")
    const [choice, setChoice] = useState<string>("")
    const refresh = () => {
        setSolve(false)
        setPoints([])
        setChoice("")
        setAlgo("")
    }
    const draw = (p5: p5Types) => {
        p5.background(0)
        points.map((p, i) => p.draw(p5, 10))
    }
    
    const [solve, setSolve] = useState(false)
    
    const handleMouseClick = useCallback ((event: MouseEvent) => {
        if (event.clientY < window.innerHeight * 0.8 && event.clientX < window.innerWidth && !insOpen) {
            setPoints(points => [...points, new Point({x: event.clientX, y: event.clientY})])
            console.log(event.clientY)
        }
    },[])
    
    const startSolve = () => {
        window.removeEventListener("mousedown", handleMouseClick)
        setSolve(true)
        setChoice(algo)
    }

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.frameRate(5)
        window.addEventListener("mousedown", handleMouseClick)
        p5.createCanvas(p5.windowWidth, p5.windowHeight * 0.8).parent(canvasParentRef)
        p5.background(0)
    }

    const windowResized = (p5: p5Types) => {
        console.log("resized")
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight * 0.8)
        p5.background(0)
    }

    const handleChange = (event: SelectChangeEvent) =>{
        setAlgo(event.target.value as string)
    }

    const render = (choiceAlgo: string, points: Point[] ) => {
        console.log("render function", choice, points)
        if (choiceAlgo == ""){
            return (<Sketch setup={setup} windowResized={windowResized} draw={draw}/>)
        } else if (choiceAlgo == "1") {
           return (<GiftWrap points={points}/>)
        } else if (choiceAlgo =="2") {
            return (<GrahamScan points={points}/>)
        } else if (choiceAlgo == "3") {
            return (<QuickHull points={points}/>)
        } else if (choiceAlgo == "4"){
            return (<DivideAndConquer points={points}/>)
        } else {
            return (<Sketch setup={setup} windowResized={windowResized} draw={draw}/>)
        }
    }

    return (
    <div>
        {render(choice, points)}
        <div style={{backgroundColor: "#3F4E4F", padding: 40}}>
        <FormControl sx={{ 
            m: 1, width: 200,
            borderRadius: "7px", backgroundColor:"black", fontFamily:"Source Code Pro, monospace" }} style={{color: "white"}}>
        <InputLabel id="demo-simple-select-label" sx={{color:"white", fontWeight:"900", fontFamily:"Source Code Pro, monospace"}}>Select Algorithm</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{
                    color: "white", 
                    borderRadius: "7px", 
                    fontFamily:"Source Code Pro, monospace"
                    }}
                value={algo}
                onChange={handleChange}
                sx={{fontFamily:"Source Code Pro, monospace", fontSize:"15px"}}
            >
                <MenuItem value={1}>Gift Wrapping</MenuItem>
                <MenuItem value={2}>Graham Scan</MenuItem>
                <MenuItem value={3}>Quick Hull</MenuItem>
                <MenuItem value={4}>Divide and Conquer</MenuItem>
            </Select>
        </FormControl>

        <Button text='solve' onClick={startSolve}/>
        <Button text='restart' onClick={refresh}/>

        <PopUpBox openFun={()=>setInsOpen(true)} closeFun={()=>setInsOpen(false)}/>
        </div>
    </div>
  )
}


export default Board

