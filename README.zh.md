# IconSpace

本项目是由[iconpark](https://github.com/bytedance/iconpark)派生而来，在此基础上进行改造和扩充。

[English](README.md) | 简体中文

### 代码库
#### 多种代码包

可以在`packages`文件夹下面找到，你可以应用在你的React、Vue、小程序等不同类型项目中使用

| 名称 | Github查看                                                  | NPM包地址 |
| ------- |-----------------------------------------------------------| --- |
| React Icons | [React Component](./packages/react/README.zh.md)          | [@icon-space/react](https://www.npmjs.com/package/@icon-space/react)      |
| Vue2 Icons | [Vue Component for old Vue2.0](./packages/vue/README.zh.md)  | [@icon-space/vue](https://www.npmjs.com/package/@icon-space/vue)           |
| Vue3 Icons | [Vue Component for Vue3.0](./packages/vue-next/README.zh.md) | [@icon-space/vue-next](https://www.npmjs.com/package/@icon-space/vue-next) |
| SVG Icons | [Pure SVG String](./packages/svg/README.zh.md)               | [@icon-space/svg](https://www.npmjs.com/package/@icon-space/svg)           |


### 开发流程

#### 增加自己的svg图片

1. clone/fork本项目
2. 在文件夹`source`找到对应分类，将图标文件放入其中
3. 修改文件[db.csv](source/db.csv)配置
4. 提交即可

项目会自动生成对应的`react` `svg` `vue` `vue-next`代码

### 发布流程

1. 修改 `packages/react/package.json` `packages/svg/package.json` `packages/vue/package.json` `packages/vue-next/package.json` 版本号
2. 提交代码
3. 在仓库创建`release`，`github action`会自动发布

### 加入我们

![群](https://user-images.githubusercontent.com/41979509/222069693-3df322d9-d914-4d25-a7d3-6549f3a82127.jpeg)
