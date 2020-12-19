"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserMessageInfo_1 = require("../../classes/user/UserMessageInfo");
const MESSAGE_LIMIT = 5;
class UserService {
    constructor() {
        this.userMessageInfoMap = new Map();
        this.messageAllowedFrom = (username) => {
            let userInfo = this.userMessageInfoMap.get(username);
            if (userInfo === undefined) {
                this.userMessageInfoMap.set(username, new UserMessageInfo_1.UserMessageInfo(username));
                return true;
            }
            else if (Date.now() > userInfo.messageResetTime) {
                userInfo.resetMessageCooldown();
                return true;
            }
            userInfo.messageCount++;
            if (userInfo.messageCount <= MESSAGE_LIMIT) {
                return true;
            }
            return false;
        };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map