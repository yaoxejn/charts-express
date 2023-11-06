import { Canvas } from 'canvas'
import { ECharts, EChartsOption } from 'echarts'

interface EchartsRenderConfig {
    width: number
    height: number
    option: EChartsOption
    theme: string,
    fontFamily?: string
}

interface EchartsRenderCallback {
    chart: ECharts | null
    canvas: Canvas | null
    useCanvas: boolean
    funcError: boolean
    base64: string
}