import { Settings } from "../settings.ts";
import { Listener } from "./index.ts";

const Init: Listener = {
    listen(): void {
        Hooks.once("init", () => {
            if (BUILD_MODE === "development") {
                CONFIG.debug.hooks = true;
            }

            new Settings().register();
        });
    },
};

export { Init };
