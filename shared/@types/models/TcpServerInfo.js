"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpServerInfo = void 0;
var SocketInfo_1 = require("./SocketInfo");
var TcpServerInfo = /** @class */ (function (_super) {
    __extends(TcpServerInfo, _super);
    function TcpServerInfo(id, destinationAddress, destinationPort) {
        var _this = _super.call(this, id, SocketInfo_1.Protocol.Tcp) || this;
        _this.ConnectionEstablishTime = new Date();
        _this.ConnectionStatus = SocketInfo_1.ConnectionStatus.Disconnect;
        _this.DestinationAddress = destinationAddress;
        _this.DestinationPort = destinationPort;
        return _this;
    }
    return TcpServerInfo;
}(SocketInfo_1.SocketInfo));
exports.TcpServerInfo = TcpServerInfo;
//# sourceMappingURL=TcpServerInfo.js.map