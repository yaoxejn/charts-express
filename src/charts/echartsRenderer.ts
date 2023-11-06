import * as echarts from 'echarts'
import { Canvas, createCanvas } from 'canvas'
import { EchartsRenderConfig, EchartsRenderCallback } from '.'
import { EChartsOption } from 'echarts'
import { ImageFormat, isFunc, saveJpgBase64, savePngBase64, setBgTransparent } from '../utils/echartsUtils'

const assign = (src: EchartsRenderConfig, tar: EchartsRenderConfig) => Object.assign({} as EchartsRenderConfig, src, tar)

/**
 * @param config = {
        width: 500 // Image width, type is number.
        height: 500 // Image height, type is number.
        option: {}, // Echarts configuration, type is Object.
    }
    @param onRendered = {
        canvas: Canvas instance.
        element: HtmlElement instance which contains chart object. 
    }
 *
 */

export const Render = async (srcCfg: EchartsRenderConfig, onRendered: (done: EchartsRenderCallback) => void, renderer: 'svg' | 'canvas' = 'svg', format?: ImageFormat, funcExpr?: string) => {
    const opt: EChartsOption = {
        title: { text: 'test' },
        tooltip: { show: false },
        legend: {},
        xAxis: {
            data: ['a', 'b', 'c']
        },
        yAxis: {},
        series: [
            {
                name: 'test',
                type: 'bar',
                data: [5, 20, 36]
            }
        ]
    }

    const defCfg: EchartsRenderConfig = {
        width: 930, height: 480, option: opt, theme: ''
    }

    const config = assign(defCfg, srcCfg)

    const useSVG = renderer === 'svg'
    const useCanvas = !useSVG
    const option = config.option

    if (!option.backgroundColor) {
        option.backgroundColor = '#fff'
    }

    setBgTransparent(option.title)
    setBgTransparent(option.legend)
    setBgTransparent(option.grid)

    option.silent = true
    option.animation = false
    option.textStyle = {
        fontFamily: config.fontFamily ? config.fontFamily : process.env.FontFamily || 'sans-serif'
    }

    let chart: echarts.ECharts | null = null
    let canvas: Canvas | null = null //createCanvas(10, 10)
    let requireTheme = !!config.theme && config.theme.length > 0
    let funcError = false

    try {

        if (requireTheme) {
            await import(`../theme/echarts/${config.theme}.js`);
        }

        if (useCanvas) {
            canvas = createCanvas(config.width, config.height)
            chart = echarts.init(canvas as any, requireTheme ? config.theme : null, {
                renderer
            })
        } else {
            // useSVG
            chart = echarts.init(null, requireTheme ? config.theme : null, {
                renderer,
                ssr: true,
                width: config.width,
                height: config.height
            })
        }

        let AllowRunFunc = false;
        if (!!process.env.AllowRunFunc)
            AllowRunFunc = (/true/i).test(process.env.AllowRunFunc)

        if (AllowRunFunc && !!funcExpr && isFunc(funcExpr)) {
            try {
                eval(funcExpr)
            }
            catch (err) {
                funcError = true
                throw err
            }
        }

        chart.setOption(option as any)

        //calc base64
        let base64 = ''
        if (useSVG) {
            base64 = chart.renderToSVGString()
        }
        else {
            switch (format) {
                case ImageFormat.Jpeg:
                    base64 = saveJpgBase64(canvas!)
                    break
                case ImageFormat.Png:
                default:
                    base64 = savePngBase64(canvas!)
                    break
            }
        }
        onRendered({ chart, canvas, useCanvas, funcError, base64 })
    } catch (err) {
        console.log(err)
        onRendered({ chart, canvas, useCanvas, funcError, base64: '' })
    } finally {
        chart?.dispose()
    }
}