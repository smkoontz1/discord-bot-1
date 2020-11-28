"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareStringForApi = void 0;
let prepareStringForApi = (str) => {
    return str.toString().replace(/['"]/g, '');
};
exports.prepareStringForApi = prepareStringForApi;
//# sourceMappingURL=StringHelper.js.map