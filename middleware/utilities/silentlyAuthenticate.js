export default (auth) => {
    return new Promise((resolve) => {
      auth.checkSession({}, (error, authPayload) => {
        if (error) {
          if (error.code === 'login_required') {
            return resolve(false)
          }
  
          return resolve(false)
        }
  
        return resolve(authPayload.accessToken)
      })
    })
  }