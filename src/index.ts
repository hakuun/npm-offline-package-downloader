#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { program, OptionValues } from "commander";
import { exec, ExecOptions } from "child_process";
import { I18n } from "i18n";

const i18n = new I18n({
  locales: ["en", "zh-cn"],
  directory: path.resolve("locales")
});


interface AsyncExecOptions extends ExecOptions {
  showMessage?: Boolean;
}


program
  .name("npod")
  .usage("<packages name...> [options]")
  .argument("<packages name...>", i18n.__("Packages name"))
  .option("-a, --all", i18n.__("Download dependencies for dependencies"))
  .option("-o, --output <path>", i18n.__("Set download address"), "./")
  .option("-lang, --language <language>", i18n.__("Switch language"), (value) => {
    const locales = ["en", "zh-cn"];
    if(locales.includes(value)) return value;
    return 'en'
  }, 'en');

program.parse();

const options = program.opts();

i18n.setLocale(options.language);

console.log(i18n.__("Being prepared for download"), program.args, "\n");

downloadPackages(program.args, options);

async function downloadPackages(
  packages: string[] = [],
  options: OptionValues = {}
) {
  for (let i = 0; i < packages.length; i++) {
    const packageName = packages[i];
    console.log(i18n.__("Downloading"), packageName, "\n");
    try {
      // 1. 生成临时文件夹
      const outputPath = path.resolve(options.output);
      const tempPath = createTempFolder(outputPath);

      // 2. 初始化 npm 项目
      await asyncExec("npm init -y", { cwd: tempPath });

      // 3. 安装 package
      await asyncExec(`npm install ${packageName}`, {
        cwd: tempPath,
        showMessage: true
      });

      // 4. 运行 npm pack 命令打包依赖
      // 4.1 获取去除版本号后的依赖名称
      const versionReg = /@(\^|\~)?\d+(?:\.\d+){2}|@latest/;
      const purePackageName = packageName.replace(versionReg, "");
      const packagePath = path.resolve(
        tempPath,
        `node_modules/${purePackageName}`
      );
      // 4.2 打包依赖到指定目录
      await asyncExec(`npm pack ${packagePath}`, { cwd: outputPath });
      // 4.3 下载该依赖项的所以依赖
      if (options.all) {
        // 获取依赖的 package.json 文件
        const packageJson = fs.readFileSync(
          path.resolve(`${packagePath}/package.json`),
          "utf-8"
        );
        const packageObject = JSON.parse(packageJson);
        const { dependencies } = packageObject;
        if (!dependencies) return;
        const _dependencies = Object.keys(dependencies).map((key) => {
          const value = dependencies[key];
          return `${key}@${value}`;
        });
        downloadPackages(_dependencies, { output: `./${purePackageName}` });
      }

      // 5. 删除临时目录
      deleteDirectory(tempPath);
    } catch (error) {
      throw error;
    }
    console.log(packageName, i18n.__("Download completed"), "\n\n");
  }
}

function createTempFolder(outputPath: string) {
  const tempPath = path.resolve(outputPath, "temp");
  const hasTemp = fs.existsSync(tempPath);
  if (!hasTemp) {
    mkdirs(tempPath);
  }
  return tempPath;
}

function mkdirs(dirpath: string) {
  if (!fs.existsSync(path.dirname(dirpath))) {
    mkdirs(path.dirname(dirpath));
  }
  fs.mkdirSync(dirpath);
}

function asyncExec(command: string, options: AsyncExecOptions = {}) {
  return new Promise((reslove, reject) => {
    const child = exec(command, options);

    if (options.showMessage) {
      child.stdout?.on("data", (message) => {
        console.log(message);
      });
    }

    child.stdout?.on("end", () => {
      reslove(null);
    });

    child.stdout?.on("error", (error) => {
      reject(error);
    });
  });
}

function deleteDirectory(_path: string) {
  if (fs.existsSync(_path)) {
    const files = fs.readdirSync(_path);
    files.forEach((file) => {
      let currentPath = _path + "/" + file;
      if (fs.statSync(currentPath).isDirectory()) {
        //递归删除文件夹
        deleteDirectory(currentPath);
      } else {
        //删除文件
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(_path);
  }
}

export default { downloadPackages };
