import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import { fileToText } from "../utils/fileToText";
import { analyzeContract } from "../utils/analyzeContract";
import LoadingSpinner from "../components/LoadingSpinner";
import logo from '../../logo.jpg';
import Select from 'react-select';

const contractTypes = [
  "Employment Contract",
  "Service Agreement / Contractor Agreement", 
  "Sale of Goods Contract",
  "Lease Agreement",
  "Non-Disclosure Agreement (NDA)",
  "Partnership Agreement",
  "Loan Agreement",
  "Franchise Agreement",
  "Construction Contract",
  "Agency Agreement",
  "Other"
];
// Replace the jurisdictions array with detailed options
const jurisdictionOptions = [
  {
    group: 'UK Jurisdiction Options',
    options: [
      {
        label: 'England and Wales (Exclusive)',
        value: 'England and Wales (Exclusive)',
        description: 'This Agreement shall be governed by and construed in accordance with the laws of England and Wales, and the parties submit to the exclusive jurisdiction of the courts of England and Wales.'
      },
      {
        label: 'Scotland (Exclusive)',
        value: 'Scotland (Exclusive)',
        description: 'This Agreement shall be governed by and construed in accordance with Scots law, and the parties submit to the exclusive jurisdiction of the Scottish courts.'
      },
      {
        label: 'Northern Ireland',
        value: 'Northern Ireland',
        description: 'This Agreement shall be governed by and construed in accordance with the laws of Northern Ireland. The courts of Northern Ireland shall have exclusive jurisdiction.'
      },
      {
        label: 'UK-Wide (Broad UK Reference)',
        value: 'UK-Wide (Broad UK Reference)',
        description: 'This Agreement shall be governed by the laws of the United Kingdom, and the parties agree to submit to the jurisdiction of the UK courts appropriate to the location of the claimant.'
      },
    ]
  },
  {
    group: 'International Jurisdiction Options',
    options: [
      {
        label: 'New York, USA',
        value: 'New York, USA',
        description: 'This Agreement shall be governed by the laws of the State of New York, USA, and the parties irrevocably submit to the exclusive jurisdiction of the courts located in New York, New York.'
      },
      {
        label: 'Delaware, USA',
        value: 'Delaware, USA',
        description: 'This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, and the parties consent to the jurisdiction of its courts.'
      },
      {
        label: 'Singapore',
        value: 'Singapore',
        description: 'This Agreement shall be governed by and construed in accordance with the laws of Singapore. Disputes shall be subject to the exclusive jurisdiction of the Singapore courts.'
      },
      {
        label: 'Ireland (EU-Compatible)',
        value: 'Ireland (EU-Compatible)',
        description: 'This Agreement shall be governed by Irish law, and any disputes shall be resolved exclusively in the courts of Ireland.'
      },
      {
        label: 'Germany',
        value: 'Germany',
        description: 'This Agreement shall be governed by German law, and the parties agree to the exclusive jurisdiction of the courts in Frankfurt am Main, Germany.'
      },
      {
        label: 'Switzerland',
        value: 'Switzerland',
        description: 'This Agreement shall be governed by Swiss law. Any dispute arising shall be subject to the exclusive jurisdiction of the courts of Zurich, Switzerland.'
      },
    ]
  },
  {
    group: 'Arbitration Clauses',
    options: [
      {
        label: 'LCIA (London) Arbitration',
        value: 'LCIA (London) Arbitration',
        description: 'Any dispute shall be finally resolved by arbitration under the LCIA Rules. The seat of arbitration shall be London, England. The language shall be English.'
      },
      {
        label: 'ICC Arbitration (Paris)',
        value: 'ICC Arbitration (Paris)',
        description: 'All disputes shall be resolved under the ICC Rules of Arbitration by one or more arbitrators appointed in accordance with said Rules. The seat of arbitration shall be Paris, France.'
      },
      {
        label: 'UNCITRAL Arbitration (Neutral)',
        value: 'UNCITRAL Arbitration (Neutral)',
        description: 'Any dispute arising from this Agreement shall be resolved under the UNCITRAL Arbitration Rules, with the seat of arbitration in The Hague, Netherlands.'
      },
    ]
  },
  {
    group: 'Flexible / Hybrid Options',
    options: [
      {
        label: 'Non-Exclusive Jurisdiction (Flexible Forum)',
        value: 'Non-Exclusive Jurisdiction (Flexible Forum)',
        description: 'The courts of England and Wales shall have non-exclusive jurisdiction, and nothing in this clause shall limit either party’s right to take proceedings in any other jurisdiction.'
      },
      {
        label: 'Split Jurisdiction (Different Laws / Forums for Different Issues)',
        value: 'Split Jurisdiction (Different Laws / Forums for Different Issues)',
        description: 'This Agreement shall be governed by English law. However, disputes related to intellectual property shall be resolved under the laws of the United States, with jurisdiction in New York courts.'
      },
    ]
  },
];
// Expanded options for Your Role, Project Type, and Analysis Perspective
const contractorTypes = [
  "Freelancer",
  "Agency",
  "Employee",
  "Consultant",
  "Contractor",
  "Partner",
  "Vendor",
  "Supplier",
  "Advisor",
  "Director",
  "Shareholder",
  "Investor",
  "Founder",
  "Board Member",
  "Other"
];
const projectTypes = [
  "Software Development",
  "Consulting",
  "Design",
  "Marketing",
  "Content Creation",
  "Legal Services",
  "Financial Services",
  "Construction",
  "Research & Development",
  "Healthcare",
  "Education & Training",
  "Event Management",
  "Real Estate",
  "Manufacturing",
  "Logistics & Supply Chain",
  "Other"
];
const userRoles = [
  "Contractor",
  "Client",
  "Employee",
  "Consultant",
  "Project Manager",
  "Legal Counsel",
  "Business Owner",
  "Procurement Officer",
  "HR Manager",
  "Operations Manager",
  "Finance Director",
  "CEO / Executive",
  "Board Member",
  "Investor",
  "Other"
];

// Helper functions for react-select
const toSelectOption = (value: string) => ({ value, label: value });
const toSelectOptions = (arr: string[]) => arr.map(toSelectOption);
// Add explicit types for react-select style functions
const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isDisabled ? '#f3f4f6' : (state.selectProps.menuIsOpen ? '#f0fdfa' : '#fff'),
    borderColor: state.isFocused ? '#34d399' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px #6ee7b7' : '0 1px 2px 0 rgba(16,24,40,0.05)',
    borderRadius: '0.75rem',
    minHeight: 48,
    fontSize: 16,
    color: '#111827',
    transition: 'all 0.2s',
    '&:hover': { borderColor: '#34d399' },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '0.75rem',
    boxShadow: '0 8px 32px 0 rgba(16,24,40,0.18)',
    zIndex: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111827',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#34d399'
      : state.isFocused
      ? '#d1fae5'
      : '#fff',
    color: state.isSelected ? '#fff' : '#111827',
    padding: '12px 20px',
    cursor: 'pointer',
    fontWeight: state.isSelected ? 600 : 400,
    borderBottom: '1px solid #f3f4f6',
    transition: 'all 0.15s',
  }),
  singleValue: (provided: any) => ({ ...provided, color: '#111827', fontWeight: 500 }),
  groupHeading: (provided: any) => ({ ...provided, color: '#10b981', fontWeight: 700, fontSize: 15, padding: '8px 20px 4px' }),
  input: (provided: any) => ({ ...provided, color: '#111827' }),
  placeholder: (provided: any) => ({ ...provided, color: '#6b7280' }),
  dropdownIndicator: (provided: any) => ({ ...provided, color: '#34d399' }),
  indicatorSeparator: () => ({ display: 'none' }),
};

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    setContractText,
    contractType,
    setContractType,
    jurisdiction,
    setJurisdiction,
    setAnalysis,
    contractorType,
    setContractorType,
    projectType,
    setProjectType,
    userRole,
    setUserRole,
  } = useAppContext();

  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Helper: check if all required fields are selected
  const allFieldsSelected = !!(fileName && contractType && jurisdiction && contractorType && projectType && userRole);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Please select a file.");
      setLoading(false);
      return;
    }
    if (
      !["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(
        file.type
      )
    ) {
      setError("Only PDF or DOCX files are allowed.");
      setLoading(false);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      setLoading(false);
      return;
    }

    try {
      const text = await fileToText(file);
      setContractText(text);

      const analysis = await analyzeContract(
        text,
        contractType,
        jurisdiction,
        contractorType,
        projectType,
        userRole
      );
      setAnalysis(analysis);

      setLoading(false);
      navigate("/results");
    } catch {
      setError("Failed to process file.");
      setLoading(false);
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
        setFileName(file.name);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1f36] to-[#232946] text-white px-4 py-8">
      {/* Professional Header */}
      <div className="w-full max-w-2xl mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={logo} alt="ClauseHound logo" className="w-12 h-12 rounded-xl shadow-lg" />
          <h1 className="text-3xl font-bold text-emerald-400">Upload Contract</h1>
        </div>
        <p className="text-lg text-gray-300">
          Upload your contract for AI-powered risk analysis and professional legal insights
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-white/95 dark:bg-[#232946]/95 p-8 rounded-3xl shadow-2xl w-full max-w-2xl animate-fadeInUp relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-[#232946]/80 flex items-center justify-center z-20 rounded-3xl">
            <LoadingSpinner />
            <span className="ml-4 text-emerald-600 dark:text-emerald-300 text-lg font-semibold" aria-live="polite">Analyzing your contract...</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
          
          {/* File Upload Section */}
          <div>
            <label className="block mb-3 font-semibold text-gray-900 dark:text-white text-lg">
              📄 Contract File
            </label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer group ${
                dragActive 
                  ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 bg-gray-50 dark:bg-gray-800/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                ref={fileInputRef}
                className="hidden"
                onChange={e => setFileName(e.target.files?.[0]?.name || "")}
              />
              
              <div className="text-center">
                <div className="text-4xl mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-200">
                  <svg className="inline w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-medium">
                  {dragActive ? "Drop your contract here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Supports PDF and DOCX files (max 5MB)
                </p>
              </div>
            </div>
            
            {fileName && (
              <div className="flex items-center justify-between mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700 animate-pulse animate-duration-700 animate-once">
                <span className="text-sm text-emerald-700 dark:text-emerald-300 truncate">
                  Selected: {fileName}
                </span>
                <span className="text-2xl animate-fadeInUp animate-bounce">✅</span>
              </div>
            )}
          </div>

          {/* Loading Progress */}
          {loading && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Analyzing your contract...</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}

          {/* Contract Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-emerald-500">⚙️</span>
              Contract Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="contract-type-select">
                    Contract Type
                  </label>
                  <Select
                    inputId="contract-type-select"
                    isDisabled={loading}
                    value={toSelectOption(contractType)}
                    onChange={opt => setContractType(opt?.value || contractType)}
                    options={toSelectOptions(contractTypes)}
                    styles={{
                      ...customSelectStyles,
                      control: (base, state) => ({
                        ...customSelectStyles.control(base, state),
                        borderColor: !contractType && !loading ? '#f87171' : customSelectStyles.control(base, state).borderColor,
                        boxShadow: !contractType && !loading ? '0 0 0 2px #f87171' : customSelectStyles.control(base, state).boxShadow,
                      })
                    }}
                    classNamePrefix="clausehound-select"
                    placeholder="Select contract type..."
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Choose the type of contract you are analyzing.</div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="jurisdiction-select">
                    Jurisdiction
                  </label>
                  <Select
                    inputId="jurisdiction-select"
                    isDisabled={loading}
                    value={jurisdictionOptions.flatMap(g => g.options).map(opt => ({ value: opt.value, label: opt.label })).find(opt => opt.value === jurisdiction) || null}
                    onChange={opt => setJurisdiction(opt?.value || jurisdiction)}
                    options={jurisdictionOptions.map(g => ({
                      label: g.group,
                      options: g.options.map(opt => ({
                        value: opt.value,
                        label: opt.label,
                        description: opt.description
                      }))
                    }))}
                    styles={{
                      ...customSelectStyles,
                      control: (base, state) => ({
                        ...customSelectStyles.control(base, state),
                        borderColor: !jurisdiction && !loading ? '#f87171' : customSelectStyles.control(base, state).borderColor,
                        boxShadow: !jurisdiction && !loading ? '0 0 0 2px #f87171' : customSelectStyles.control(base, state).boxShadow,
                      })
                    }}
                    classNamePrefix="clausehound-select"
                    placeholder="Select jurisdiction..."
                    formatOptionLabel={(opt: any, { context }: any) => (
                      <div>
                        <div>{opt.label}</div>
                        {context === 'menu' && 'description' in opt && opt.description && (
                          <div className="text-xs text-gray-500 mt-1">{opt.description}</div>
                        )}
                      </div>
                    )}
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select the legal jurisdiction for this contract.</div>
                  {/* Show the description of the selected jurisdiction below the dropdown */}
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 min-h-[2.5em]">
                    {jurisdictionOptions.flatMap(g => g.options).find(opt => opt.value === jurisdiction)?.description}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="contractor-type-select">
                    Your Role
                  </label>
                  <Select
                    inputId="contractor-type-select"
                    isDisabled={loading}
                    value={toSelectOption(contractorType)}
                    onChange={opt => setContractorType(opt?.value || contractorType)}
                    options={toSelectOptions(contractorTypes)}
                    styles={{
                      ...customSelectStyles,
                      control: (base, state) => ({
                        ...customSelectStyles.control(base, state),
                        borderColor: !contractorType && !loading ? '#f87171' : customSelectStyles.control(base, state).borderColor,
                        boxShadow: !contractorType && !loading ? '0 0 0 2px #f87171' : customSelectStyles.control(base, state).boxShadow,
                      })
                    }}
                    classNamePrefix="clausehound-select"
                    placeholder="Select your role..."
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Choose your role in this contract.</div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="project-type-select">
                    Project Type
                  </label>
                  <Select
                    inputId="project-type-select"
                    isDisabled={loading}
                    value={toSelectOption(projectType)}
                    onChange={opt => setProjectType(opt?.value || projectType)}
                    options={toSelectOptions(projectTypes)}
                    styles={{
                      ...customSelectStyles,
                      control: (base, state) => ({
                        ...customSelectStyles.control(base, state),
                        borderColor: !projectType && !loading ? '#f87171' : customSelectStyles.control(base, state).borderColor,
                        boxShadow: !projectType && !loading ? '0 0 0 2px #f87171' : customSelectStyles.control(base, state).boxShadow,
                      })
                    }}
                    classNamePrefix="clausehound-select"
                    placeholder="Select project type..."
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select the type of project or service.</div>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300" htmlFor="user-role-select">
                    Analysis Perspective
                  </label>
                  <Select
                    inputId="user-role-select"
                    isDisabled={loading}
                    value={toSelectOption(userRole)}
                    onChange={opt => setUserRole(opt?.value || userRole)}
                    options={toSelectOptions(userRoles)}
                    styles={{
                      ...customSelectStyles,
                      control: (base, state) => ({
                        ...customSelectStyles.control(base, state),
                        borderColor: !userRole && !loading ? '#f87171' : customSelectStyles.control(base, state).borderColor,
                        boxShadow: !userRole && !loading ? '0 0 0 2px #f87171' : customSelectStyles.control(base, state).boxShadow,
                      })
                    }}
                    classNamePrefix="clausehound-select"
                    placeholder="Select analysis perspective..."
                  />
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Choose the perspective for the analysis (e.g., client, contractor, legal counsel).</div>
                </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-red-700 dark:text-red-300" aria-live="polite">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            disabled={loading || !allFieldsSelected}
            aria-label="Analyze Contract"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Contract...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Analyze Contract</span>
                <span className="inline-block group-hover:animate-pulseArrow">➔</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>🔒 Your contract data is processed securely and not stored</p>
        <p className="mt-1">⚖️ Analysis provided by AI - consult legal professionals for critical decisions</p>
      </div>
    </div>
  );
} 