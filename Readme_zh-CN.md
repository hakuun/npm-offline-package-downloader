# node-package-offline-downloader

## npm 离线包下载器

[![NPM Version](http://img.shields.io/npm/v/node-package-offline-downloader.svg?style=flat)](https://www.npmjs.org/package/node-package-offline-downloader)
[![NPM Downloads](https://img.shields.io/npm/dm/node-package-offline-downloader.svg?style=flat)](https://npmcharts.com/compare/node-package-offline-downloader?minimal=true)
[![install size](https://packagephobia.com/badge?p=node-package-offline-downloader)](https://packagephobia.com/result?p=node-package-offline-downloader)

使用其他语言阅读：[English](./Readme.md) | 简体中文

## 安装

```sh
npm install node-package-offline-downloader -g
```

## 快速开始

```sh
npod <packages name...> [options]
```

下载单个
```sh
npod react
```

下载多个
```sh
npod vue react@^18.0.2 angular@~16.1.2 commander@latest
```

指定下载地址
```sh
npod @antv/g6 -o ./tgz

npod @antv/g6 --output ./tgz
```

下载依赖的依赖
```sh
npod vue -a

npod vue --all
```