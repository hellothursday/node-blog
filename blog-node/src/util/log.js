const fs = require('fs')
const path = require('path')

function writeLog(writeStream, log) {
    writeStream.write(log + '\n')
}

function createWriteStream(filename) {
    const fullName = path.join(__dirname, '../', '../', 'logs', filename)
    const writeStream = fs.createWriteStream(fullName, {
        flags: 'a'
    })
    return writeStream
}

const accsessWriteStream = createWriteStream('access.log')

// 写访问日志
function access(log) {
    writeLog(accsessWriteStream, log)
}

module.exports = {
    access
}