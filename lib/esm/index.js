import { program } from 'commander';
program
    .argument('<packages name...>', '依赖包名称')
    .option('--first')
    .option('-s, --separator <char>');
program.parse();
const options = program.opts();
program.args.forEach(arg => {
    console.log('arg', arg);
});
export default { options };
