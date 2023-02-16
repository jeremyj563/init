#!/usr/bin/env zx

import childProcess from 'child_process'
const importUrl = new URL(import.meta.url) // get any query params passed during import

if (fs.pathExistsSync('.env.template')) {
    console.log(chalk.yellow('\nBuilding .env file with default values...\n'))

    await fs.outputFile('.env', '')

    const template = await fs.readFile('.env.template')
    const envs = template.toString().split(/\r?\n/)

    for (const e of envs) {
        const split = e.split('=')
        const name = split[0]
        let value = split[1] || $.env[name] // try to get value from environment

        if (! value) {
            value = await question(`🔐 Provide value for ${name}=`)
        }
        const env = `${name}=${value}\n`
        await fs.appendFile('.env', env)
    }
}

console.log(chalk.yellow('\nConfiguring local git repository...'))
childProcess.execSync('git config --local core.fileMode false')
childProcess.execSync('git config --local push.pushoption ci.skip')

console.log(chalk.yellow('Installing project dependencies...'))
childProcess.execSync('npm i')

if (! importUrl.searchParams.get('init-repo')) {
    console.log(chalk.blue('\nFinished! 🚀'))
}