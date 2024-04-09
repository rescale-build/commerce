import { DEFAULT_TAGS } from './constants';

interface StoreReqeustProps {
  tags?: string[];
  cache?: RequestCache;
  headers?: HeadersInit;
  revalidate?: number | false;
}

export default async function storeFetch({
  tags,
  cache,
  headers,
  revalidate
}: Readonly<StoreReqeustProps>): Promise<Response> {
  return fetch(`https://${process.env.SHOPER_STORE_DOMAIN}/webapi/rest/`, {
    cache,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SHOPER_STORE_API_KEY}`,
      ...headers
    },
    next: {
      tags: (tags ?? []).concat(DEFAULT_TAGS),
      revalidate
    }
  });
}

export class Store {
  constructor() {}

  public product = {
    get() {
      return storeFetch({
        tags: ['product']
      });
    }
  };
}
