import { Init } from "./init.ts";
import { CreateActiveEffect } from "./createActiveEffect.ts";
import { DeleteActiveEffect } from "./deleteActiveEffect.ts";

interface Listener {
    listen(): void;
}

const HooksEffectsToChat: Listener = {
    listen(): void {
        const listeners: Listener[] = [
            Init,
            CreateActiveEffect,
            DeleteActiveEffect,
        ];

        for (const listener of listeners) {
            listener.listen();
        }
    },
};

export { HooksEffectsToChat };
export type { Listener };
