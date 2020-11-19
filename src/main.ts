import { setFailed, setOutput } from '@actions/core'
import { mkdirP, mv } from '@actions/io/'
import { exists } from '@actions/io/lib/io-util'

import { getVars } from './lib/getVars'
import log from './lib/log'

async function main(): Promise<void> {
  try {
    const { cachePath, targetDir, targetPath, options } = getVars()

    if (await exists(cachePath)) {
      await mkdirP(targetDir)
      await mv(cachePath, targetPath, { force: true })
      log.info(`Cache found and restored to ${options.path}`)
      setOutput('cache-hit', true)
    } else {
      log.info(`Skipping: cache not found for ${options.path}.`)
      setOutput('cache-hit', false)
    }
  } catch (error) {
    console.trace(error)
    setFailed(error.message)
  }
}

main()
