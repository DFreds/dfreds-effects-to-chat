import "../styles/style.scss"; // Keep or else vite will not include this
import { HooksEffectsToChat } from "./hooks/index.ts";

HooksEffectsToChat.listen();
