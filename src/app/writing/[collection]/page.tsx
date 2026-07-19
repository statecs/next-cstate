import { draftMode } from 'next/headers';
import { fetchWriting, fetchRelatedIndex } from '@/utils/contentful';
import { getCollectionSeo } from '@/utils/helpers';
import config from '@/utils/config';
import { CollectionPageClient } from './CollectionPageClient';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { findRelated, normalizeTags } from '@/utils/related';
import RelatedPosts from '@/components/RelatedPosts';

interface Props {
  params: { collection: string };
}

export const generateMetadata = async ({params}: Props) => {
  const collection = await fetchWriting(params.collection);
  if (!collection) return null;

  const collectionSeo = getCollectionSeo(collection);
  return {...config.seo, ...collectionSeo};
};

export const revalidate = 86400; // 24 hours

export default async function CollectionPage({ params }: Props) {
  const { isEnabled: isDraftModeEnabled } = draftMode();
  const collection = await fetchWriting(params.collection, isDraftModeEnabled);
  
  const { isAuthenticated } = getKindeServerSession();
  const authStatus = await isAuthenticated();

  const { writings } = await fetchRelatedIndex(isDraftModeEnabled);
  const related = findRelated(
    { slug: params.collection, tags: normalizeTags(collection?.category) },
    writings,
    { includePrivate: authStatus }
  );

  return (
    <CollectionPageClient
      params={params}
      collection={collection}
      serverAuthStatus={authStatus}
      related={<RelatedPosts items={related} heading="More writing" />}
    />
  );
}