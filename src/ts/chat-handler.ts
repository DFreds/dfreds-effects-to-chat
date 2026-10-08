import { CHRIS_PREMADES_ID } from "./constants.ts";
import { Settings } from "./settings.ts";

class ChatHandler {
    #settings = new Settings();

    shouldSendToChat({
        effect,
        userId,
        isCreate,
    }: {
        effect: ActiveEffect<Actor>;
        userId: string;
        isCreate: boolean;
    }): boolean {
        if (game.user.id !== userId) return false;
        if (!(effect.parent instanceof Actor)) return false;

        const sendChatMessage = this.#settings.sendChatMessage;
        if (sendChatMessage === "onAddOnly" && !isCreate) return false;
        if (sendChatMessage === "onRemoveOnly" && isCreate) return false;

        // TODO: short-term fix, this should be configurable if we send specific effects to chat
        const isAura = foundry.utils.getProperty(effect, `flags.${CHRIS_PREMADES_ID}.aura`) as boolean | undefined;
        if (isAura === true) return false;

        return true;
    }

    async createChatForEffect({
        effect,
        isCreate,
    }: {
        effect: ActiveEffect<Actor>;
        isCreate: boolean;
    }): Promise<ChatMessage | undefined> {
        const actor = effect.parent;
        const actorName = actor.token ? actor.token.name : actor.name;
        const reason = this.#getReason(effect, isCreate);

        return ChatMessage.create({
            author: game.userId,
            whisper: this.#getChatTargets(actor),
            content: this.#getChatContent({
                effect,
                reason,
                actorName,
                isCreate,
            }),
        });
    }

    #getReason(effect: ActiveEffect<Actor>, isCreate: boolean): string {
        if (isCreate) return game.i18n.localize("EffectsToChat.AppliedTo");

        const remaining = effect.duration.remaining;
        // @ts-expect-error PreparedEffectDurationData.remaining is typed as string, but is number | null
        const isExpired = remaining !== null && remaining <= 0;

        return game.i18n.localize(isExpired ? "EffectsToChat.ExpiredFrom" : "EffectsToChat.RemovedFrom");
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
        const effectName = game.i18n.localize(effect.name);
        let message = `<div class="effects-chat-header"><strong>${effectName}</strong> - ${reason} ${actorName}</div>`;
        if (
            this.#settings.showEffectDescription === "onAddOrRemove" ||
            (this.#settings.showEffectDescription === "onAddOnly" && isCreate)
        ) {
            message += `<hr class="effects-chat-fancy-hr"><div class="effects-chat-description">${this.#getDescription(
                effect,
            )}</div>`;
        }

        return message;
    }

    #getChatTargets(actor: Actor): string[] {
        const minimumRole = this.#settings.chatMessagePermissionAsRoleNumber;
        if (minimumRole === CONST.USER_ROLES.PLAYER) return [];

        const sendToOwner = this.#settings.sendChatToActorOwner;

        return game.users
            .filter((user) => {
                const hasRole = user.role >= minimumRole;
                const ownsActor = user.character?.uuid === actor.uuid;

                return hasRole || (sendToOwner && ownsActor);
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
