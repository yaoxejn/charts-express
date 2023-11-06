import { Router } from 'express'
import { Render } from '../charts/echartsRenderer'
import { getRenderer, getImageFormat, ImageFormat } from '../utils/echartsUtils'
import { EchartsRenderCallback } from '../charts'

export const router = Router()

router.post('/basic', async (req, res) => {
    const width = req.body.width
    const height = req.body.height
    const option = req.body.option

    const config = {
        width, // Image width, type is number.
        height, // Image height, type is number.
        option, // Echarts configuration, type is Object.
        theme: req.body.theme ? req.body.theme : '',
        fontFamily: req.body.fontFamily
    }

    const renderer = getRenderer(req.body.renderer)
    const formatter = getImageFormat(req.body.renderer)

    let cb: EchartsRenderCallback
    await Render(config as any, src => cb = src, renderer, formatter, req.body.func)

    res.json({
        result: !!cb!.base64,
        useCanvas: cb!.useCanvas,
        funcError: cb!.funcError,
        base64: cb!.base64
    })
})

router.post('/basic-full', async (req, res) => {
    const width = req.body.width
    const height = req.body.height
    const option = req.body.option

    const config = {
        width, // Image width, type is number.
        height, // Image height, type is number.
        option, // Echarts configuration, type is Object.
        theme: req.body.theme ? req.body.theme : '',
        fontFamily: req.body.fontFamily
    }

    const renderer = getRenderer(req.body.renderer)
    const formatter = getImageFormat(req.body.renderer)

    let cb: EchartsRenderCallback
    await Render(config as any, src => cb = src, renderer, formatter, req.body.func)

    let output = ''
    if(req.body.output)
        output = req.body.output
    
    if(output === ''){
        res.json({
            result: !!cb!.base64,
            useCanvas: cb!.useCanvas,
            funcError: cb!.funcError,
            base64: cb!.base64
        })
    }
    else {
        const rs = !!cb!.base64
        if(!rs){
            res.status(500).json({
                result: false,
                message: 'Something wrong!'
            })
        }
        else if (cb!.useCanvas){
            let type = formatter === ImageFormat.Png ?  "image/png": "image/jpeg"

            res.writeHead(200, {
                'Content-Type': type
            })
            const buffer = formatter === ImageFormat.Png? 
                cb!.canvas!.toBuffer('image/png') :
                cb!.canvas!.toBuffer('image/jpeg')
            res.write(buffer)
            res.end()
        }
        else{
            res.writeHead(200, {
                'Content-Type': 'application/xml'
            })
            res.write(cb!.base64)
            res.end()
        }
    }
})