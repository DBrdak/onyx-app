import { create } from "../initializeMemoryStore";
import { createSelectors } from "../createSelectors";

interface State {
  profileVariant:
    | "default"
    | "editEmailInput"
    | "editEmailSubmit"
    | "deleteAccount";
  newEmail: string;
  isDeleting: boolean;
}

interface Actions {
  setProfileVariant: (profileVariant: State["profileVariant"]) => void;
  setNewEmail: (newEmail: string) => void;
  setIsDeleting: (isDeleting: boolean) => void;
}

const DEFAULT_STATE: State = {
  profileVariant: "default",
  newEmail: "",
  isDeleting: false,
};

const userProfileStore = create<State & Actions>()((set) => ({
  ...DEFAULT_STATE,
  setProfileVariant: (profileVariant) => set({ profileVariant }),
  setNewEmail: (newEmail) => set({ newEmail }),
  setIsDeleting: (isDeleting) => set({ isDeleting }),
}));

export const useUserProfileStore = createSelectors(userProfileStore);
