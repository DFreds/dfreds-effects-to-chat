import { Listener } from "./index.ts";
import { ChatHandler } from "../chat-handler.ts";

const CreateActiveEffect: Listener = {
    listen(): void {
        Hooks.on(
            "createActiveEffect",
            (activeEffect: any, _metadata: any, userId: any) => {
                const effect = activeEffect as ActiveEffect<any>;

                if (game.user.id !== userId) return;
                if (!(effect.parent instanceof Actor)) return;

                const chatHandler = new ChatHandler();
                chatHandler.createChatForEffect({
                    effect,
                    reason: game.i18n.localize("EffectsToChat.AppliedTo"),
                    actor: effect.parent,
                    isCreate: true,
                });
            },
        );
    },
};

export { CreateActiveEffect };
