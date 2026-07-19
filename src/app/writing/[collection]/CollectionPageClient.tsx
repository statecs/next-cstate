'use client';

import { useAtom } from 'jotai';
import { userAtom, rolesAtom } from '@/utils/store';
import { useAuthStatus } from '@/contexts/AuthContext';
import { CollectionPageServer } from './CollectionPageServer';

interface Props {
    params: { collection: string };
    collection: any;
    serverAuthStatus: boolean;
    related?: React.ReactNode;
  }

export const CollectionPageClient: React.FC<Props> = ({
  params,
  collection,
  serverAuthStatus,
  related
}) => {
  const [user] = useAtom(userAtom);
  const [roles] = useAtom(rolesAtom);
  const { isAuthenticated, loading } = useAuthStatus();

  // The server already resolved auth from the session cookie, so the article
  // renders immediately instead of waiting on /api/auth-status. The client
  // value only takes over once it has actually landed.
  const authStatus = loading ? serverAuthStatus : isAuthenticated;

  return (
    <CollectionPageServer
      params={params}
      collection={collection}
      isAuthenticated={authStatus}
      roles={roles}
      related={related}
    />
  );
};