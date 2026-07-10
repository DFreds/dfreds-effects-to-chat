import { Listener } from "./index.ts";
import { ChatHandler } from "../chat-handler.ts";

const CreateActiveEffect: Listener = {
    listen(): void {
        Hooks.on("createActiveEffect", (activeEffect: any, _metadata: any, userId: any) => {
            const effect = activeEffect as ActiveEffect<any>;

            const chatHandler = new ChatHandler();
            if (!chatHandler.shouldSendToChat({ effect, userId })) return;

            chatHandler.createChatForEffect({
                effect,
                reason: game.i18n.localize("EffectsToChat.AppliedTo"),
                actor: effect.parent,
                isCreate: true,
            });
        });
    },
};

export { CreateActiveEffect };
