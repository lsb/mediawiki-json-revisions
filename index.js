var x = require('sax-stream')
var stringify = require('json-stable-stringify')
process.stdin.pipe(x({strict: true, tag: "page"})).on('data', (page) => {
    pc = page.children
    if(pc.revision.children) pc.revision = [pc.revision]
    pc.revision.forEach(rev => {
        rc = rev.children
        cc = rc.contributor.children
        h = {page_id: pc.id.value,
             page_title: pc.title.value,
             page_ns: pc.ns.value,
             id: rc.id.value,
             timestamp: rc.timestamp.value,
             contributor: cc && {username: cc.username && cc.username.value, id: cc.id && cc.id.value, ip: cc.ip && cc.ip.value},
             model: rc.model.value,
             format: rc.format.value,
             text: rc.text.value,
             sha1: rc.sha1.value};
        process.stdout.write(stringify(h))
        process.stdout.write("\n")
    })
})
