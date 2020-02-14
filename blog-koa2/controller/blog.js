const xss = require('xss')
const { exec } = require('../db/mysql')
const getList = async (author, keyword) => {
    let sql = `SELECT * FROM blogs WHERE 1=1 `
    if (author) {
        sql += `AND author='${author}' `
    }
    if (keyword) {
        sql += `AND title LIKE '%${keyword}%' `
    }
    sql += `ORDER BY createtime DESC;`
    return await exec(sql)
}

const getDetail = async (id) => {
    const sql = `SELECT * FROM blogs WHERE id='${id}'`
    const rows = await exec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    let { title, content, author } = blogData
    title = xss(title)
    content = xss(content)
    author = xss(author)
    const createTime = Date.now()

    const sql = `INSERT INTO blogs (title, content, createtime, author) VALUES ('${title}','${content}','${createTime}','${author}')`
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

const updateBlog = async (id, blogData = {}) => {
    const { title, content } = blogData
    const sql = `UPDATE blogs SET title='${title}', content='${content}' WHERE id=${id};`
    const updateData = await exec(sql)
    return updateData.affectedRows > 0
}

const delBlog = async (id, author) => {
    const sql = `DELETE FROM blogs WHERE id=${id} AND author='${author}';`
    const delData = await exec(sql)
    return delData.affectedRows > 0
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}