/**
 * @file build-code
 */

import { IconCompiler, IIconToolsOptions } from '@icon-space/compiler'
import fs from 'fs'
import p from 'path'
import mkdirp from 'mkdirp'
import icons from '../source/icons.json'
import iconsConfig from '../source/icons-config.json'

const iconsJson = JSON.stringify(iconsConfig, null, 4)

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8')
}

export const BUILD_CONFIG: Omit<IIconToolsOptions, 'type'> = {
    author: 'IconSpace',
    useType: true,
    fixedSize: true,
    stroke: 4,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
    cssPrefix: 'i',
    colors: [
        {
            type: 'color',
            color: '#000'
        },
        {
            type: 'color',
            color: '#2F88FF'
        },
        {
            type: 'color',
            color: '#FFF'
        },
        {
            type: 'color',
            color: '#43CCF8'
        }
    ],
    theme: [
        {
            name: 'outline',
            fill: [
                {
                    type: 'color',
                    color: '#333',
                    name: 'fill',
                    currentColor: true
                },
                {
                    type: 'color',
                    color: 'transparent',
                    fixed: true,
                    name: 'background'
                }
            ],
            order: [0, 1, 0, 1]
        },
        {
            name: 'filled',
            fill: [
                {
                    type: 'color',
                    color: '#333',
                    name: 'fill',
                    currentColor: true
                },
                {
                    type: 'color',
                    color: '#FFF',
                    fixed: true,
                    name: 'background'
                }
            ],
            order: [0, 0, 1, 1]
        },
        {
            name: 'two-tone',
            fill: [
                {
                    type: 'color',
                    color: '#333',
                    name: 'fill',
                    currentColor: true
                },
                {
                    type: 'color',
                    color: '#2F88FF',
                    name: 'twoTone'
                }
            ],
            order: [0, 1, 0, 1]
        },
        {
            name: 'multi-color',
            fill: [
                {
                    type: 'color',
                    color: '#333',
                    name: 'outStrokeColor',
                    currentColor: true
                },
                {
                    type: 'color',
                    color: '#2F88FF',
                    name: 'outFillColor'
                },
                {
                    type: 'color',
                    color: '#FFF',
                    name: 'innerStrokeColor'
                },
                {
                    type: 'color',
                    color: '#43CCF8',
                    name: 'innerFillColor'
                }
            ],
            order: [0, 1, 2, 3]
        }
    ]
}

export const SUPPORT_PLATFORMS: ['react', 'vue', 'svg', 'vue-next'] = ['react', 'vue', 'svg', 'vue-next']

SUPPORT_PLATFORMS.forEach(type => {
    const compiler = IconCompiler.instance({
        ...BUILD_CONFIG,
        type
    })

    icons.forEach((item: { name: any; title: any; svg: any; rtl: any }) =>
        compiler.appendIcon({
            name: item.name,
            description: item.title,
            content: item.svg,
            rtl: item.rtl
        })
    )

    const files = compiler.getIconFiles()

    files.forEach(({ path, content }) => {
        const fp = p.join(__dirname, '../packages', type, 'src', path)
        mkdirp.sync(p.dirname(fp))
        fs.writeFileSync(fp, content, 'utf8')
    })

    const fp = p.join(__dirname, '../packages', type, 'icons.json')
    fs.writeFileSync(fp, iconsJson, 'utf8')
})
