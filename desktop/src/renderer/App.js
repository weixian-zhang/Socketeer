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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.clicked = function () {
            console.log("clicked!!!");
        };
        return _this;
    }
    App.prototype.render = function () {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { onClick: this.clicked }, "hello!")));
    };
    return App;
}(react_1.default.Component));
exports.default = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUUxQjtJQUFpQyx1QkFBZTtJQUU1QyxhQUFZLEtBQVU7UUFBdEIsWUFDSSxrQkFBTSxLQUFLLENBQUMsU0FDZjtRQVVELGFBQU8sR0FBRztZQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFBOztJQVpELENBQUM7SUFFRCxvQkFBTSxHQUFOO1FBQ0ksT0FBTyxDQUNIO1lBQ0ksdUNBQUssT0FBTyxFQUFJLElBQUksQ0FBQyxPQUFPLGFBQWMsQ0FDeEMsQ0FDVCxDQUFDO0lBQ04sQ0FBQztJQUtMLFVBQUM7QUFBRCxDQUFDLEFBakJELENBQWlDLGVBQUssQ0FBQyxTQUFTLEdBaUIvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IG9uQ2xpY2sgPSB7dGhpcy5jbGlja2VkfT5oZWxsbyE8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGlja2VkID0gKCkgOiB2b2lkID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNsaWNrZWQhISFcIik7XHJcbiAgICB9XHJcbn0iXX0=