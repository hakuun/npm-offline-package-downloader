#!/usr/bin/env ts-node

import path from "path";
import fs from "fs";
import { program, OptionValues } from "commander";
import { exec, ExecOptions } from "child_process";

interface AsyncExecOptions extends ExecOptions {
	showMessage?: Boolean;
}

program
	.argument("<packages name...>", "依赖包名称")
	.option("-a, --all", "下载指定依赖项的所有依赖")
	.option("-o, --output <path>", "指定下载路径", "./");

program.parse();

const options = program.opts();

console.log("program.args", program.args);
console.log("options", options);

downloadPackages(program.args, options);

async function downloadPackages(
	packages: string[] = [],
	options: OptionValues = {}
) {
	for (let i = 0; i < packages.length; i++) {
		const packageName = packages[i];
		console.log(`正在下载 ${packageName}...`);
		try {
			// 1. 生成临时文件夹
			const outputPath = path.resolve(options.output);
			const tempPath = createTempFolder(outputPath);

			// 2. 初始化 npm 项目
			await asyncExec("npm init -y", { cwd: tempPath });

			// 3. 安装 package
			await asyncExec(`npm install ${packageName}`, {
				cwd: tempPath,
				showMessage: true,
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

			if (options.all) {
			// 	// 获取依赖的 package.json 文件
			// 	const packageJson = fs.readFileSync(
			// 		path.resolve(`${packagePath}/package.json`),
			// 		"utf-8"
			// 	);
			// 	const packageObject = JSON.parse(packageJson);
			// 	const { dependencies } = packageObject;
			// 	if (!dependencies) {
			// 		console.log(`${packageName} 没有需要下载的`);
			// 	}
			// 	const res = Object.keys(dependencies).map((key) => {
			// 		const value = dependencies[key];
			// 		return `${key}@${value}`;
			// 	});
			}

			// 5. 删除临时目录
			deleteDirectory(tempPath);
		} catch (error) {
			throw error;
		}
		console.log(`下载 ${packageName} 完成`);
	}
}

function createTempFolder(outputPath: string) {
	const tempPath = path.resolve(outputPath, "temp");
	const hasTemp = fs.existsSync(tempPath);
	if (!hasTemp) {
		fs.mkdirSync(tempPath);
	}
	return tempPath;
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
