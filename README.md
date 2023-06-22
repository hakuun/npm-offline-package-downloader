# node-package-offline-downloader

## node package offline installation package downloader

[![NPM Version](http://img.shields.io/npm/v/node-package-offline-downloader.svg?style=flat)](https://www.npmjs.org/package/node-package-offline-downloader)
[![NPM Downloads](https://img.shields.io/npm/dm/node-package-offline-downloader.svg?style=flat)](https://npmcharts.com/compare/node-package-offline-downloader?minimal=true)
[![install size](https://packagephobia.com/badge?p=node-package-offline-downloader)](https://packagephobia.com/result?p=node-package-offline-downloader)

Read this in other languages: English | [简体中文](./Readme_zh-CN.md)

## Installation

```sh
npm install node-package-offline-downloader -g
```

## Quick Start

```sh
npod <packages name...> [options]
```

Download individual dependencies
```sh
npod react
```

Download multiple dependencies
```sh
npod vue react@^18.0.2 angular@~16.1.2 commander@latest
```

Set download address
```sh
npod @antv/g6 -o ./tgz

npod @antv/g6 --output ./tgz
```

Download dependencies for dependencies
```sh
npod vue -a

npod vue --all
```