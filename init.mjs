#!/usr/bin/env zx

$.verbose = false
const fs = require("fs")
const os = require("os")
const url = require("url")
const __tmpdir = os.tmpdir()
const __cwd = process.cwd()
const __base_url = "https://gitlab.com/-/snippets/2501467/raw/main"

export async function downloadScript(script, baseUrl = __base_url) {
    const scriptUrl = `${baseUrl}/${script}`
    const response = await fetch(scriptUrl)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const outputPath = url.pathToFileURL(`${__tmpdir}/${script}`)
    fs.writeFileSync(outputPath, buffer)
    return outputPath
}

main()

async function main() {
    const thisScript = "init.mjs"
    await downloadScript(thisScript)

    const nextScript = await downloadScript(`${argv.script}.mjs`)
    await import(`${nextScript}?${argv.args}`)
}
