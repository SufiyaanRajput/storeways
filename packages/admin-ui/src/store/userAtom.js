import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage("user", null);

export const setUserAtom = atom(null, (_get, set, user) => {
  set(userAtom, user);
  if (user?.authToken) {
    localStorage.setItem("auth-token", user.authToken);
  }
});

export const clearUserAtom = atom(null, (_get, set) => {
  set(userAtom, null);
  localStorage.removeItem("auth-token");
  localStorage.removeItem("user");
});

