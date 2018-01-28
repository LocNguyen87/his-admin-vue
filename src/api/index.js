import axios from 'axios'
import config from '../config'

export default {

  login ({
      username, password
    }) {
    return axios({
      url: config.serverURI + 'login',
      method: 'get',
      data: {
        username, password
      },
      params: {
        username, password
      },
      headers: {
        'X-Parse-Application-Id': config.parseAppId,
        'X-Parse-REST-API-Key': config.parseMasterKey,
        'X-Parse-Revocable-Session': 1,
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
  },

  getRegistrations () {
    return axios({
      url: config.serverURI + 'classes/Registration',
      method: 'get',
      headers: {
        'X-Parse-Application-Id': config.parseAppId,
        'X-Parse-REST-API-Key': config.parseMasterKey,
        'Content-type': 'application/json'
      }
    })
  },

  request (method, uri, data = null) {
    if (!method) {
      console.error('API function call requires method argument')
      return
    }

    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    var url = config.serverURI + uri
    return axios({
      method, url, data
    })
  }
}
