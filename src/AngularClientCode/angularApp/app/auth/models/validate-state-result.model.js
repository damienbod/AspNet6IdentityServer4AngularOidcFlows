import { ValidationResult } from './validation-result.enum';
var ValidateStateResult = (function () {
    function ValidateStateResult(access_token, id_token, authResponseIsValid, decoded_id_token, state) {
        if (access_token === void 0) { access_token = ''; }
        if (id_token === void 0) { id_token = ''; }
        if (authResponseIsValid === void 0) { authResponseIsValid = false; }
        if (decoded_id_token === void 0) { decoded_id_token = {}; }
        if (state === void 0) { state = ValidationResult.NotSet; }
        this.access_token = access_token;
        this.id_token = id_token;
        this.authResponseIsValid = authResponseIsValid;
        this.decoded_id_token = decoded_id_token;
        this.state = state;
    }
    return ValidateStateResult;
}());
export { ValidateStateResult };
//# sourceMappingURL=validate-state-result.model.js.map