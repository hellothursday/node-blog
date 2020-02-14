const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../util/cryp')
const login = async (username, password) => {
    // password = genPassword(password)
    username = escape(username)
    password = escape(password)
    console.log('username', username)
    console.log('password', password)
    const sql = `SELECT username, realname FROM users WHERE username=${username} AND password=${password};`
    const rows = await exec(sql)
    return rows[0] || {}
}

module.exports = {
    login
}