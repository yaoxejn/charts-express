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
- Set the URI to http://localhost:\<port\>/. For example, http://localhost:3000/echartsapi/customize/basic.
- Select the Body tab.
- Select the raw radio button.
- Set the type to JSON (application/json).  For example:

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

- Select the Auth tab, and select "Bearer Token" from the Type dropdown list. The Token could be one of  the keys in the file (src/data/keys.json) by default, for example, A3E2AD92A8714D099C4B5FFAF77161E8. You could create your own API authentication, such as JWT , API Key and Basic Auth.
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

All theme files are located in the directory (src/theme/echarts). Putting your own theme file to the directory so that the application will support the theme directly.

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
