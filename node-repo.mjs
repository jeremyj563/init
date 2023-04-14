#!/usr/bin/env zx

import { downloadScript } from './init.mjs'
import childProcess from 'child_process'
const baseDirName = path.basename(__dirname)
const packageJson = require('./package.json')

const packageName = await question(`\n📦 Enter new package name: (${chalk.green(baseDirName)}) `)
const packageAuthor = await question(`📘 Enter new package author: (${chalk.green(packageJson.author)}) `)
const packageDescription = await question(`🔖 Enter new package description: (${chalk.yellow('optional')}) `)
const remoteUrl = await question(`🌐 Enter new repo remote URL (${chalk.bold('WARNING: any repo at this URL will be wiped out!')}): (${chalk.red('required')}) `)

console.log(chalk.yellow('\nDeleting template .git folder...'))
await fs.remove('.git')

console.log(chalk.yellow('\nSetting up project README.md...'))
await fs.move('README.project.md', 'README.md', { overwrite: true })

console.log(chalk.yellow('\nRunning git init...'))
childProcess.execSync('git init --initial-branch=main')

console.log(chalk.yellow("\nAdding git remote 'origin'..."))
childProcess.execSync(`git remote add origin "${remoteUrl}"`)

console.log(chalk.yellow('\nConfiguring package.json...'))
childProcess.execSync('npm pkg set scripts.init="npx -y zx https://gitlab.com/-/snippets/2501467/raw/main/init.mjs --script node-project"')
childProcess.execSync(`npm pkg set name="${packageName || packageJson.name}"`)
childProcess.execSync(`npm pkg set author="${packageAuthor || packageJson.author}"`)
childProcess.execSync(`npm pkg set description="${packageDescription || ' '}"`)
childProcess.execSync(`npm pkg set repository.url="${remoteUrl || ' '}"`)

console.log(chalk.yellow('\nSetting up project...'))
await downloadScript('node-project.mjs')
await import('./node-project.mjs?init-repo=true')

console.log(chalk.yellow('\nCommitting all template files...'))
childProcess.execSync('git add .')
childProcess.execSync('git commit -m "added template files"')

console.log(chalk.yellow("\nPushing all branches to remote 'origin'..."))
childProcess.execSync('git push --all --set-upstream origin --force')

console.log(chalk.blue('\nFinished! 🚀'))
