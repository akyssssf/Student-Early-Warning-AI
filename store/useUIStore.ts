import { create } from "zustand";

type UIStore = {
  sidebarOpen: boolean;
  activeTab: string;
  theme: "light" | "dark";
  setSidebarOpen: (value: boolean) => void;
  setActiveTab: (value: string) => void;
  toggleTheme: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  activeTab: "dashboard",
  theme: "light",
  setSidebarOpen: (value) => set({ sidebarOpen: value }),
  setActiveTab: (value) => set({ activeTab: value }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));