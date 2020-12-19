import { UserMessageInfo } from "../../classes/user/UserMessageInfo";

const MESSAGE_LIMIT: number = 5;

export class UserService {
    userMessageInfoMap: Map<string, UserMessageInfo> = new Map<string, UserMessageInfo>();
    
    messageAllowedFrom = (username: string): boolean => {
        let userInfo = this.userMessageInfoMap.get(username);
    
        if (userInfo === undefined) {
            this.userMessageInfoMap.set(username, new UserMessageInfo(username));
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
    }
}

