import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { createContext, useContext, useMemo } from "react";

interface IdInterface {
  id: string | null;
  setId: (value: string) => void;
}

const Id = createContext<IdInterface | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const IdProvider = ({ children }: Props) => {
  const [id, _setId] = useState<string | null>(null);

  useEffect(() => {
    const value = localStorage.getItem("id");
    _setId(value || null);
  }, []);

  const setId = (value: string) => {
    _setId(value);
    localStorage.setItem("id", value);
  };

  const value = useMemo(
    () => ({
      id,
      setId,
    }),
    [id]
  );

  return <Id.Provider value={value}>{children}</Id.Provider>;
};

/**
 * Check for undefined since the defaultValue of the context is undefined. If
 * it's still undefined, the provider component is missing.
 */
export function useId() {
  const context = useContext(Id);
  if (!context) throw new Error("Provider missing!");
  return context;
}
