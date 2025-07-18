import { useContext } from "react";
import { AppContext } from "./AppContextContext";

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
} 