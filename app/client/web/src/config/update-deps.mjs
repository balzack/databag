import { spawn } from 'child_process'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const filename = fileURLToPath(import.meta.url);

const dirname = path.dirname(filename);

const pkg = JSON.parse(await readFile(path.join(dirname, '../../', 'package.json')))

const dependencies = Object.keys(pkg.dependencies)
const devDependencies = Object.keys(pkg.devDependencies || [])

const add = (args) => {
  return spawn('yarn', ['add', '--exact'].concat(args), { stdio: 'inherit' })
}

add(dependencies).on('close', () => {
  if(devDependencies.length > 0) {
    add(['--dev'].concat(devDependencies))
      .on('close', (code) => process.exit(Number(code)))
  }
})
