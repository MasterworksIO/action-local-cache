import { setFailed } from '@actions/core'
import { mkdirP, mv, cp, rmRF } from '@actions/io'

import { getVars } from './lib/getVars'
import { isErrorLike } from './lib/isErrorLike'
import log from './lib/log'
import { exists } from '@actions/io/lib/io-util'

async function post(): Promise<void> {
  try {
    const { cacheDir, targetPath, cachePath, options } = getVars()

    await mkdirP(cacheDir)

    switch (options.strategy) {
      case 'copy-immutable':
        if (await exists(cachePath)) {
          log.info(`Cache already exists, skipping`)
          return
        }
        await cp(targetPath, cachePath, { copySourceDirectory: true, recursive: true })
        break
      case 'copy':
        await rmRF(cachePath)
        await cp(targetPath, cachePath, { copySourceDirectory: true, recursive: true })
        break
      case 'move':
        await mv(targetPath, cachePath, { force: true })
        break
    }

    log.info(`Cache saved to ${cachePath} with ${options.strategy} strategy`)
  } catch (error: unknown) {
    log.trace(error)
    setFailed(isErrorLike(error) ? error.message : `unknown error: ${error}`)
  }
}

void post()
