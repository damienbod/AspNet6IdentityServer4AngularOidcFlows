var UriEncoder = (function () {
    function UriEncoder() {
    }
    UriEncoder.prototype.encodeKey = function (key) {
        return encodeURIComponent(key);
    };
    UriEncoder.prototype.encodeValue = function (value) {
        return encodeURIComponent(value);
    };
    UriEncoder.prototype.decodeKey = function (key) {
        return decodeURIComponent(key);
    };
    UriEncoder.prototype.decodeValue = function (value) {
        return decodeURIComponent(value);
    };
    return UriEncoder;
}());
export { UriEncoder };
//# sourceMappingURL=uri-encoder.js.map