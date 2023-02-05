import { type ReactNode, useEffect, useState } from "react";
import { createContext, useContext, useMemo } from "react";
import type { Entry } from "../types";
import { api } from "../utils/api";
import { decrypt } from "../utils/encryption";

interface LoginInterface {
  username: string | null;
  encryptionKey: string | null;
  saves:
    | {
        date: Date;
        entries: Entry[];
      }[]
    | null;
  login: (
    username: string,
    encryptionKey: string,
    rememberMe?: boolean
  ) => void;
  logout: () => void;
}

const Login = createContext<LoginInterface | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const LoginProvider = ({ children }: Props) => {
  const [username, _setUsername] = useState<LoginInterface["username"]>(null);
  const [encryptionKey, _setEncryptionKey] =
    useState<LoginInterface["encryptionKey"]>(null);
  const [saves, _setSaves] = useState<LoginInterface["saves"]>(null);

  const savesQuery = api.saves.get.useQuery(
    {
      username,
    },
    {
      enabled: Boolean(username),
    }
  );

  useEffect(() => {
    const username = localStorage.getItem("username");
    const encryptionKey = localStorage.getItem("encryptionKey");
    _setUsername(username || null);
    _setEncryptionKey(encryptionKey || null);
  }, []);

  useEffect(() => {
    if (!savesQuery.data || !encryptionKey) return;

    const asyncWrapper = async () => {
      const saves = await Promise.all(
        savesQuery.data.map(async (save) => {
          return {
            date: save.date,
            entries: (await decrypt(save.entries, encryptionKey)).map(
              (entry) => ({
                ...entry,
                value: parseInt(entry.value),
              })
            ),
          };
        })
      );

      _setSaves(saves);
    };

    asyncWrapper();
  }, [savesQuery.data, encryptionKey]);

  const login: LoginInterface["login"] = (
    username,
    encryptionKey,
    rememberMe = false
  ) => {
    _setUsername(username);
    _setEncryptionKey(encryptionKey);
    if (rememberMe) {
      localStorage.setItem("username", username);
      localStorage.setItem("encryptionKey", encryptionKey);
    }
  };

  const logout: LoginInterface["logout"] = () => {
    _setUsername(null);
    _setEncryptionKey(null);
    localStorage.removeItem("username");
    localStorage.removeItem("encryptionKey");
  };

  const value = useMemo(
    () => ({
      username,
      encryptionKey,
      saves,
      login,
      logout,
    }),
    [username, encryptionKey, saves]
  );

  return <Login.Provider value={value}>{children}</Login.Provider>;
};

/**
 * Check for undefined since the defaultValue of the context is undefined. If
 * it's still undefined, the provider component is missing.
 */
export function useLogin() {
  const context = useContext(Login);
  if (!context) throw new Error("Provider missing!");
  return context;
}
