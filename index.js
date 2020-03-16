const server = require('./server')

global.config = {
  size: 100,
  port: 7777
}

class FilePortal {
  constructor(config) {
    global.config = Object.assign({}, global.config, config)
  }

  start() {
    const server_instance = server()

    server_instance.listen(global.config.port)
  }

  config(value) {
    global.config = Object.assign({}, global.config, value)
  }
}

const service = new FilePortal({
  size: 1024,
  port: 7777
})

service.start()

module.exports = FilePortal
