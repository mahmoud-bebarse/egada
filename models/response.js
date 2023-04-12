function Response(status = '', body = {}, error = {}) {
    return {
        status,
        body,
        error
    }
}

exports.Response = Response;