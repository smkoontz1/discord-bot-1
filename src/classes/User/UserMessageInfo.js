"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMessageInfo = void 0;
const MESSAGE_COUNT_RESET_MS = 10000;
class UserMessageInfo {
    constructor(username) {
        this.messageCount = 0;
        this.username = username;
        this.messageResetTime = Date.now() + MESSAGE_COUNT_RESET_MS;
    }
    resetMessageCooldown() {
        this.messageCount = 1;
        this.messageResetTime = Date.now() + MESSAGE_COUNT_RESET_MS;
    }
}
exports.UserMessageInfo = UserMessageInfo;
//# sourceMappingURL=UserMessageInfo.js.map