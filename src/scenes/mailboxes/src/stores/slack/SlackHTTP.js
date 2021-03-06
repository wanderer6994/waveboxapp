import querystring from 'querystring'
import SlackRTM from './SlackRTM'
import FetchService from 'shared/FetchService'

class SlackHTTP {
  /* **************************************************************************/
  // Utils
  /* **************************************************************************/

  /**
  * Rejects a call because the service has no authentication info
  * @param info: any information we have
  * @return promise - rejected
  */
  static _rejectWithNoAuth (info) {
    return Promise.reject(new Error('Service missing authentication information'))
  }

  /* **************************************************************************/
  // Profile
  /* **************************************************************************/

  /**
  * Tests the auth
  * @param auth: the auth token
  * @return promise
  */
  static testAuth (auth, partitionId) {
    if (!auth) { return this._rejectWithNoAuth() }

    const query = querystring.stringify({
      token: auth,
      '_x_gantry': true
    })

    return Promise.resolve()
      .then(() => FetchService.request('https://slack.com/api/auth.test?' + query, partitionId, { credentials: 'include' }))
      .then((res) => res.ok ? Promise.resolve(res) : Promise.reject(res))
      .then((res) => res.json())
      .then((res) => res.ok ? Promise.resolve(res) : Promise.reject(res))
  }

  /* **************************************************************************/
  // RTM Start
  /* **************************************************************************/

  /**
  * Starts the RTM sync service
  * @param auth: the auth token
  * @return promise
  */
  static startRTM (auth, partitionId) {
    if (!auth) { return this._rejectWithNoAuth() }

    const query = querystring.stringify({
      token: auth,
      mpim_aware: true,
      '_x_gantry': true
    })
    return Promise.resolve()
      .then(() => FetchService.request('https://slack.com/api/rtm.start?' + query, partitionId, { credentials: 'include' }))
      .then((res) => res.ok ? Promise.resolve(res) : Promise.reject(res))
      .then((res) => res.json())
      .then((res) => res.ok ? Promise.resolve(res) : Promise.reject(res))
      .then((res) => {
        return { response: res, rtm: new SlackRTM(res.url) }
      })
  }

  /* **************************************************************************/
  // Unread
  /* **************************************************************************/

  /**
  * Gets the unread info from the server
  * @param auth: the auth token
  * @param simpleUnreads = true: true to return the simple unread counts
  */
  static fetchUnreadInfo (auth, partitionId, simpleUnreads = true) {
    if (!auth) { return this._rejectWithNoAuth() }

    const query = querystring.stringify({
      token: auth,
      simple_unreads: simpleUnreads,
      mpim_aware: true,
      include_threads: true,
      '_x_gantry': true
    })
    return Promise.resolve()
      .then(() => FetchService.request('https://slack.com/api/users.counts?' + query, partitionId, { credentials: 'include' }))
      .then((res) => res.ok ? Promise.resolve(res) : Promise.reject(res))
      .then((res) => res.json())
      .then((res) => res.ok ? Promise.resolve(res) : Promise.reject(res))
  }
}

export default SlackHTTP
