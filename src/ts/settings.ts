import { MODULE_ID } from "./constants.ts";

class Settings {
    // Settings keys
    #CHAT_MESSAGE_PERMISSION = "chatMessagePermission";
    #SHOW_EFFECT_DESCRIPTION = "showEffectDescription";
    #SEND_CHAT_TO_ACTOR_OWNER = "sendChatToActorOwner";

    register(): void {
        const userRoles: Record<string, string> = {};

        userRoles[CONST.USER_ROLE_NAMES[1]] = game.i18n.localize(
            "EffectsToChat.SettingPlayer",
        );
        userRoles[CONST.USER_ROLE_NAMES[2]] = game.i18n.localize(
            "EffectsToChat.SettingTrustedPlayer",
        );
        userRoles[CONST.USER_ROLE_NAMES[3]] = game.i18n.localize(
            "EffectsToChat.SettingAssistantGM",
        );
        userRoles[CONST.USER_ROLE_NAMES[4]] = game.i18n.localize(
            "EffectsToChat.SettingGameMaster",
        );

        game.settings.register(MODULE_ID, this.#CHAT_MESSAGE_PERMISSION, {
            name: "EffectsToChat.SettingChatMessagePermissionName",
            hint: "EffectsToChat.SettingChatMessagePermissionHint",
            scope: "world",
            config: true,
            default: CONST.USER_ROLE_NAMES[4],
            choices: userRoles,
            type: String,
        });

        game.settings.register(MODULE_ID, this.#SHOW_EFFECT_DESCRIPTION, {
            name: "EffectsToChat.SettingShowEffectDescriptionName",
            hint: "EffectsToChat.SettingShowEffectDescriptionHint",
            scope: "world",
            config: true,
            default: "onAddOrRemove",
            choices: {
                onAddOrRemove: game.i18n.localize(
                    "EffectsToChat.SettingOnAddOrRemove",
                ),
                onAddOnly: game.i18n.localize("EffectsToChat.SettingOnAddOnly"),
                never: game.i18n.localize("EffectsToChat.SettingNever"),
            },
            type: String,
        });

        game.settings.register(MODULE_ID, this.#SEND_CHAT_TO_ACTOR_OWNER, {
            name: "EffectsToChat.SendChatToActorOwnerName",
            hint: "EffectsToChat.SendChatToActorOwnerHint",
            scope: "world",
            config: true,
            default: false,
            type: Boolean,
        });
    }

    get chatMessagePermissionAsRoleNumber(): number {
        const roleName = game.settings.get(
            MODULE_ID,
            this.#CHAT_MESSAGE_PERMISSION,
        ) as string;

        const userRoleTypes: { [key: string]: number } = CONST.USER_ROLES;
        const roleNumber = userRoleTypes[roleName] as number;

        return roleNumber;
    }

    get showEffectDescription(): string {
        return game.settings.get(
            MODULE_ID,
            this.#SHOW_EFFECT_DESCRIPTION,
        ) as string;
    }

    get sendChatToActorOwner(): boolean {
        return game.settings.get(
            MODULE_ID,
            this.#SEND_CHAT_TO_ACTOR_OWNER,
        ) as boolean;
    }
}

export { Settings };
