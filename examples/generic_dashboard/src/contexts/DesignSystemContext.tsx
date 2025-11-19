import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DesignSystem = 'shadcn' | 'akeneo';

interface DesignSystemContextType {
  designSystem: DesignSystem;
  setDesignSystem: (system: DesignSystem) => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export const DesignSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [designSystem, setDesignSystem] = useState<DesignSystem>('akeneo');

  return (
    <DesignSystemContext.Provider value={{ designSystem, setDesignSystem }}>
      {children}
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = (): DesignSystemContextType => {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
};
