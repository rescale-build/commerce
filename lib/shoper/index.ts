import { DEFAULT_TAGS } from './constants';
import { Product } from './types';

interface StoreReqeustProps {
  urlProps?: string[];
  tags?: string[];
  cache?: RequestCache;
  headers?: HeadersInit;
  revalidate?: number | false;
}

export default async function storeFetch<T>(
  endpoint: string,
  { urlProps, tags, cache, headers, revalidate }: Readonly<StoreReqeustProps>
): Promise<T | never> {
  let url = `https://${process.env.SHOPER_STORE_DOMAIN}/webapi/rest/${endpoint}`;

  if (urlProps) {
    url = `${url}/${urlProps.join('/')}/`;
  }

  try {
    const response = await fetch(url, {
      cache,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      next: {
        tags: (tags ?? []).concat(DEFAULT_TAGS),
        revalidate
      }
    });

    return response.json() as T;
  } catch (e) {
    throw {
      error: e
    };
  }
}

export class Store {
  /**
   * The store token used to authenticate requests to the Shoper API.
   * @private
   */
  private storeToken?: string;

  /**
   * Fetches the store token from the Shoper API.
   */
  constructor() {
    void this.getToken();
  }

  /**
   * Fetches the store token from the Shoper API.
   * @private
   */
  private async getToken() {
    if (this.storeToken) {
      return this.storeToken;
    }

    const response = await fetch(`https://${process.env.SHOPER_STORE_DOMAIN}/webapi/rest/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SHOPER_STORE_API_KEY}`
      }
    });

    const { token } = await response.json();

    this.storeToken = token;

    return token;
  }

  /**
   * The product endpoint.
   */
  public product = {
    endpoint: '/product',
    get: async (): Promise<Product> => {
      const token = await this.getToken();

      return storeFetch<Product>(this.product.endpoint, {
        tags: ['product'],
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    list: async (): Promise<Product[]> => {
      const token = await this.getToken();

      return storeFetch<Product[]>(this.product.endpoint, {
        tags: ['product', 'product-list'],
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  };
}
