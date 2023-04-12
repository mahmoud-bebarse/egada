function Error(code = "", message = "") {
    return {
        code: code,
        message: message
    }
}

function ErrorResponse(code = "", message = "") {
    var error = Error(code, message);

    return {
        error
    }
}

module.exports = { Error, ErrorResponse };