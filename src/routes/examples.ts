import { Router } from 'express'
import { Render } from '../charts/echartsRenderer'
import { getRenderer, getImageFormat } from '../utils/echartsUtils'
import { EchartsRenderCallback } from '../charts'

export const router = Router()
router.post('/rainfall', async (req, res) => {

    //define custom parameters
    const body = req.body
    const width = body.width
    const height = body.height
    const title = body.title
    const subTitle = body.subTitle
    const legend = body.legend
    const xAxis = body.xAxis
    const data = body.data
    const minValue = body.minValue
    const maxValue = body.maxValue

    // define custom echart option object
    const opt = {
        title: {
            text: title,//'Rainfall vs Evaporation',
            subtext: subTitle, //'Fake Data',
            left: 'center'
        },
        legend: {
            top: 'bottom',
            data: legend // ['Rainfall', 'Evaporation']
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            data: xAxis // ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }],
        yAxis: [{ type: 'value', }],
        series: [{
            name: legend[0], // 'Rainfall',
            type: 'bar',
            data: data[0], // [ 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3 ],
            markPoint: {
                data: [{
                    type: 'max',
                    name: 'Max'
                },
                {
                    type: 'min',
                    name: 'Min'
                }
                ]
            },
            markLine: {
                data: [{
                    type: 'average',
                    name: 'Avg'
                }]
            }
        },
        {
            name: legend[1], // 'Evaporation',
            type: 'bar',
            data: data[1], // [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            markPoint: {
                data: [{
                    name: 'Max',
                    value: maxValue.value, // 182.2,
                    xAxis: minValue.x,     //7,
                    yAxis: minValue.y      //183
                },
                {
                    name: 'Min',
                    value: minValue.value, // 2.3,
                    xAxis: minValue.x,     //11,
                    yAxis: minValue.y      //3
                }]
            },
            markLine: {
                data: [{
                    type: 'average',
                    name: 'Avg'
                }]
            }
        }
        ]
    }

    // below shows how to use echartsRenderer.Render method
    const config = {
        width, // Image width, type is number.
        height, // Image height, type is number.
        option: opt, // Echarts configuration, type is Object.
        theme: '',
        fontFamily: undefined
    }

    if (req.body.theme) { config.theme = req.body.theme }
    if (req.body.fontFamily) config.fontFamily = req.body.fontFamily

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