import { DEFAULT_TAGS } from './constants';

interface StoreReqeustProps {
  tags?: string[];
  cache?: RequestCache;
  revalidate?: number | false;
}

export default async function storeRequest({
  tags,
  cache,
  revalidate
}: Readonly<StoreReqeustProps>) {
  return fetch(`https://${process.env.SHOPER_STORE_DOMAIN}/webapi/rest/`, {
    cache,
    next: {
      tags: (tags ?? []).concat(DEFAULT_TAGS),
      revalidate
    }
  });
}
