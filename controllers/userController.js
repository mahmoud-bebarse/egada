const _User = require('../models/user.js');
const { Response } = require('../models/response.js');


//User
const getUsers = async (req, res, next) => {
    const users = await _User.find({ status: true })

    res.status(200).send(Response("200", users, {}));
}

module.exports = { getUsers };