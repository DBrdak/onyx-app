import { createUiStore } from "./boundUiStores";

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

export const useUserProfileStore = createUiStore<State & Actions>()((set) => ({
  ...DEFAULT_STATE,
  setProfileVariant: (profileVariant) => set({ profileVariant }),
  setNewEmail: (newEmail) => set({ newEmail }),
  setIsDeleting: (isDeleting) => set({ isDeleting }),
}));

export const useUserProfileVariant = () =>
  useUserProfileStore((state) => state.profileVariant);
export const useUserProfileNewEmail = () =>
  useUserProfileStore((state) => state.newEmail);
export const useUserProfileIsDeleting = () =>
  useUserProfileStore((state) => state.isDeleting);

export const useUserProfileActions = () => {
  const setProfileVariant = useUserProfileStore(
    (state) => state.setProfileVariant,
  );
  const setNewEmail = useUserProfileStore((state) => state.setNewEmail);
  const setIsDeleting = useUserProfileStore((state) => state.setIsDeleting);

  return {
    setProfileVariant,
    setNewEmail,
    setIsDeleting,
  };
};
