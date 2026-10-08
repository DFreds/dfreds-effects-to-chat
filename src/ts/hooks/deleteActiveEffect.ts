import { Listener } from "./index.ts";
import { ChatHandler } from "../chat-handler.ts";

const DeleteActiveEffect: Listener = {
    listen(): void {
        Hooks.on("deleteActiveEffect", (activeEffect: any, _metadata: any, userId: any) => {
            const effect = activeEffect as ActiveEffect<any>;

            const chatHandler = new ChatHandler();
            if (!chatHandler.shouldSendToChat({ effect, userId, isCreate: false })) return;

            chatHandler.createChatForEffect({ effect, isCreate: false });
        });
    },
};

export { DeleteActiveEffect };
