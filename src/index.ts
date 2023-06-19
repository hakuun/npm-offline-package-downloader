#!/usr/bin/env ts-node

import { program } from 'commander'

program
  .argument('<packages name...>', '依赖包名称')
  .option('--first')
  .option('-s, --separator <char>')
  .option('-o, --output <path>', '指定下载的路径', './');

program.parse();

const options = program.opts();

program.args.forEach(packageName => {
  download(packageName)
})

function download(packageName:string):void{
  console.log(`正在下载 ${packageName}...`)
}

export default {options};