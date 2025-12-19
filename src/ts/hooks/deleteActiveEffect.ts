import { Listener } from "./index.ts";
import { ChatHandler } from "../chat-handler.ts";

const DeleteActiveEffect: Listener = {
    listen(): void {
        Hooks.on(
            "deleteActiveEffect",
            (activeEffect: any, _metadata: any, userId: any) => {
                const effect = activeEffect as ActiveEffect<any>;

                if (game.user.id !== userId) return;
                if (!(effect.parent instanceof Actor)) return;

                const isExpired =
                    activeEffect?.duration?.remaining !== null &&
                    activeEffect?.duration?.remaining <= 0;

                const chatHandler = new ChatHandler();
                const reason = game.i18n.localize(
                    isExpired
                        ? "EffectsToChat.ExpiredFrom"
                        : "EffectsToChat.RemovedFrom",
                );
                chatHandler.createChatForEffect({
                    effect,
                    reason,
                    actor: effect.parent,
                    isCreate: false,
                });
            },
        );
    },
};

export { DeleteActiveEffect };
