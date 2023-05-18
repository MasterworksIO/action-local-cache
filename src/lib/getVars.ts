import path from 'path'

import * as core from '@actions/core'

const { GITHUB_REPOSITORY, RUNNER_TOOL_CACHE } = process.env
const CWD = process.cwd()

type Vars = {
  cacheDir: string
  cachePath: string
  options: {
    key: string
    path: string
    delete: boolean
  }
  targetDir?: string
  targetPath?: string
}

export const getVars = (): Vars => {
  if (!RUNNER_TOOL_CACHE) {
    throw new TypeError('Expected RUNNER_TOOL_CACHE environment variable to be defined.')
  }

  if (!GITHUB_REPOSITORY) {
    throw new TypeError('Expected GITHUB_REPOSITORY environment variable to be defined.')
  }

  const options = {
    key: core.getInput('key'),
    path: core.getInput('path'),
    delete: core.getBooleanInput('delete'),
  }
  
  const cacheDir = path.join(RUNNER_TOOL_CACHE, GITHUB_REPOSITORY, options.key)

  if (options.delete) {
    if (!options.key) {
      throw new TypeError('when deleting, "key" is required but was not provided.')
    }
    const { key } = options;
    if (key.includes('..') || key.includes('*') || key.includes('/') || key.includes('~')) {
      throw new TypeError('"key" includes wildcard characters, something fishy is going on.')
    }

    return {
      cacheDir,
      cachePath: cacheDir,
      options,
    }
  }

  if (!options.path) {
    throw new TypeError('path is required but was not provided.')
  }

  const cachePath = path.join(cacheDir, options.path)
  const targetPath = path.resolve(CWD, options.path)
  const { dir: targetDir } = path.parse(targetPath)

  return {
    cacheDir,
    cachePath,
    options,
    targetDir,
    targetPath,
  }
}
