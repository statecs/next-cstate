import { draftMode } from 'next/headers';
import { fetchWriting } from '@/utils/contentful';
import { getCollectionSeo } from '@/utils/helpers';
import config from '@/utils/config';
import { CollectionPageClient } from './CollectionPageClient';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface Props {
  params: { collection: string };
}

export const generateMetadata = async ({params}: Props) => {
  const collection = await fetchWriting(params.collection);
  if (!collection) return null;

  const collectionSeo = getCollectionSeo(collection);
  return {...config.seo, ...collectionSeo};
};

export const revalidate = 60;

export default async function CollectionPage({ params }: Props) {
  const { isEnabled: isDraftModeEnabled } = draftMode();
  const collection = await fetchWriting(params.collection, isDraftModeEnabled);
  
  const { isAuthenticated } = getKindeServerSession();
  const authStatus = await isAuthenticated();

  return <CollectionPageClient params={params} collection={collection} serverAuthStatus={authStatus} />;
}