"use strict";
const sax = require("sax"), parser = sax.createStream(false, {trim: true});

function backpressureStdout(s) {
    if(!process.stdout.write(s, (() => process.stdin.resume())))
        process.stdin.pause();
}

const m = "MEDIAWIKI", p = "PAGE", r = "REVISION", i = "ID", c = "CONTRIBUTOR",
      rid = [m, p, r, i], rtime = [m, p, r, 'TIMESTAMP'], rtext = [m, p, r, 'TEXT'],
      ruid = [m, p, r, c, i], runm = [m, p, r, c, 'USERNAME'], ruip = [m, p, r, c, 'IP'],
      rpagesha1 = [m, p, r, "SHA1"],
      rpageid = [m, p, i], rpagetitle = [m, p, 'TITLE'], rpagens = [m, p, 'NS'];
const watchedPaths = {[rid.join()]: "rid", [rtime.join()]: "rtime", [rtext.join()]: "rtext",
                      [ruid.join()]: "ruid", [runm.join()]: "runm", [ruip.join()]: "ruip",
                      [rpagesha1.join()]: "rpagesha1",
                      [rpageid.join()]: "rpageid", [rpagetitle.join()]: "rpagetitle", [rpagens.join()]: "rpagens"};
const whenToWriteOut = [m,p,r].join();
const whenToClear = [m,p].join();
const stack = [];
const revisionDetails = {};

parser.ontext = function(t) {
    const maybeIdx = watchedPaths[stack.join()];
    if(maybeIdx)
        revisionDetails[maybeIdx] = t;
}

parser.onopentag = ((node) => stack.push(node.name));

parser.onclosetag = function() {
    if(whenToWriteOut === stack.join()) {
        backpressureStdout(JSON.stringify(revisionDetails)+"\n");
        ["rid", "rtime", "ruid", "runm", "ruip", "rpagesha1"].forEach((idx) => revisionDetails[idx] = null);
    }
    if(whenToClear === stack.join()) {
        ["rpageid", "rpagetitle", "rpagens"].forEach((idx) => revisionDetails[idx] = null);
    }
    stack.pop();
}

process.stdin.pipe(parser);
