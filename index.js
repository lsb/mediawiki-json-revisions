var fs = require('fs'),
    flow = require('xml-flow'),
    xmlStream = flow(process.stdin);

xmlStream.on("tag:page", page => {
    if(page.revision.timestamp) page.revision = [page.revision]
    page.revision.sort((a,b) => a.timestamp > b.timestamp).forEach(rev => {
        rev.page_id = page.id
        rev.page_title = page.title
        rev.page_ns = page.ns
        process.stdout.write(JSON.stringify(rev))
        process.stdout.write("\n")
    })
})
