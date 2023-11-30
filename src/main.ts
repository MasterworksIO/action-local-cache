import { setFailed, setOutput } from '@actions/core'
import { mkdirP, mv, cp } from '@actions/io/'
import { exists } from '@actions/io/lib/io-util'

import { getVars } from './lib/getVars'
import { isErrorLike } from './lib/isErrorLike'
import log from './lib/log'

async function main(): Promise<void> {
  try {
    const { cachePath, targetDir, targetPath, options } = getVars()
    if (await exists(cachePath)) {
      await mkdirP(targetDir)

      switch (options.strategy) {
        case 'copy-immutable':
        case 'copy':
          await cp(cachePath, targetPath, {
            copySourceDirectory: false,
            recursive: true,
          })
          break
        case 'move':
          await mv(cachePath, targetPath, { force: true })
          break
      }

      log.info(`Cache found and restored to ${options.path} with ${options.strategy} strategy`)
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
