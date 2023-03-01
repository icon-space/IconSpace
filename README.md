# IconSpace

This project is derived from [iconpark](https://github.com/bytedance/iconpark), and is transformed and expanded on this basis.

English | [简体中文](README.zh.md)


### Packages
#### Generate Cross-platform Components

Find packages in `packages` folder. NPM packages make it painless to import icon components to your project.

| Name | Github link | NPM link                                                                  |
| ------- | --- |---------------------------------------------------------------------------|
| React Icons | [React Component](./packages/react/README.md)  | [@icon-space/react](https://www.npmjs.com/package/@icon-space/react)      |
| Vue2 Icons | [Vue Component for old Vue2.0](./packages/vue/README.md) | [@icon-space/vue](https://www.npmjs.com/package/@icon-space/vue)           |
| Vue3 Icons | [Vue Component for Vue3.0](./packages/vue-next/README.md) | [@icon-space/vue-next](https://www.npmjs.com/package/@icon-space/vue-next) |
| SVG Icons | [Pure SVG String](./packages/svg/README.md)| [@icon-space/svg](https://www.npmjs.com/package/@icon-space/svg)           |

### Develop

#### Add your own svg image

1. clone/fork repo
2. Find the corresponding classification in the folder `source` and put the icon file in it
3. Modify the file [db.csv](source/db.csv) configuration
4. submit

The project will automatically generate the corresponding `react` `svg` `vue` `vue-next` code

### Publish

1. Modify `packages/react/package.json` `packages/svg/package.json` `packages/vue/package.json` `packages/vue-next/package.json` versions
2. submit
3. create a new `release`，`github action` will automatic publishing

### Join

![image](https://user-images.githubusercontent.com/9693637/222063392-d65150a7-fe33-4b62-b876-d367129c2fcf.png)
