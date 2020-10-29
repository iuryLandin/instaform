const FB = require('fb')

module.exports = (params, callback) => {
    var url = "/" + params.formId + "/leads"

    console.log(url)
    FB.options({ accessToken: params.token })
    FB.api(
        url,
        function(response) {
            if (response && !response.error) {
                if (response.data && response.data.length > 0) {
                    callback(response)
                }
            } else {
                callback({ status: false, value: response.error })
            }
        }
    );

}