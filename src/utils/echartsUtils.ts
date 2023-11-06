import { Canvas } from 'canvas'

/**
 * modify backgroud color
 * @param src 
 * @param color 
 * @returns 
 */
export const setBgColor = (src: any, color: string = 'transparent') => {
    if (!src) return

    if (src instanceof Array) {
        for (const i of src)
            i.backgroundColor = color
    } else {
        src.backgroundColor = color
    }
}

/**
 * set backgroud color with transparent
 * @param src 
 * @returns 
 */
export const setBgTransparent = (src: any) => setBgColor(src)

export const savePngBase64 = (canvas: Canvas) => canvas.toDataURL("image/png")

export const saveJpgBase64 = (canvas: Canvas) => canvas.toDataURL("image/jpeg", 1)

/** Supported image format */
const supportedFormat = ['svg', 'canvas', 'jpg', 'jpeg', 'png']

/**
 * getRenderer result will be ['canvas'|'svg'|'jpg'|'jpeg'|'png']
 * @param {string}  
 * @returns 
 */
export const getRenderer = (src: string) => {
    if (src && src.length > 0) {
        src = src.toLowerCase()
        const existed = supportedFormat.indexOf(src) >= 0
        if (!existed || src === 'svg')
            return 'svg'
        else
            return 'canvas'
    }
    return 'svg'
}

/** Image format */
export enum ImageFormat {
    Jpeg,
    Png
}

/** Get Image Format */
export const getImageFormat = (src?: string) => {
    if (!src) return undefined
    src = src.toLowerCase()
    switch (src) {
        case 'png':
            return ImageFormat.Png
        case 'jpg':
        case 'jpeg':
            return ImageFormat.Jpeg
        default:
            return ImageFormat.Png
    }
}

export const isFunc = (src: string) => src && typeof src === 'string' && src.length > 1