const axios = require('axios')

const getFileSize = (url) => {
  return axios({
    url,
    method: 'HEAD'
  }).then(res => {
    const { headers } = res

    return headers['content-length']
  }).catch(e => {
    console.log(e.message)
    return null
  })
}

exports.getFileSize = getFileSize
