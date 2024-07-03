'use client';

import { useAtom } from 'jotai';
import { userAtom, rolesAtom } from '@/utils/store';
import { useAuthStatus } from '@/contexts/AuthContext';
import { CollectionPageServer } from './CollectionPageServer';

interface Props {
    params: { collection: string };
    collection: any;
    serverAuthStatus: boolean;
  }

export const CollectionPageClient: React.FC<Props> = ({ params, collection }) => {
  const [user] = useAtom(userAtom);
  const [roles] = useAtom(rolesAtom);
  const { isAuthenticated, loading } = useAuthStatus();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CollectionPageServer
      params={params}
      collection={collection}
      isAuthenticated={isAuthenticated}
      roles={roles}
    />
  );
};