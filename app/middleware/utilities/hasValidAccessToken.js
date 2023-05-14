import jwtDecode from 'jwt-decode'

export default (accessToken) => {
  if (!accessToken) {
    return false
  }

  const decodedToken = jwtDecode(accessToken)

  const isValidAccessToken = new Date().getTime() < decodedToken.exp * 1000 // Unix Epoch Milliseconds

  return isValidAccessToken
}