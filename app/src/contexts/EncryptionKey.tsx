import { type ReactNode, useEffect, useState } from "react";
import { createContext, useContext, useMemo } from "react";
import EncryptionKeyForm from "../components/EncryptionKeyForm";
import Modal from "../components/Modal";

interface EncryptionKeyInterface {
  encryptionKey: string | null;
  set: (encryptionKey: string, rememberMe?: boolean) => void;
  unset: () => void;
}

const EncryptionKey = createContext<EncryptionKeyInterface | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export const EncryptionKeyProvider = ({ children }: Props) => {
  const [encryptionKey, _setEncryptionKey] =
    useState<EncryptionKeyInterface["encryptionKey"]>(null);

  useEffect(() => {
    const encryptionKey = localStorage.getItem("encryptionKey");
    _setEncryptionKey(encryptionKey || null);
  }, []);

  const set: EncryptionKeyInterface["set"] = (
    encryptionKey,
    rememberMe = false
  ) => {
    _setEncryptionKey(encryptionKey);
    if (rememberMe) localStorage.setItem("encryptionKey", encryptionKey);
  };

  const unset: EncryptionKeyInterface["unset"] = () => {
    _setEncryptionKey(null);
    localStorage.removeItem("encryptionKey");
  };

  const value = useMemo(
    () => ({
      encryptionKey,
      set,
      unset,
    }),
    [encryptionKey]
  );

  return (
    <EncryptionKey.Provider value={value}>
      {children}

      <Modal isOpen={!encryptionKey} className="w-[480px]">
        <EncryptionKeyForm />
      </Modal>
    </EncryptionKey.Provider>
  );
};

/**
 * Check for undefined since the defaultValue of the context is undefined. If
 * it's still undefined, the provider component is missing.
 */
export function useEncryptionKey() {
  const context = useContext(EncryptionKey);
  if (!context) throw new Error("Provider missing!");
  return context;
}
