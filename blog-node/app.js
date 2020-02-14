const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')
const { access } = require('./src/util/log')
const fs = require('fs')
const { join } = require('path')
const SESSION_DATA = {}

const getCookieExpires = () => {
    const date = new Date()
    date.setTime(date.getTime() + (24 * 60 * 60 * 1000))
    return date.toGMTString()
}

const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })

    return promise
}

const serverHandle = (req, res) => {
    access(
        `${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`
    )
    res.setHeader('Content-type', 'application/json')

    // 获取 path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析 query
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookie = req.headers.cookie || ''
    cookie.split(';').forEach(item => {
        if (!item) {
            return
        }
        const [key, value] = item.split('=').map(item => {
            return item.trim()
        })
        req.cookie[key] = value
    })

    // 解析 session
    let needSetCookie = false
    let userid = req.cookie.userid
    if (userid) {
        if (!SESSION_DATA[userid]) {
            SESSION_DATA[userid] = {}
        }
    } else {
        needSetCookie = true
        userid = Date.now() + '_' + Math.random()
        SESSION_DATA[userid] = {}
    }
    req.session = SESSION_DATA[userid]

    // 处理 post data
    getPostData(req).then(postData => {
        req.body = postData
        // 处理 blog 路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            if (needSetCookie) {
                res.setHeader('Set-Cookie', `userid=${userid};path=/;httpOnly;expires=${getCookieExpires()}`)
            }
            blogResult.then(blogData => {
                res.end(JSON.stringify(blogData))
            })
            return
        }

        // 处理 user 路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            if (needSetCookie) {
                res.setHeader('Set-Cookie', `userid=${userid};path=/;httpOnly;expires=${getCookieExpires()}`)
            }
            userResult.then(userData => {
                res.end(JSON.stringify(userData))
            })
            return
        }

        // 处理前端页面
        const method = req.method
        let path = req.path
        const id = req.query.id || ''

        if (method === 'GET' && !path.startsWith('/api')) {
            console.log('path', path)
            if (path === '/')
                path = 'index.html'
            fs.readFile(join(__dirname, 'template', path), function (err, data) {
                if (err) {
                    console.log(err)
                    res.writeHead(404, { 'Content-type': 'text/plain' })
                    res.write('404 Not Found')
                    res.end()
                }
                res.writeHead(200, { 'Content-type': 'text/html' })
                res.end(data);
            });
        } else {
            // 未命中
            res.writeHead(404, { 'Content-type': 'text/plain' })
            res.write('404 Not Found')
            res.end()
        }
    })
}

module.exports = serverHandle

// process.env.NODE_ENV