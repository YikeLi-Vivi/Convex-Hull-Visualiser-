export interface Color {
    r: number, 
    g: number,
    b: number 
}

export const ColorDict = {
    ACTIVE_LINE: {r: 47, g:196, b:178}, 
    RESULT_LINE: {r: 241, g: 120, b:8},
    CHECK_LINE : {r: 155, g: 191, b: 0},
    ORIGINAL_POINT: {r: 255, g: 255, b:255},
    ACTIVE_POINT: {r:207, g: 253, b: 225},
    RESULT_POINT: {r:254, g: 208, b: 73},

}


export const DimensionDict = {
    ACTIVE_LINE_WIDTH: 4,
    RESULT_LINE_WIDTH: 2, 
}
