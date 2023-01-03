import React, {useRef, useEffect, useState, useCallback} from 'react'


interface Style {
    width: number, 
    color: string 
}

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

const pointStyle: Style = {
    width: 3,
    color: "blue"
}

const hullPointStyle: Style = {
    width: 5, 
    color:"red"
}

const lineStyle: Style = {
    width: 2, 
    color: "black"
}

const hullLineStyle: Style = {
    width: 4,
    color: "red"
}

const GiftWrappingCanvas = () => {

    const [points, setPoints] = useState<Point[]>([])
    const [hullPoints, setHullPoints] = useState<Point[]>([])

    const [lines, setLines] = useState<Line[]>([])
    const [hullLines, setHullLines] = useState<Line[]>([])

    const canvas = useRef<HTMLCanvasElement>(null);
    let ctx : CanvasRenderingContext2D|null|undefined  = null;

    const handleMouseClick = useCallback ((event: MouseEvent) => {
        setPoints(points => [...points!, {x: event.clientX, y: event.clientY}])
        console.log("clicked")
    }, [])

    // initialize the canvas context
    useEffect(() => {
        // dynamically assign the width and height to canvas
        console.log("get ctx")
        const canvasEle = canvas.current;
        canvasEle!.width = canvasEle!.clientWidth;
        canvasEle!.height = canvasEle!.clientHeight;
        // get context of the canvas
        ctx = canvasEle!.getContext("2d");
        console.log(ctx)
    }, []);

    useEffect(() => {
        points?.map((point, idx) => drawPoint(point, pointStyle))
        hullPoints?.map((point, idx) => drawPoint(point, hullPointStyle))

        lines?.map((line, idx) => {drawLine(line, lineStyle)})
        hullLines?.map((line, idx) => {drawLine(line, hullLineStyle)})
    }, [points, hullPoints, lines, hullLines])


    useEffect(() => {
        window.addEventListener("mousedown", handleMouseClick)
        return () => {
            window.removeEventListener("mousedown", handleMouseClick)
        }
    }, [])


    useEffect(() => {
    
        drawPoint({x: 20, y:20}, pointStyle)
        drawLine({ x1: 300, y1: 250, x2: 260, y2: 70 }, { color: 'green', width: 5 });
     
      }, []);

    const drawLine = (line: Line, style: Style) => {
        ctx!.beginPath()
        const {x1, y1, x2, y2} = line
        ctx!.moveTo(x1, y1)
        ctx!.lineTo(x2, y2)
        ctx!.strokeStyle = style.color
        ctx!.lineWidth = style.width
        ctx!.stroke()
    }

    const drawPoint = (point: Point, style: Style) => {
        ctx!.beginPath()
        ctx!.arc(point.x, point.y,2, 0, 3*Math.PI, true)
        ctx!.strokeStyle = style.color 
        ctx!.lineWidth = style.width
        ctx!.fill()
    }

  return (
    <div>
        <canvas ref={canvas}>

        </canvas>
    </div>
  )
}

export default GiftWrappingCanvas