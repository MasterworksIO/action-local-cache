import { setFailed, setOutput } from '@actions/core'
import { mkdirP, mv, cp } from '@actions/io/'
import { exists } from '@actions/io/lib/io-util'
import { spawn } from 'child_process'
import { promisify } from 'util'

import { getVars } from './lib/getVars'
import { isErrorLike } from './lib/isErrorLike'
import log from './lib/log'

const rsync = promisify(spawn)

async function main(): Promise<void> {
  try {
    const { cachePath, targetDir, targetPath, options } = getVars()
    if (await exists(cachePath)) {
      await mkdirP(targetDir)

      if (options.copyStrategy === 'move') {
        await mv(cachePath, targetPath, { force: true })
      } else if (options.copyStrategy === 'copy') {
        await cp(cachePath, targetPath, {
          copySourceDirectory: false,
          recursive: true,
          force: true,
        })
      } else if (options.copyStrategy === 'rsync') {
        await rsync('rsync', ['-avqR', '.', targetPath], { stdio: 'inherit', cwd: cachePath })
      } else {
        setFailed(`Unknown copy strategy ${options.copyStrategy}`)
        return
      }

      log.info(`Cache found and restored to ${options.path} with ${options.copyStrategy} strategy`)
      setOutput('cache-hit', true)
    } else {
      log.info(`Skipping: cache not found for ${options.path}.`)
      setOutput('cache-hit', false)
    }
  } catch (error: unknown) {
    console.trace(error)
    setFailed(isErrorLike(error) ? error.message : `unknown error: ${error}`)
  }
}

void main()
