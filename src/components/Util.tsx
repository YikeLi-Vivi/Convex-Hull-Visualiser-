interface Point {
    x: number,
    y: number 
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
    
    if (d == 0) {
        return 0
    }

    if (d < 0) {
        return -1
    }
}

export const refresh = () => {
    window.location.reload()
}

export const sleep = (ms: number)  => {
    return new Promise(resolve => setTimeout(resolve, ms))
}