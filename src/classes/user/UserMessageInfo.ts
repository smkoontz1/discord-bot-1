const MESSAGE_COUNT_RESET_MS: number = 30000;

export class UserMessageInfo {
    username: string;
    messageResetTime: number;
    messageCount: number = 0;

    constructor(username: string) {
        this.username = username;
        this.messageResetTime = Date.now() + MESSAGE_COUNT_RESET_MS;
    }

    resetMessageCooldown(): void {
        this.messageCount = 1;
        this.messageResetTime = Date.now() + MESSAGE_COUNT_RESET_MS;
    }
}