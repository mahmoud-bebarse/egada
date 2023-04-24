function Response(status = '', body = {}, message = '') {
    return {
        status,
        body,
        message
    }
}

exports.Response = Response;