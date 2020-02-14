const xss = require('xss')
const { exec } = require('../db/mysql')
const getList = (author, keyword) => {
    let sql = `SELECT * FROM blogs WHERE 1=1 `
    if (author) {
        sql += `AND author='${author}' `
    }
    if (keyword) {
        sql += `AND title LIKE '%${keyword}%' `
    }
    sql += `ORDER BY createtime DESC;`
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `SELECT * FROM blogs WHERE id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    let { title, content, author } = blogData
    title = xss(title)
    content = xss(content)
    author = xss(author)
    const createTime = Date.now()

    const sql = `INSERT INTO blogs (title, content, createtime, author) VALUES ('${title}','${content}','${createTime}','${author}')`
    return exec(sql).then(insertData => {
        console.log('insertData is ', insertData)
        return {
            id: insertData.insertId
        }
    })

}

const updateBlog = (id, blogData = {}) => {
    const { title, content } = blogData
    const sql = `UPDATE blogs SET title='${title}', content='${content}' WHERE id=${id};`
    return exec(sql).then(updateData => {
        // console.log('updateData', updateData)
        return updateData.affectedRows > 0
    })
}

const delBlog = (id, author) => {
    const sql = `DELETE FROM blogs WHERE id=${id} AND author='${author}';`
    return exec(sql).then(delData => {
        // console.log('delData', delData)
        return delData.affectedRows > 0
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}