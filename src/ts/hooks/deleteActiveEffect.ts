import { Listener } from "./index.ts";
import { ChatHandler } from "../chat-handler.ts";

const DeleteActiveEffect: Listener = {
    listen(): void {
        Hooks.on("deleteActiveEffect", (activeEffect: any, _metadata: any, userId: any) => {
            const effect = activeEffect as ActiveEffect<any>;

            const chatHandler = new ChatHandler();
            if (!chatHandler.shouldSendToChat({ effect, userId, isCreate: false })) return;

            const isExpired = activeEffect?.duration?.remaining !== null && activeEffect?.duration?.remaining <= 0;

            const reason = game.i18n.localize(isExpired ? "EffectsToChat.ExpiredFrom" : "EffectsToChat.RemovedFrom");
            chatHandler.createChatForEffect({
                effect,
                reason,
                actor: effect.parent,
                isCreate: false,
            });
        });
    },
};

export { DeleteActiveEffect };
