import { createContext, useState } from 'react';

const GlobalErrorContext = createContext({
  hasError: false,
  error: null,
  setGlobalError: () => {},
  clearGlobalError: () => {},
});

export default function GlobalErrorProvider({ children }) {
  const [state, setState] = useState({ hasError: false, error: null });

  const setGlobalError = (error) => setState({ hasError: true, error });
  const clearGlobalError = () => setState({ hasError: false, error: null });

  return (
    <GlobalErrorContext.Provider value={{ ...state, setGlobalError, clearGlobalError }}>
      {children}
    </GlobalErrorContext.Provider>
  );
}
