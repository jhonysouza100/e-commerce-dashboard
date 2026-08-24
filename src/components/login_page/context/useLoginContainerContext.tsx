import { create } from 'zustand';

interface MenuContextState {
  openDrawer: boolean;
  openModal: boolean;
  anchorEl: HTMLElement | null;
  tabValue: number;
  setOpenDrawer: (isOpen: boolean) => void;
  handleOpenModal: (isOpen?: boolean) => void;
  handleOpenAccountMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseAccountMenu: () => void;
  setTabValue: (event: React.SyntheticEvent, newValue: number) => void;
}

export const useLoginContainerContext = create<MenuContextState>((set) => ({
  openDrawer: false,
  openModal: false,
  anchorEl: null,
  tabValue: 0,
  setOpenDrawer: (isOpen: boolean) => {
    set(() => ({ openDrawer: isOpen }));
  },
  handleOpenModal: (isOpen?: boolean) => {
    set(() => ({ openModal: isOpen }));
  },
  handleOpenAccountMenu: (event: React.MouseEvent<HTMLElement>) => {
    set(() => ({ anchorEl: event.currentTarget as HTMLElement }));
  },
  handleCloseAccountMenu: () => {
    set(() => ({ anchorEl: null }));
  },
  setTabValue: (event: React.SyntheticEvent, newValue: number) => {
    set(() => ({ tabValue: newValue }));
  },
}));