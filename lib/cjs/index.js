"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
commander_1.program
    .argument('<packages name...>', '依赖包名称')
    .option('--first')
    .option('-s, --separator <char>');
commander_1.program.parse();
const options = commander_1.program.opts();
commander_1.program.args.forEach(arg => {
    console.log('arg', arg);
});
exports.default = { options };
