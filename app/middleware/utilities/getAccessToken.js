export default (auth) => {
    return new Promise((resolve, reject) => {
        auth.parseHash((error, { accessToken }) => {
            if (error) {
                reject(error)
                throw new Error(error)
            }
    
            return resolve(accessToken)
        })
    })
}