# IconSpace Icons

> React Icons for IconSpace

## Introduction

### Features

-   Provide more than 2000 icons
-   Provide 4 themes:
    -   outline
    -   filled
    -   two-tone
    -   multi-color

### More

Please visit [IconSpace](https://icon-space.github.io/doc/)

-   Copy SVG
-   Copy React Icon component
-   Copy Vue Icon component
-   Download PNG
-   Download SVG

## Getting Started

### Install

```
npm install @icon-space/react --save
```

### Include Component

Import an icon from `@icon-space/react`at the top of a component and then use it in the render function:

```
import {Home} from '@icon-space/react';

// examples
<Home/>
<Home theme="filled"/>
```

### Style Sheet

Import the icon style:

```typescript
import '@icon-space/react/styles/index.css'
```

Or

```typescript
import '@icon-space/react/styles/index.less'
```

### Global Config

You can use `IconProvider` in `@icon-space/react` to set the default config globally:

```typescript jsx
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-space/react'
import { Home } from '@icon-space/react'

const IconConfig = { ...DEFAULT_ICON_CONFIGS, prefix: 'icon' }

function App() {
    return (
        <IconProvider value={IconConfig}>
            <Home />
            <Home theme="filled" />
        </IconProvider>
    )
}
```

### Import on Demand

You can use [babel-plugin-import](https://github.com/ant-design/babel-plugin-import) to import icons on demand.

Set config like this:

```json
{
    "plugins": [
        [
            "import",
            {
                "libraryName": "@icon-space/react",
                "libraryDirectory": "es/icons",
                "camel2DashComponentName": false
            }
        ]
    ]
}
```

### Icon Component

We recommend loading icons on demand, because this can greatly reduce the volume of compiled code。
However, in some scenarios similar to remote loading menus, direct reference to all icons can reduce the development cost.

Usage:

```typescript jsx
import Icon, { IconType } from '@icon-space/react/es/all'
import React, { Fragment } from 'react'

export function Demo(props: { type: IconType }): JSX.Element {
    const { type } = props

    return (
        <Fragment>
            <Icon type={type} theme="filled" />
            <Icon type="AddText" theme="filled" />
            <Icon type="add-text" />
        </Fragment>
    )
}
```

You can do this when you are not sure whether the `type` property is legal:

```typescript jsx
import Icon, { ALL_ICON_KEYS, IconType } from '@icon-space/react/es/all'
import React, { Fragment } from 'react'

export function Demo(props: { type: IconType }): JSX.Element {
    const { type } = props

    if (ALL_ICON_KEYS.indexOf(type) < 0) {
        return <span>Not Exists</span>
    }

    return (
        <Fragment>
            <Icon type={type} theme="filled" />
            <Icon type="People" theme="filled" />
            <Icon type="Switch" />
        </Fragment>
    )
}
```

### Embed IconSpace in your project

If you need to use additional information such as icon name, author, category, label and creation time, you can use the `icons.json` file located in the root directory of each NPM.

## Props

| prop           | description                             | type                                                             | default        | note |
| -------------- | --------------------------------------- | ---------------------------------------------------------------- | -------------- | ---- |
| theme          | Theme of the icons.                     | 'outline' &#124; 'filled' &#124; 'two-tone' &#124; 'multi-color' | 'outline'      |
| size           | The width/height of the icon            | number &#124; string                                             | '1em'          |
| spin           | Rotate icon with animation              | boolean                                                          | false          |
| fill           | Colors of theme                         | string &#124; string[]                                           | 'currentColor' |
| strokeLinecap  | the stroke-linecap prop of svg element  | 'butt' &#124; 'round' &#124; 'square'                            | 'round'        |
| strokeLinejoin | the stroke-linejoin prop of svg element | 'miter' &#124; 'round' &#124; 'bevel'                            | 'round'        |
| strokeWidth    | the stroke-width prop of svg element    | number                                                           | 4              |

**Other props**

You can use all props which are defined in `HTMLAttributes<HTMLSpanElement>>`, such as:

-   className
-   style
-   onClick
-   ...
