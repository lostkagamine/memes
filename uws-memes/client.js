var uri = 'ws://ws.ry00001.me:42069' // prompt('WebSocket connection URL')
var ws = new WebSocket(uri) 
setup(ws)

const opcodes = {
    HELLO: 0,
    MESSAGE: 1,
    GOODBYE: 2,
    HEARTBEAT: 3
}

function setup(ws) {
    ws.onmessage = ev => {
        ev = JSON.parse(ev.data)
        switch (ev.o) {
            case (opcodes.HELLO):
                console.log(`Successfully connected to gateway. Client ID: ${ev.d.id} / Heartbeat delay: ${ev.d.hbInterval}`)
                break;
            case (opcodes.HEARTBEAT):
                ws.send(JSON.stringify({
                    o: opcodes.HEARTBEAT,
                    d: null,
                    t: 'HB'
                })); 
                break;
            case (opcodes.MESSAGE):
                switch (ev.d.type) {
                    case 'alert':
                        alert(ev.d.msg)
                        break;
                    case 'reload':
                        window.location.reload();
                        break;
                    case 'navigate':
                        window.location.replace(ev.d.url);
                        break;
                    case 'disconnect':
                        ws.send(JSON.stringify({o: 2, d: null, t: null}))
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        if (ev.o !== opcodes.HELLO) console.log(ev)
    }

    ws.onclose = (evt) => {
        console.log(`Server disconnected us${evt.wasClean ? ' cleanly' : ''}! ${evt.code}, reason: ${evt.reason || 'no reason'}`)
    }
}