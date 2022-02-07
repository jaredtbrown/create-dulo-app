#!/usr/bin/env node --experimental-json-modules
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import yargs from 'yargs';
import { execSync } from 'child_process';

const FRAMEWORKS = [
  {
    name: 'vanilla',
    color: chalk.hex('#f7e017'),
    typescript: true,
  },
  {
    name: 'react',
    color: chalk.hex('#61dafb'),
    typescript: true,
  },
]

const TEMPLATES = [];
FRAMEWORKS.forEach((framework) => {
  TEMPLATES.push(framework.name);
  if (framework.typescript) {
    TEMPLATES.push(`${framework.name}-typescript`)
  }
})

const renameFiles = {
  _gitignore: '.gitignore'
}

async function init() {
  const args = yargs(process.argv.slice(2)).argv;

  let targetDirectory = args._[0];
  const template = args.template || args.t;
  const templateIsValid = typeof template === 'string' && TEMPLATES.includes(template);

  const defaultProjectName = targetDirectory ?? 'my-dulo-app';

  let result = {};

  try {
    result = await prompts(
      [
        {
          type: (targetDirectory) ? null : 'text',
          name: 'projectName',
          message: 'Project name:',
          initial: defaultProjectName,
          onState: (state) =>
            (targetDirectory = state.value.trim() || defaultProjectName)
        },
        {
          type: () =>
            !fs.existsSync(targetDirectory) || !isEmpty(targetDirectory) ? null : 'confirm',
          name: 'overwrite',
          message: () =>
            (targetDirectory === '.'
              ? 'Current directory'
              : `Target directory "${targetDirectory}"`) +
            ` is not empty. Remove existing files and continue?`
        },
        {
          type: template && templateIsValid ? null : 'select',
          name: 'framework',
          message:
            !template
              ? 'Select a framework:'
              : `"${template}" isn't a valid template. Please choose from below: `,
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color
            return {
              title: frameworkColor(framework.name),
              value: framework
            }
          })
        },
        {
          type: (framework) =>
            framework && (framework.typescript || !templateIsValid) ? 'confirm' : null,
          name: 'typescript',
          message: `Do you want to use ${chalk.bold('Typescript')}?`,
        },
        {
          onCancel: () => {
            throw new Error(chalk.red('✖') + ' Operation cancelled')
          }
        }
      ]
    )
  } catch (error) {
    console.log(error.message);
    return;
  }

  const { projectName, overwrite, framework, typescript } = result;

  const root = path.join(process.cwd(), targetDirectory);

  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  const duloTemplate = (template && templateIsValid) ? template : (typescript) ? `${framework.name}-typescript` : framework.name;
  const templateDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), `templates/${duloTemplate}`);

  const write = (file, content) => {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDirectory, file), targetPath)
    }
  }

  const files = fs.readdirSync(templateDirectory)
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file)
  }

  const { default: pkg } = await import(path.join(templateDirectory, `package.json`))

  pkg.name = projectName || templateDirectory

  write('package.json', JSON.stringify(pkg, null, 2))

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  console.log(`\nDone. Now run:\n`)
  if (root !== process.cwd()) {
    console.log(`  cd ${path.relative(process.cwd(), root)}`)
  }
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn start')
      console.log()
      console.log('And in a separate terminal run:')
      console.log(`  yarn dev`)
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run start`)
      console.log()
      console.log('And in a separate terminal run:')
      console.log(`  ${pkgManager} run dev`)
      break
  }
  console.log()
}

function copy(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function isEmpty(path) {
  return fs.readdirSync(path).length === 0
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file)
    // baseline is Node 12 so can't use rmSync :(
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      fs.rmdirSync(abs)
    } else {
      fs.unlinkSync(abs)
    }
  }
}

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1]
  }
}

init();