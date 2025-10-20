import { atom } from 'jotai';


interface User {
    id: string;
    family_name: string;
    given_name: string;
    picture: string;
    email: string;
    properties: Record<string, unknown>;
  }
  
  interface Role {
    id: string;
    key: string;
    name: string;
  }
  
export const drawerAtom = atom(false);  // false indicates the drawer is initially closed
export const footerVisibilityAtom = atom(false);  // false prevents footer from showing on initial mobile load
export const drawerScrollAtom = atom(true);
export const responseMessageLengthAtom = atom(0);
export const userAtom = atom<User | null>(null);
export const rolesAtom = atom<Role[]>([]);