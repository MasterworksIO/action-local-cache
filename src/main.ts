import { setFailed, setOutput } from '@actions/core'
import { mkdirP, mv, rmRF } from '@actions/io/'
import { exists } from '@actions/io/lib/io-util'

import { getVars } from './lib/getVars'
import { isErrorLike } from './lib/isErrorLike'
import log from './lib/log'

async function deleteCache(path: string): Promise<void> {
  await rmRF(path)
  log.info(`Cache found and deleted at ${path}`)
}

async function restoreCache(
  cachePath: string,
  targetDir: string,
  targetPath: string
): Promise<void> {
  await mkdirP(targetDir)
  await mv(cachePath, targetPath, { force: true })
  log.info(`Cache found and restored to ${targetPath}`)
}

async function main(): Promise<void> {
  try {
    const { cachePath, targetDir, targetPath, options } = getVars()

    if (await exists(cachePath)) {
      if (options.delete) {
        await deleteCache(cachePath)
      } else if (targetDir && targetPath) {
        await restoreCache(cachePath, targetDir, targetPath)
      }

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
