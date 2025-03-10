import "../styles/style.scss"; // Keep or else vite will not include this
import { ChatHandler } from "./chat-handler.ts";
import { Settings } from "./settings.ts";

Hooks.once("init", () => {
    new Settings().register();
});

Hooks.on(
    "createActiveEffect",
    (activeEffect: any, _metadata: any, userId: any) => {
        const effect = activeEffect as ActiveEffect<any>;

        if (game.user.id !== userId) return;
        if (!(effect.parent instanceof Actor)) return;

        const chatHandler = new ChatHandler();
        chatHandler.createChatForEffect({
            effect,
            reason: game.i18n.localize(EN_JSON.EffectsToChat.AppliedTo),
            actor: effect.parent,
            isCreate: true,
        });
    },
);

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
                ? EN_JSON.EffectsToChat.ExpiredFrom
                : EN_JSON.EffectsToChat.RemovedFrom,
        );
        chatHandler.createChatForEffect({
            effect,
            reason,
            actor: effect.parent,
            isCreate: false,
        });
    },
);
