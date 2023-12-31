# charts-express

`express webapi` +  `echarts` boilerplate.

## Features

- Out of the box
- Support all official themes
- It's easy to develop own echarts.js api

## Quick Setup

```sh
# clone the project
git clone https://github.com/yaoxejn/charts-express.git

# enter the project directory
cd charts-express

# install dependency
npm install

# build app
npm run build

# run app
npm run start

```

## Parameters

| Name        | Type                 | Default                     |
| ------------| :------------------: | --------------------------- |
| width       | number               | 930                         |
| height      | number               | 480                         |
| theme       | string               | ''                          |
| renderer    | string               | svg [svg, png, jpg]         |
| output      | string               | ''                          |
| option      | any                  | required                    |
| func        | string               | '' optional (not recommend) |

## How to use

### Step 1

Run the app

```sh
npm run start

```

### Step 2

Test with Postman

- Create a new request.
- Set the HTTP method to POST.
- Set the URI to http://localhost:<port\>/. For example, http://localhost:3000/echartsapi/customize/basic.
- Select the Body tab.
- Select the raw radio button.
- Set the type to JSON (application/json).  For example: (which cames from offical example [***bar-y-category-stack***](https://echarts.apache.org/examples/zh/editor.html?c=bar-y-category-stack))

``` json
{
    "width": 930,
    "height": 450,
    "renderer": "svg",
    "theme": "blue",
    "fontFamily":"",
    "option": {
        "legend": {},
        "grid": {
            "left": "3%",
            "right": "4%",
            "bottom": "3%",
            "containLabel": true
        },
        "xAxis": {
            "type": "value"
        },
        "yAxis": {
            "type": "category",
            "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        "series": [
            {
            "name": "Direct",
            "type": "bar",
            "stack": "total",
            "label": {
                "show": true
            },
            "data": [320, 302, 301, 334, 390, 330, 320]
            },
            {
            "name": "Mail Ad",
            "type": "bar",
            "stack": "total",
            "label": {
                "show": true
            },
            "data": [120, 132, 101, 134, 90, 230, 210]
            },
            {
            "name": "Affiliate Ad",
            "type": "bar",
            "stack": "total",
            "label": {
                "show": true
            },
            "data": [220, 182, 191, 234, 290, 330, 310]
            },
            {
            "name": "Video Ad",
            "type": "bar",
            "stack": "total",
            "label": {
                "show": true
            },
            "data": [150, 212, 201, 154, 190, 330, 410]
            },
            {
            "name": "Search Engine",
            "type": "bar",
            "stack": "total",
            "label": {
                "show": true
            },
            "data": [820, 832, 901, 934, 1290, 1330, 1320]
            }
        ]
    }
}

```

- Select the Auth tab, and select "Bearer Token" from the Type dropdown list. The Token could be one of  the keys in the file [keys.json](./src/data/keys.json) by default, for example, A3E2AD92A8714D099C4B5FFAF77161E8. You could create your own API authentication, such as JWT , API Key and Basic Auth.
- Select Send.

In this case, the result will be a JSON like below:

``` json
{
    "result": true,
    "useCanvas": false,
    "funcError": false,
    "base64": "<svg width=\"930\" height=\"450\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" baseProfile=\"full\" viewBox=\"0 0 930 450\">\n<rect width=\"930\" height=\"450\" x=\"0\" y=\"0\" id=\"0\" fill=\"#fff\"></rect>...</svg>"
}

```

Result
![Result(SVG)](./images/example_1.svg)

Other example is to output file directly by using parameter output through URL http://localhost:3000/echartsapi/customize/basic-full.

``` json
{
    "width": 930,
    "height": 450,
    "renderer": "svg",
    "theme": "shine",
    "fontFamily":"",
    "output": "file",
    "option": {
        ......
    }
}
```

### Custom your own api

There is an [example](./src/routes/examples.ts).
URL: http://localhost:3000/echartsapi/examples/rainfall

```json
{
    "width": 930,
    "height": 320,
    "theme": "royal",
    "title": "Rainfall title",
    "subTitle": "Rainfall subtitle",
    "legend": ["2020","2021"],
    "xAxis": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "data":[
        [ 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3 ],
        [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    ],
    "maxValue": {
        "value": 182.2, "x": 7, "y": 183
    },
    "minValue": {
        "value": 2.3, "x": 11, "y": 3
    }
}
```

Result
![Result(SVG)](./images/rainfall.svg)

#### 1. Ceate route in directory (src/routes)

``` ts
import { Router } from 'express'
import { Render } from '../charts/echartsRenderer'
import { getRenderer, getImageFormat } from '../utils/echartsUtils'
import { EchartsRenderCallback } from '../charts'

export const router = Router()

router.post('/<your path>', async (req, res) => {
    
    //define custom parameters
    const body = req.body
    const width = body.width
    const height = body.height
    const title = body.title
    const subTitle = body.subTitle

    ......

    // define custom echart option object with those parameters before
    const opt = {
        ......
    }

    // define render Config object
    const config = {
        width, // Image width, type is number.
        height, // Image height, type is number.
        option: opt, // Echarts configuration, type is Object.
        theme: '',
        fontFamily: undefined
    }

    // using theme and fontFamily if exist
    if (req.body.theme) { config.theme = req.body.theme }
    if (req.body.fontFamily) config.fontFamily = req.body.fontFamily

    // call Render() and reutrn json result
    let cb: EchartsRenderCallback
    await Render(config as any, src => cb = src, renderer, formatter, req.body.func)

    res.json({
        result: !!cb!.base64,
        useCanvas: cb!.useCanvas,
        funcError: cb!.funcError,
        base64: cb!.base64
    })
}

```

#### 2. Add route into express
Modify [index.ts](./src/index.ts)

``` ts
    ......
    import { router as <alias-name> } from './routes/<file-name>'

    ......
    app.use('/echartsapi/<path>', <alias-name>)

```

### About Echarts Theme

The application supported all offical themes by using parameter theme. For example:

``` json
{
    "width": 930,
    "height": 450,
    ......
    "theme": "macarons",
    ...
}
```

All theme files are located in the directory [src/theme/echarts](./src/theme/echarts). Putting your own theme file to the directory so that the application will support those theme directly.

```diff
  ├─┬ src
  │ └─┬ theme
  │   └─┬ echarts
  │     ├──azul.js
  │     ├──bee-inspired.js
  │     ├──blue.js
  │     ├──caravan.js
  │     ├──carp.js
  │     ├──cool.js
  │     ├──dark-blue.js
  │     ├──dark-bold.js
  │     ├──dark-digerati.js
  │     ├──dark-fresh-cut.js
  │     ├──dark-mushroom.js
  │     ├──dark.js
  │     ├──eduardo.js
  │     ├──forest.js
  │     ├──fresh-cut.js
  │     ├──fruit.js
  │     ├──gray.js
  │     ├──green.js
  │     ├──helianthus.js
  │     ├──infographic.js
  │     ├──inspired.js
  │     ├──jazz.js
  │     ├──list.txt
  │     ├──london.js
  │     ├──macarons.js
  │     ├──macarons2.js
  │     ├──mint.js
  │     ├──red-velvet.js
  │     ├──red.js
  │     ├──roma.js
  │     ├──royal.js
  │     ├──sakura.js
  │     ├──shine.js
  │     ├──tech-blue.js
  │     ├──vintage.js

```

NOTE:
the following coding in the theme files:

```js
factory(exports, require('echarts/lib/echarts'));
```

must change to:

```js
factory(exports, require('echarts'));
```

## License

[MIT](LICENSE).
