var JwtKeys = (function () {
    function JwtKeys() {
        this.keys = [];
    }
    return JwtKeys;
}());
export { JwtKeys };
var JwtKey = (function () {
    function JwtKey() {
        this.kty = '';
        this.use = '';
        this.kid = '';
        this.x5t = '';
        this.e = '';
        this.n = '';
        this.x5c = [];
    }
    return JwtKey;
}());
export { JwtKey };
//# sourceMappingURL=jwtkeys.js.map