import { DEFAULT_TAGS } from './constants';
import { AuthResponse, Product } from './types';

interface StoreFetchProps {
  urlProps?: string[];
  tags?: string[];
  cache?: RequestCache;
  headers?: HeadersInit;
  revalidate?: number | false;
  method?: RequestInit['method'];
}

export default async function storeFetch<T>(
  endpoint: string,
  { urlProps, tags, cache, headers, revalidate, method }: Readonly<StoreFetchProps>
): Promise<T | never> {
  let url = `https://${process.env.SHOPER_STORE_DOMAIN}/webapi/rest/${endpoint}`;

  if (urlProps) {
    url = `${url}/${urlProps.join('/')}/`;
  }

  try {
    const response = await fetch(url, {
      method,
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

    const { access_token } = await storeFetch<AuthResponse>('auth', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.SHOPER_CLIENT_ID}:${process.env.SHOPER_CLIENT_SECRET}`).toString('base64')}`
      }
    });

    this.storeToken = access_token;

    return access_token;
  }

  /**
   * The product endpoint.
   */
  public products = {
    endpoint: 'products',
    /**
     * Fetches a product from the Shoper API.
     * @param id
     */
    get: async (id: Product['product_id']): Promise<Product> => {
      const token = this.storeToken ?? (await this.getToken());

      return storeFetch<Product>(this.products.endpoint, {
        urlProps: [id.toString()],
        tags: ['product', id.toString()],
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    /**
     * Fetches a list of products from the Shoper API.
     */
    list: async (): Promise<Product[]> => {
      const token = this.storeToken ?? (await this.getToken());

      return storeFetch<Product[]>(this.products.endpoint, {
        tags: ['product', 'product-list'],
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  };
}
