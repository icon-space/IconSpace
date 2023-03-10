import fs from "fs";
import path from "path";
import { compiler } from './compiler'
import { IndexGenerator } from './generator/IndexGenerator'
import { LessGenerator } from './generator/LessGenerator'
import { ReactRuntimeGenerator } from './generator/ReactRuntimeGenerator'
import { SvgRuntimeGenerator } from './generator/SvgRuntimeGenerator'
import { VueRuntimeGenerator } from './generator/VueRuntimeGenerator'
import { VueNextRuntimeGenerator } from './generator/VueNextRuntimeGenerator'
import { pascalCase } from './util'

import { DynamicColorTransformer } from './transformer/DynamicColorTransformer'
import { RemoveConditionTransformer } from './transformer/RemoveConditionTransformer'
import { RemoveTagsTransformer } from './transformer/RemoveTagsTransformer'
import { RemovePropsTransformer } from './transformer/RemovePropsTransformer'
import { RemoveDataAttrTransformer } from './transformer/RemoveDataAttrTransformer'
import { DynamicSizeTransformer } from './transformer/DynamicSizeTransformer'
import { DynamicStrokeTransformer } from './transformer/DynamicStrokeTransformer'
import { UniqueIdTransformer } from './transformer/UniqueIdTransformer'
import { UniqueKeyframesIdTransformer } from './transformer/UniqueKeyframesIdTransformer'
import { RemoveCSSPrefixTransformer } from './transformer/RemoveCSSPrefixTransformer'
import { CamelTransformer } from './transformer/CamelTransformer'
import { DynamicHueTransformer } from './transformer/DynamicHueTransformer'
import { SyncGroupProps } from './transformer/SyncGroupProps'
import { ITransformPlugin } from './Transformer'

import { IIconColorHueInfo, IIconColorReplaceInfo, IRuntimeGeneratorOptions, IRuntimeOptions } from './generator/RuntimeGenerator'
import { IconGenerator } from './generator/IconGenerator'
import { JSXGenerator } from './generator/JSXGenerator'
import { SvgGenerator } from './generator/SvgGenerator'
import { FixMaskTypeTransformer } from './transformer/FixMaskTypeTransformer'


function getContent(fp: string):string {
    return fs.readFileSync(path.resolve(__dirname, fp), 'utf8')
}

const templateVueShimTsx = getContent('./template/vue-shim-tsx.d.ts.txt')
const templateVueIndex = getContent('./template/vue-index.ts.txt')
const templateVueAll = getContent('./template/vue-all.ts.txt')
const templateVueNextIndex = getContent('./template/vue-next-index.ts.txt')
const templateVueNextAll = getContent('./template/vue-next-all.ts.txt')
const templateSvgIndex = getContent('./template/svg-index.ts.txt')
const templateReactIndex = getContent('./template/react-index.ts.txt')
const templateReactAll = getContent('./template/react-all.ts.txt')

export interface IIconToolsOptions extends IRuntimeOptions {
    author: string
    type: 'react' | 'vue' | 'svg' | 'vue-next'
}

export type IconCompilerFunc = (info: IIconInfo) => string

export interface IIconFile {
    path: string
    mime: string
    content: string
}

export interface IIconInfo {
    name: string
    content: string
    description?: string
    rtl?: boolean
}

export class IconCompiler {
    public static instance(options: IIconToolsOptions): IconCompiler {
        return new IconCompiler(options)
    }

    private readonly options: IIconToolsOptions

    private readonly map: Record<string, string> = {}

    private readonly compiler: IconCompilerFunc

    private readonly runtimeCode: string

    private constructor(options: IIconToolsOptions) {
        this.options = options
        this.compiler = this.createCompiler()
        this.runtimeCode = this.createRuntimeCode()
    }

    public appendIcon(info: IIconInfo): void {
        this.map[info.name] = this.compiler(info)
    }

    public getIconCode(name: string): string {
        const svg = this.map[name]

        if (!this.map[name]) {
            throw new Error('call `this.appendIcon(' + name + ')` first')
        }

        return svg
    }

    public getIconFile(name: string): IIconFile {
        const svg = this.getIconCode(name)
        const { type, useType } = this.options
        const isSvg = type === 'svg'

        return {
            mime: 'image/svg+xml',
            path: `icons/${pascalCase(name)}.${useType ? 'ts' : 'js'}${isSvg ? '' : 'x'}`,
            content: svg
        }
    }

    public getIconFiles(): IIconFile[] {
        const list = Object.keys(this.map).map(key => this.getIconFile(key))

        list.push(this.getRuntimeFile(), this.getMapFile(), this.getIndexFile())

        if (this.options.type !== 'svg') {
            list.push(this.getLessFile())
        }

        const allFile = this.getAllFile()
        if (allFile) {
            list.push(allFile)
        }

        const shimFile = this.getShimTsxFile()
        if (shimFile) {
            list.push(shimFile)
        }

        return list
    }

    public getRuntimeCode(): string {
        return this.runtimeCode
    }

    public getRuntimeFile(): IIconFile {
        return {
            mime: 'text/javascript',
            path: `runtime/index.${this.options.useType ? 'ts' : 'js'}x`,
            content: this.getRuntimeCode()
        }
    }

    public getLessCode(): string {
        const { author, prefix = 'icon', cssPrefix = 'sit' } = this.options

        const generator = new LessGenerator({
            name: 'index',
            author,
            nameDisplayType: 'camel',
            description: '????????????',
            prefix,
            cssPrefix
        })

        return generator.process()
    }

    public getLessFile(): IIconFile {
        return {
            mime: 'text/css',
            path: 'runtime/index.less',
            content: this.getLessCode()
        }
    }

    public getMapFile(): IIconFile {
        return {
            mime: 'text/javascript',
            path: 'map.' + (this.options.useType ? 'ts' : 'js'),
            content: this.getIndexCode()
        }
    }

    public getIndexCode(): string {
        const { author, useType = false } = this.options

        const generator = new IndexGenerator({
            name: 'index',
            author,
            nameDisplayType: 'camel',
            description: '????????????',
            useType,
            icons: Object.keys(this.map)
        })

        return generator.process()
    }

    // ??????index??????
    public getIndexFile(): IIconFile {
        let content: string = ''
        if (this.options.type === 'vue') {
            content = templateVueIndex
        } else if (this.options.type === 'vue-next') {
            content = templateVueNextIndex
        } else if (this.options.type === 'react') {
            content = templateReactIndex
        } else if (this.options.type === 'svg') {
            content = templateSvgIndex
        }
        return {
            mime: 'text/javascript',
            path: 'index.' + (this.options.useType ? 'ts' : 'js'),
            content: content
        }
    }

    // ??????all??????
    public getAllFile(): IIconFile | null {
        let content: string = ''
        if (this.options.type === 'vue') {
            content = templateVueAll
        } else if (this.options.type === 'vue-next') {
            content = templateVueNextAll
        } else if (this.options.type === 'react') {
            content = templateReactAll
        } else if (this.options.type === 'svg') {
            return null
        }
        return {
            mime: 'text/javascript',
            path: 'all.' + (this.options.useType ? 'ts' : 'js'),
            content: content
        }
    }

    // ??????shim-tsx??????
    public getShimTsxFile(): IIconFile | null {
        if (this.options.type !== 'vue') {
            return null
        }
        return {
            mime: 'text/javascript',
            path: 'shim-tsx.d.' + (this.options.useType ? 'ts' : 'js'),
            content: templateVueShimTsx
        }
    }

    private createCompiler(): IconCompilerFunc {
        const {
            options: { type, colors = [], stroke = 0, fixedSize = false, style = false, strokeLinecap, strokeLinejoin }
        } = this

        const hueList: IIconColorHueInfo[] = []

        const replaceList: IIconColorReplaceInfo[] = []

        colors.forEach(item => {
            if (item.type === 'hue') {
                hueList.push(item)
            } else {
                replaceList.push(item)
            }
        })

        const isSvg = type === 'svg'

        return ({ name, content, description = name, rtl = false }) => {
            const plugins: ITransformPlugin[] = []

            // ?????????????????????
            plugins.push(RemoveTagsTransformer({ tags: ['title', 'desc', 'a', 'metadata'] }))

            // ?????????????????????????????????????????????react??????xmlns?????????
            plugins.push(
                RemovePropsTransformer({
                    props: ['version', 'xmlns:xlink'].concat(isSvg ? [] : ['xmlns'])
                })
            )

            // ??????mask-type???????????????
            plugins.push(FixMaskTypeTransformer())

            // data?????????????????????
            plugins.push(RemoveDataAttrTransformer())

            // ???????????????????????????????????????Hue????????????
            if (replaceList.length) {
                plugins.push(
                    DynamicColorTransformer({
                        prefix: true,
                        array: true,
                        colors: replaceList.map(item => item.color),
                        ignore: info => info.attrs.some(item => item.name === 'fill-opacity' && item.expression === '0.01')
                    })
                )
            }

            // ????????????????????????
            if (hueList.length) {
                plugins.push(
                    DynamicHueTransformer({
                        prefix: true,
                        hueList: hueList.map(item => item.hue),
                        forceReplaceColor: false
                    })
                )
            }

            // ???????????????ID
            plugins.push(UniqueIdTransformer({ prefix: true, removeUnusedIds: true }))

            // ??????CSS??????
            if (style) {
                plugins.push(UniqueKeyframesIdTransformer({ prefix: true }))
                plugins.push(RemoveCSSPrefixTransformer())
            }

            // size??????
            plugins.push(
                DynamicSizeTransformer({
                    prefix: true,
                    widthName: fixedSize ? 'size' : 'width',
                    heightName: fixedSize ? 'size' : 'height'
                })
            )

            // ????????????
            plugins.push(
                DynamicStrokeTransformer({
                    prefix: true,
                    disableStroke: !stroke,
                    disableStrokeLinejoin: !strokeLinejoin,
                    disableStrokeLinecap: !strokeLinecap
                })
            )

            // ?????????????????????Rect
            if (!isSvg) {
                plugins.push(
                    RemoveConditionTransformer({
                        tag: 'rect',
                        condition: info => info.attrs.some(item => item.name === 'fill-opacity' && item.expression === '0.01')
                    })
                )
            }

            if (isSvg) {
                plugins.push(
                    SyncGroupProps({
                        attrNames: ['stroke-linecap', 'stroke-linejoin', 'stroke-width', 'stroke', 'fill', 'fill-rule']
                    })
                )
            }

            // React???????????????????????????
            if (!isSvg) {
                const namespaceOnly = type === 'vue' || type === 'vue-next'
                plugins.push(CamelTransformer({ namespace: true, namespaceOnly: namespaceOnly }))
            }

            let generator: IconGenerator =
                type === 'vue'
                    ? this.createVueGenerator(name, description, rtl)
                    : type === 'vue-next'
                    ? this.createVueNextGenerator(name, description, rtl)
                    : type === 'react'
                    ? this.createReactGenerator(name, description, rtl)
                    : this.createSvgGenerator(name, description)

            return compiler({
                content,
                plugins,
                generator
            })
        }
    }

    private createSvgGenerator(name: string, description: string): SvgGenerator {
        const { author, style = false, prefix = 'icon', useType = false } = this.options

        return new SvgGenerator({
            name,
            author,
            nameDisplayType: 'pascal',
            useDefault: true,
            useType,
            style,
            prefix,
            wrapperNeedName: true,
            wrapperNeedRTL: false,
            description,
            rtl: false,
            importPath: '../runtime'
        })
    }

    private createReactGenerator(name: string, description: string, rtl: boolean): JSXGenerator {
        const { author, style = false, prefix = 'icon', useType = false } = this.options

        return new JSXGenerator({
            name,
            author,
            rtl,
            nameDisplayType: 'pascal',
            useDefault: true,
            useType,
            style,
            prefix,
            wrapperNeedName: true,
            wrapperNeedRTL: true,
            extraImport: ["import React from 'react';"],
            description,
            importPath: '../runtime'
        })
    }

    private createVueGenerator(name: string, description: string, rtl: boolean): JSXGenerator {
        const { author, style = false, prefix = 'icon', useType = false } = this.options

        return new JSXGenerator({
            name,
            author,
            rtl,
            prefix,
            nameDisplayType: 'pascal',
            useDefault: true,
            useType,
            useHelper: true,
            wrapperNeedName: true,
            wrapperNeedRTL: true,
            style,
            description,
            importPath: '../runtime'
        })
    }

    private createVueNextGenerator(name: string, description: string, rtl: boolean): JSXGenerator {
        const { author, style = false, prefix = 'icon', useType = false } = this.options

        return new JSXGenerator({
            name,
            author,
            rtl,
            prefix,
            nameDisplayType: 'pascal',
            useDefault: true,
            useType,
            useHelper: false,
            wrapperNeedName: true,
            wrapperNeedRTL: true,
            style,
            description,
            importPath: '../runtime'
        })
    }

    private createRuntimeCode(): string {
        const {
            author,
            type,
            colors = [],
            prefix = 'icon',
            stroke = 0,
            theme = [],
            fixedSize = false,
            style = false,
            cssPrefix = 'sit',
            strokeLinecap,
            strokeLinejoin,
            useType = false
        } = this.options

        const baseOptions: IRuntimeGeneratorOptions = {
            name: 'runtime',
            author,
            nameDisplayType: 'camel',
            description: '?????????',
            useType,
            colors,
            prefix,
            cssPrefix,
            stroke,
            theme,
            fixedSize,
            style,
            strokeLinecap,
            strokeLinejoin,
            wrapperNeedName: true
        }

        const generator =
            type === 'vue'
                ? new VueRuntimeGenerator({
                      ...baseOptions,
                      wrapperNeedRTL: true
                  })
                : type === 'vue-next'
                ? new VueNextRuntimeGenerator({
                      ...baseOptions,
                      wrapperNeedRTL: true
                  })
                : type === 'react'
                ? new ReactRuntimeGenerator({
                      ...baseOptions,
                      wrapperNeedRTL: true
                  })
                : new SvgRuntimeGenerator({
                      ...baseOptions
                  })

        return generator.process()
    }
}
