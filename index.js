#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const utils = {
    isPrintChars: chr => {
        if (chr > 31 && chr < 128) return true;
        if (chr > 160 && chr < 173) return true;
        if (chr > 173 && chr < 564) return true;
        if (chr === 9 || chr === 10 || chr === 13 || chr === 26) return true;
        return false;
    },
    isEncChars: chr => {
        if (chr > 127 && chr < 161) return true;
        if (chr === 173) return true;
        return false;
    },
    filterHiddenPath: (item, type = 0) => {
        if (!type && /^\./.test(item.split('/').slice(-1)[0])) return false;
        return true;
    },
    filterSafeDevPath: (item, type = 0) => {
        if (!type && /^\./.test(item.split('/').slice(-1)[0])) return false;
        if (type) {
            return /\.(jsx?|ts|s?css|py|x?html?|xml|json|bash|sh)$/.test(item);
        }
        return true;
    },
    vbsInvCharErrors: (item, errors) => {
        console.log(
            `${item} (${errors.length} errors)\n\t${errors
                .slice(0, 20)
                .map(({ chr, line, col }) => `chr=${chr}\t${line}:${col}`)
                .join('\n\t')}${errors.length > 20 ? '\n\t...' : ''}`
        );
    }
};

function scanInvChars(options = {}) {
    /* Options */
    if (typeof options !== 'object' || !options) options = {};
    options.path = String(options.path || defaultOptions.path);
    options.filter =
        typeof options.filter === 'function'
            ? options.filter
            : defaultOptions.filter;
    options.verbose =
        typeof options.verbose === 'boolean'
            ? options.verbose
            : defaultOptions.verbose;
    /* Scan */
    let report = [];
    let files = fs.readdirSync(options.path);
    for (let i = 0; i < files.length; i++) {
        const item = files[i];
        const itemPath = path.resolve(options.path, item);
        if (fs.lstatSync(itemPath).isDirectory()) {
            if (!options.filter(item, 0)) continue;
            /* Explore */
            files.push(
                ...fs.readdirSync(itemPath).map(name => `${item}/${name}`)
            );
        } else {
            if (!options.filter(item, 1)) continue;
            /* Analysis */
            let lc = 0,
                lr = 0,
                lk = 0;
            let errors = [];
            for (let chr of fs.readFileSync(itemPath)) {
                /* New line */
                if (chr === 10 || chr === 13) {
                    if (chr === 10 || !lk) {
                        lc = 0;
                        lr++;
                        lk = 1;
                    }
                    continue;
                } else lk = 0;
                // if (utils.isEncChars(chr)) continue; -- dev: need more tests
                /* New char */
                lc++;
                if (utils.isPrintChars(chr)) continue;
                /* Wrong char */
                errors.push({ chr, line: lr + 1, col: lc });
            }
            if (!errors.length) continue;
            /* Save */
            report.push({
                file: item,
                errors
            });
            /* Debug */
            if (options.verbose) utils.vbsInvCharErrors(item, errors);
        }
    }
    return report;
}

const defaultOptions = {
    path: '.',
    filter: utils.filterSafeDevPath,
    verbose: false
};

/* Command line */
if (module.parent === null) {
    scanInvChars({
        path: '.',
        verbose: true
    });
}

scanInvChars.utils = utils;
scanInvChars.defaultOptions = defaultOptions;
module.exports = scanInvChars;
