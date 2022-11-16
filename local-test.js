const app = require('./src/index')
const message = require('./test/message.json')

const invoke = async () => {
  await app.handler(message)
}
invoke()