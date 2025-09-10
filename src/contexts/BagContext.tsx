// src/contexts/BagContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Bag, loadBag, saveBag } from "../features/bag/storage";

type BagContextType = {
  bag: Bag;
  setBag: React.Dispatch<React.SetStateAction<Bag>>;
  saveBagContext: () => Promise<void>;
};

const BagContext = createContext<BagContextType | undefined>(undefined);

export const BagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bag, setBag] = useState<Bag>({ updatedAt: Date.now(), clubs: [] });

  useEffect(() => {
    loadBag().then((b) => setBag(b));
  }, []);

  const saveBagContext = async () => {
    await saveBag(bag);
  };

  return (
    <BagContext.Provider value={{ bag, setBag, saveBagContext }}>
      {children}
    </BagContext.Provider>
  );
};

export const useBag = (): BagContextType => {
  const context = useContext(BagContext);
  if (!context) throw new Error("useBag must be used within a BagProvider");
  return context;
};
