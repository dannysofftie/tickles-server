"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(req, res) {
    if (req.headers['client-ssid'] == undefined) {
        return res.status(500).json({ error: 'NOT_LOGGEDIN' });
    }
    return true;
}
exports.default = default_1;
