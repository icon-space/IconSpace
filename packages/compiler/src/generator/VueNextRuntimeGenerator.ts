import { RuntimeGenerator } from './RuntimeGenerator'

export class VueNextRuntimeGenerator extends RuntimeGenerator {
    protected processPlatformImports(): void {
        if (this.useType) {
            this.writeLine("import {ComponentOptions, DefineComponent, inject, provide} from '@vue/runtime-dom';")
            this.writeLine()
            this.writeLine('type NonAny = number | boolean | string | symbol | null;')
            this.writeLine(`type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends NonAny[] // checks for nested any[]
        ? T[P]
        : T[P] extends ReadonlyArray<NonAny> // checks for nested ReadonlyArray<any>
            ? T[P]
            : T[P] extends Date // checks for Date
                ? T[P]
                : T[P] extends (infer U)[]
                    ? DeepPartial<U>[]
                    : T[P] extends ReadonlyArray<infer U>
                        ? ReadonlyArray<DeepPartial<U>>
                        : T[P] extends Set<infer V> // checks for Sets
                            ? Set<DeepPartial<V>>
                            : T[P] extends Map<infer K, infer V> // checks for Maps
                                ? Map<K, DeepPartial<V>>
                                : T[P] extends NonAny // checks for primative values
                                    ? T[P]
                                    : DeepPartial<T[P]>; // recurse for all non-array, non-date and non-primative values
};`)
        }

        this.writeLine()
    }

    protected processPlatformTypes(): void {
        this.writeLine('// 包裹后的图标属性')
        this.writeLine(`export interface ${this.getInterfaceName('props')} extends ${this.getInterfaceName('base')} {`)
        this.indent(1)
        this.writeLine('spin?: boolean;')
        this.indent(-1)
        this.writeLine('}')
        this.writeLine()

        // this.writeLine('// 渲染Help函数属性')
        // this.writeLine(`export type ${this.getTypeName('helper')} = CreateElement;`)
        // this.writeLine()

        this.writeLine('// 包裹后的图标属性')
        this.writeLine(`export type ${this.getTypeName('options')} = ComponentOptions<${this.getInterfaceName('props')}>`)
        this.writeLine()

        this.writeLine('// 包裹前的图标渲染器')
        this.writeLine(`export type ${this.getTypeName('render')} = (props: ${this.getInterfaceName('props', true)}) => JSX.Element`)
        this.writeLine()

        this.writeLine('// 包裹后的图标')
        this.writeLine(`export type ${this.getTypeName('')} = DefineComponent<${this.getInterfaceName('props')}>`)
        this.writeLine()

        this.writeLine(`const IconContext = Symbol('icon-context')`)
        this.writeLine()

        this.writeLine('// 图标配置Provider')
        this.writeLine(`export const ${this.getTypeName('provider')} = (config: DeepPartial<${this.getInterfaceName('config')}>) => {`)
        this.indent(1)
        this.writeLine(`provide(${this.getTypeName('context')}, config)`)
        this.indent(-1)
        this.writeLine('}')
        this.writeLine()
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected processPlatformCode(): void {}

    protected processPlatformWrapper(): void {
        const { prefix, wrapperNeedName, wrapperNeedRTL } = this

        this.writeLine()
        this.writeLine(`const options: ${this.getTypeName('options')} = {`)
        this.indent(1)

        // 处理name
        this.writeLine(`name: '${prefix}-' + name,`)

        // 处理属性
        this.writeLine(
            `props: [${this.getPropKeys()
                .map(item => `'${item}'`)
                .join(', ')}, 'spin'],`
        )

        // 继承属性
        this.writeLine('inheritAttrs: false,')

        // 处理数据
        this.writeLine('setup(props) {')
        this.indent(1)

        this.writeLine()
        this.writeLine('const id = guid();')

        this.writeLine()
        this.writeLine('const ICON_CONFIGS = inject(IconContext, DEFAULT_ICON_CONFIGS);')

        this.writeLine()
        this.writeLine('return () => {')
        this.indent(1)

        this.writeLine()
        this.writeLine(
            `const {${this.getPropKeys()
                .map(item => `${item}`)
                .join(', ')}, spin} = props;`
        )

        this.writeLine()
        // 生成渲染属性
        this.writeLine(`const svgProps = ${this.getTypeName('converter')}(id, {`)
        this.indent(1)
        this.getPropKeys().forEach((key, index, { length }) => {
            this.writeLine(key + (index !== length - 1 ? ',' : ''))
        })
        this.indent(-1)
        this.writeLine(`}, ${this.prefix.toUpperCase()}_CONFIGS);`)
        this.writeLine()

        // 生成className
        if (this.useType) {
            this.writeLine(`const cls: string[] = [${this.getClassName()}];`)
        } else {
            this.writeLine(`const cls = [${this.getClassName()}];`)
        }

        if (wrapperNeedName) {
            this.writeLine()
            this.writeLine(`cls.push(${this.getClassName()} + '-' + name);`)
        }

        if (wrapperNeedRTL) {
            this.writeLine()
            this.writeLine(`if (rtl && ${this.prefix.toUpperCase()}_CONFIGS.rtl) {`)
            this.indent(1)
            this.writeLine(`cls.push(${this.getClassName('rtl')});`)
            this.indent(-1)
            this.writeLine('}')
        }

        this.writeLine()
        this.writeLine('if (spin) {')
        this.indent(1)
        this.writeLine(`cls.push(${this.getClassName('spin')});`)
        this.indent(-1)
        this.writeLine('}')

        this.writeLine()
        this.writeLine('return (')
        this.indent(1)
        this.writeLine("<span class={cls.join(' ')}>")
        this.indent(1)
        this.writeLine('{render(svgProps)}')
        this.indent(-1)
        this.writeLine('</span>')
        this.indent(-1)
        this.writeLine(');')

        this.indent(-1)
        this.writeLine('}')

        this.indent(-1)
        this.writeLine('}')

        this.indent(-1)
        this.writeLine('};')

        this.writeLine()
        this.writeLine(`return options as ${this.getTypeName('')};`)
    }
}
