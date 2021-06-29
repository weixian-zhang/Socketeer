"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionStatus = exports.Protocol = exports.SocketInfo = void 0;
var SocketInfo = /** @class */ (function () {
    function SocketInfo(id, protocol) {
        this.Id = id;
        this.Protocol = protocol;
    }
    return SocketInfo;
}());
exports.SocketInfo = SocketInfo;
var Protocol;
(function (Protocol) {
    Protocol[Protocol["Tcp"] = 0] = "Tcp";
    Protocol[Protocol["Http"] = 1] = "Http";
})(Protocol = exports.Protocol || (exports.Protocol = {}));
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["Connected"] = 0] = "Connected";
    ConnectionStatus[ConnectionStatus["Disconnect"] = 1] = "Disconnect";
})(ConnectionStatus = exports.ConnectionStatus || (exports.ConnectionStatus = {}));
//# sourceMappingURL=SocketInfo.js.map