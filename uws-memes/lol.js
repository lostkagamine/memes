const uws = require('uws')
const server = new uws.Server({ port: 42069 }) // best port
const body_parser = require('body-parser')
const util = require('util');
const express = require('express');
const app = express();

const opcodes = {
    HELLO: 0,
    MESSAGE: 1,
    GOODBYE: 2,
    HEARTBEAT: 3
}

var clients = []

const msg = (msg, ws, raw) => {
    try {
        msg = JSON.parse(msg)
    } catch(e) {
        ws.close(4002, 'Invalid payload.') // invalid message
    }
    if (!Object.values(opcodes).includes(msg.o)) {
        ws.close(4003, 'Invalid opcode.')
    }
    if (msg.o === opcodes.HEARTBEAT) {
        ws.send(JSON.stringify(
            {
                o: opcodes.HEARTBEAT,
                d: null,
                t: 'HB_ACK'
            }
        ))
    }
    if (msg.o === opcodes.GOODBYE) {
        // got a goodbye, destroy client?
        // truth be told idk how to do this
        // WAIT I DO
        ws.close(1000, 'Goodbye.')
        clients.splice(clients.indexOf(clients.find(m => m.ws === ws)), 1)
    }
    console.log(`[UWS] Got ${util.inspect(msg)}`)
}

const dc = (ip, code, reason) => {
    console.log(`[UWS] ${ip.headers.host} disconnected. (${code}, ${reason})`)
    clients.splice(clients.indexOf(clients.find(m => m.raw === ip)), 1)
}

function genID() {
    let str = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let o = ''
    for (let i = 0; i < 20; i++) {
        o += str[Math.floor(Math.random() * str.length)]
    }
    return o
}

server.on('connection', (ws, raw) => {
    console.log(`[UWS] CONNECTION from ${raw.headers.host}`)
    ws.on('message', m => {
        msg(m, ws, raw)
    })
    ws.on('close', (code, reason) => {
        dc(raw, code, reason)
    })
    let id = genID()
    ws.send(JSON.stringify(
        {
            o: opcodes.HELLO,
            d: {
                id: id,
                hbInterval: 40000
            },
            t: 'HELLO'
        }
    ))
    clients.push({ id: id, ws: ws, raw: raw })
})

app.use(body_parser.json({extended: true}))

app.get('/', (req, res) => {
    res.send('pls work thanks')
})

app.get('/hahayes', (req, res) => {
    res.send('haha yes')
})

app.post('/api/alert', (req, res) => {
    if (req.headers['content-type'] !== 'application/json') {
        res.status(400)
        res.send({
            error: 'Body must be JSON.',
            code: 'ERR_BODY_NOT_JSON'
        })
    }
    // yep it json
    if (!req.body.id || !req.body.msg) {
        res.status(400)
        res.send({
            error: 'Missing id or msg field.',
            code: 'ERR_MISSING_FIELDS'
        })
    }
    // everything valid!
    let thing = clients.filter(a => a.id === req.body.id)[0]
    if (!thing) {
        res.status(404)
        res.send({
            error: 'This id doesn\'t exist.',
            code: 'ERR_MISSING_ID'
        })
        return;
    }
    thing.ws.send(JSON.stringify({
        o: 1,
        d: {
            type: 'alert',
            msg: req.body.msg
        },
        t: 'MESSAGE'
    }))
    res.status(200)
    res.send(null)
})

app.post('/api/reload', (req, res) => {
    if (req.headers['content-type'] !== 'application/json') {
        res.status(400)
        res.send({
            error: 'Body must be JSON.',
            code: 'ERR_BODY_NOT_JSON'
        })
    }
    // yep it json
    if (!req.body.id) {
        res.status(400)
        res.send({
            error: 'Missing id field.',
            code: 'ERR_MISSING_FIELDS'
        })
    }
    // everything valid!
    let thing = clients.filter(a => a.id === req.body.id)[0]
    if (!thing) {
        res.status(404)
        res.send({
            error: 'This id doesn\'t exist.',
            code: 'ERR_MISSING_ID'
        })
        return;
    }
    thing.ws.send(JSON.stringify({
        o: 1,
        d: {
            type: 'reload'
        },
        t: 'MESSAGE'
    }))
    res.status(200)
    res.send(null)
})

app.post('/api/navigate', (req, res) => {
    if (req.headers['content-type'] !== 'application/json') {
        res.status(400)
        res.send({
            error: 'Body must be JSON.',
            code: 'ERR_BODY_NOT_JSON'
        })
    }
    // yep it json
    if (!req.body.id || !req.body.url) {
        res.status(400)
        res.send({
            error: 'Missing id or url field.',
            code: 'ERR_MISSING_FIELDS'
        })
    }
    // everything valid!
    let thing = clients.filter(a => a.id === req.body.id)[0]
    if (!thing) {
        res.status(404)
        res.send({
            error: 'This id doesn\'t exist.',
            code: 'ERR_MISSING_ID'
        })
        return;
    }
    thing.ws.send(JSON.stringify({
        o: 1,
        d: {
            type: 'navigate',
            url: req.body.url
        },
        t: 'MESSAGE'
    }))
    res.status(200)
    res.send(null)
})

app.post('/api/disconnect', (req, res) => {
    if (req.headers['content-type'] !== 'application/json') {
        res.status(400)
        res.send({
            error: 'Body must be JSON.',
            code: 'ERR_BODY_NOT_JSON'
        })
    }
    // yep it json
    if (!req.body.id) {
        res.status(400)
        res.send({
            error: 'Missing id field.',
            code: 'ERR_MISSING_FIELDS'
        })
    }
    // everything valid!
    let thing = clients.filter(a => a.id === req.body.id)[0]
    if (!thing) {
        res.status(404)
        res.send({
            error: 'This id doesn\'t exist.',
            code: 'ERR_MISSING_ID'
        })
        return;
    }
    thing.ws.send(JSON.stringify({
        o: 1,
        d: {
            type: 'disconnect'
        },
        t: 'MESSAGE'
    }))
    res.status(200)
    res.send(null)
})

app.listen(8080, () => { console.log('[Express] ready') })
