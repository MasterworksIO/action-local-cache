import log from 'loglevel'

log.setDefaultLevel('info')

if (process.env.LOG_LEVEL) {
  log.setLevel(process.env.LOG_LEVEL as log.LogLevelDesc)
}

export default log
