import { Listener } from "./index.ts";
import { ChatHandler } from "../chat-handler.ts";

const UpdateActiveEffect: Listener = {
    listen(): void {
        Hooks.on("updateActiveEffect", (activeEffect: any, changes: any, _metadata: any, userId: any) => {
            if (changes.duration?.expired !== true) return;

            const effect = activeEffect as ActiveEffect<any>;

            const chatHandler = new ChatHandler();
            if (!chatHandler.shouldSendToChat({ effect, userId, isCreate: false })) return;

            chatHandler.createChatForEffect({ effect, isCreate: false });
        });
    },
};

export { UpdateActiveEffect };
