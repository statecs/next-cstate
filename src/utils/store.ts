import { atom } from 'jotai';

export const drawerAtom = atom(false);  // false indicates the drawer is initially closed
export const footerVisibilityAtom = atom(true);
export const drawerScrollAtom = atom(true);
export const responseMessageLengthAtom = atom(0);