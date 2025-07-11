import { useState } from "react";
import type { ReactNode } from "react";
import { AppContext } from "./AppContextContext";

// Define Clause interface
export interface Clause {
  title?: string;
  text: string;
  risk?: string;
  explanation?: string;
  saferClause?: string;
  negotiationTips?: string;
  financialImpact?: string;
  legalTerms?: string;
  riskIfUnchanged?: string;
  recommendation?: string;
  [key: string]: unknown;
}

// Replace any[] and any with Clause[] and Record<string, unknown>
export interface AppContextType {
  contractText: string;
  setContractText: (text: string) => void;
  analysis: {
    markdown: string;
    riskCount: number;
    clauses?: Clause[];
    summary?: Record<string, unknown>;
  } | null;
  setAnalysis: (a: AppContextType["analysis"]) => void;
  contractType: string;
  setContractType: (type: string) => void;
  jurisdiction: string;
  setJurisdiction: (j: string) => void;
  contractorType: string;
  setContractorType: (t: string) => void;
  projectType: string;
  setProjectType: (t: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
}

// moved to AppContextContext.tsx

export function AppProvider({ children }: { children: ReactNode }) {
  const [contractText, setContractText] = useState("");
  const [contractType, setContractType] = useState("Employment");
  const [jurisdiction, setJurisdiction] = useState("UK");
  const [contractorType, setContractorType] = useState("Freelancer");
  const [projectType, setProjectType] = useState("Software Development");
  const [userRole, setUserRole] = useState("Contractor");
  const [analysis, setAnalysis] = useState<AppContextType["analysis"]>(null);

  return (
    <AppContext.Provider
      value={{
        contractText,
        setContractText,
        contractType,
        setContractType,
        jurisdiction,
        setJurisdiction,
        contractorType,
        setContractorType,
        projectType,
        setProjectType,
        userRole,
        setUserRole,
        analysis,
        setAnalysis,
      }}
    >
      {children}
    </AppContext.Provider>
  );
} 