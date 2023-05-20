function Response(status = Boolean, body = {}, message = "") {
  return {
    status,
    body,
    message,
  };
}

exports.Response = Response;
