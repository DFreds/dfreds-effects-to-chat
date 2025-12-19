import { MODULE_IDS } from "./constants.ts";
import { Settings } from "./settings.ts";

class ChatHandler {
    #settings: Settings;

    constructor() {
        this.#settings = new Settings();
    }

    shouldSendToChat({
        effect,
        userId,
    }: {
        effect: ActiveEffect<Actor>;
        userId: string;
    }): boolean {
        if (game.user.id !== userId) return false;
        if (!(effect.parent instanceof Actor)) return false;

        // TODO: short-term fix, this should be configurable if we send specific effects to chat
        const isAura = foundry.utils.getProperty(
            effect,
            `flags.${MODULE_IDS.CHRIS_PREMADES}.aura`,
        ) as boolean | undefined;
        if (isAura === true) return false;

        return true;
    }

    async createChatForEffect({
        effect,
        reason,
        actor,
        isCreate,
    }: {
        effect: ActiveEffect<Actor>;
        reason: string;
        actor: Actor;
        isCreate: boolean;
    }): Promise<ChatMessage | undefined> {
        const actorName = actor.token ? actor.token.name : actor.name;

        const chatMessage = await ChatMessage.create({
            author: game.userId,
            whisper: this.#getChatTargets(actor) ?? [],
            content: this.#getChatContent({
                effect,
                reason,
                actorName,
                isCreate,
            }),
        });

        return chatMessage;
    }

    #getChatContent({
        effect,
        reason,
        actorName,
        isCreate,
    }: {
        effect: ActiveEffect<Actor>;
        reason: string;
        actorName: string;
        isCreate: boolean;
    }): string {
        let message = `<div class="effects-chat-header"><strong>${effect.name}</strong> - ${reason} ${actorName}</div>`;
        if (
            this.#settings.showEffectDescription === "onAddOrRemove" ||
            (this.#settings.showEffectDescription === "onAddOnly" && isCreate)
        ) {
            message += `<hr class="effects-fancy-hr"><div class="effects-chat-description">${this.#getDescription(
                effect,
            )}</div>`;
        }

        return message;
    }

    #getChatTargets(actor: Actor): string[] | null {
        if (
            this.#settings.chatMessagePermissionAsRoleNumber ===
            CONST.USER_ROLES.PLAYER
        ) {
            return null;
        }

        return game.users
            .filter((user) => {
                const hasRole =
                    user.role >=
                    this.#settings.chatMessagePermissionAsRoleNumber;
                const ownsActor =
                    !!user?.character?.uuid &&
                    user.character.uuid === actor.uuid;

                if (this.#settings.sendChatToActorOwner) {
                    return hasRole || ownsActor;
                } else {
                    return hasRole;
                }
            })
            .map((user) => user.id);
    }

    #getDescription(effect: ActiveEffect<Actor>): string {
        const description = effect.description;
        const sanitizedDescription = description
            ? description.replace("<p>", "").replace("</p>", "")
            : "EffectsToChat.NoDescription";

        return game.i18n.localize(sanitizedDescription);
    }
}

export { ChatHandler };
