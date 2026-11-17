import { HotReload } from "./hot-reload.ts";
import { Init } from "./init.ts";
import { CreateActiveEffect } from "./createActiveEffect.ts";
import { DeleteActiveEffect } from "./deleteActiveEffect.ts";
import { UpdateActiveEffect } from "./updateActiveEffect.ts";

interface Listener {
    listen(): void;
}

const HooksEffectsToChat: Listener = {
    listen(): void {
        const listeners: Listener[] = [HotReload, Init, CreateActiveEffect, UpdateActiveEffect, DeleteActiveEffect];

        for (const listener of listeners) {
            listener.listen();
        }
    },
};

export { HooksEffectsToChat };
export type { Listener };
