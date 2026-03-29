import { create } from "zustand";

interface ConfiguratorState {
  model: string | null;
  tier: string | null;
  color: string | null;
  quantity: number;
  basePrice: number;
  setModel: (model: string) => void;
  setTier: (tier: string) => void;
  setColor: (color: string) => void;
  setQuantity: (quantity: number) => void;
  setBasePrice: (price: number) => void;
  reset: () => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  model: null,
  tier: null,
  color: null,
  quantity: 1,
  basePrice: 0,
  setModel: (model) => set({ model, tier: null, color: null, basePrice: 0 }),
  setTier: (tier) => set({ tier }),
  setColor: (color) => set({ color }),
  setQuantity: (quantity) => set({ quantity }),
  setBasePrice: (basePrice) => set({ basePrice }),
  reset: () => set({ model: null, tier: null, color: null, quantity: 1, basePrice: 0 }),
}));
