"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestAndParse = exports.parseResponse = exports.getText = exports.compile = exports.selectOne = exports.selectAll = exports.request = exports.DOMElement = void 0;
const axios_1 = require("axios");
const domhandler_1 = require("domhandler");
const css_select_1 = require("css-select");
const domutils_1 = require("domutils");
const htmlparser2_1 = require("htmlparser2");
var domhandler_2 = require("domhandler");
Object.defineProperty(exports, "DOMElement", { enumerable: true, get: function () { return domhandler_2.Element; } });
const DEBUG = /(^|,)trias-client(,|$)/.test(process.env.DEBUG || "");
async function request(url, requestorRef, headers, reqBody) {
    // Convert all header keys to lower case, to make sure that you actually overwrite the content-type header when specifying Content-Type
    // HTTP headers are case-insensitive, so this shouldn't be a problem
    for (const header in headers) {
        if (header == header.toLowerCase())
            continue;
        headers[header.toLowerCase()] = headers[header];
        delete headers.header;
    }
    const req = {
        url,
        method: "POST",
        headers: {
            // There are two MIME assignments for XML data. These are:
            // - application/xml (RFC 7303, previously RFC 3023)
            // - text/xml (RFC 7303, previously RFC 3023)
            // https://en.wikipedia.org/wiki/XML_and_MIME
            "content-type": "application/xml",
            "accept": "application/xml",
            ...headers,
        },
        data: reqBody,
    };
    // tslint:disable-next-line:no-console
    if (DEBUG)
        console.error(reqBody);
    const res = await axios_1.default(req);
    // tslint:disable-next-line:no-console
    if (DEBUG)
        console.error(res.data);
    return res;
}
exports.request = request;
function selectAll(query, elements, options = {}) {
    if (elements === null)
        return [];
    return css_select_1.selectAll(query, elements, {
        xmlMode: true,
        ...options,
    });
}
exports.selectAll = selectAll;
function selectOne(query, elements, options = {}) {
    if (elements === null)
        return null;
    return css_select_1.selectOne(query, elements, {
        xmlMode: true,
        ...options,
    });
}
exports.selectOne = selectOne;
function compile(selector, options = {}, context) {
    return css_select_1.compile(selector, {
        xmlMode: true,
        ...options,
    }, context);
}
exports.compile = compile;
function getText(node) {
    return node ? domutils_1.getText(node) : null;
}
exports.getText = getText;
// https://github.com/fb55/htmlparser2/blob/ee6879069b4d30ecb327ca1426747791f45d3920/src/index.ts#L18-L28
function parseResponse(data) {
    const handler = new domhandler_1.DomHandler(null, {
        withStartIndices: false,
        withEndIndices: false,
    });
    const onOpenTag = handler.onopentag.bind(handler);
    // https://github.com/fb55/domhandler/blob/7aec3ae0f4ac59325f04d833a6e10f767a49d035/src/index.ts#L160-L165
    handler.onopentag = (name, attribs) => {
        onOpenTag(name.replace(/^trias:/, ""), attribs);
    };
    const parser = new htmlparser2_1.Parser(handler, {
        xmlMode: true,
        decodeEntities: true,
    });
    parser.end(data);
    return handler.root;
}
exports.parseResponse = parseResponse;
async function requestAndParse(url, requestorRef, headers, reqBody) {
    const res = await request(url, requestorRef, headers, reqBody);
    return parseResponse(res.data);
}
exports.requestAndParse = requestAndParse;
