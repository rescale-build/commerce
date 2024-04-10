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

export class Store {
  /**
   * The store token used to authenticate requests to the Shoper API.
   * @private
   */
  private storeToken?: string;

  /**
   * The Shoper API URL.
   * @private
   */
  private apiURL: string = `https://${process.env.SHOPER_STORE_DOMAIN}/webapi/rest/`;

  /**
   * Fetches the store token from the Shoper API.
   */
  constructor() {}

  /**
   * Fetches data from the Shoper API.
   * @param endpoint
   * @param urlProps
   * @param tags
   * @param cache
   * @param headers
   * @param revalidate
   * @param method
   * @private
   * @returns The fetched data.
   * @throws If the request fails.
   */
  private async storeFetch<T>(
    endpoint: string,
    { urlProps, tags, cache, headers, revalidate, method }: Readonly<StoreFetchProps>
  ): Promise<T | never> {
    let url = `${this.apiURL}${endpoint}`;

    if (urlProps) {
      url = `${url}/${urlProps.join('/')}/`;
    }

    const computedTags = (tags ?? []).concat([endpoint]).concat(DEFAULT_TAGS);

    try {
      const token = await this.getToken();

      const response = await fetch(url, {
        method,
        cache,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...headers
        },
        next: {
          tags: computedTags,
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

  /**
   * Fetches the store token from the Shoper API.
   * @private
   */
  private async getToken() {
    if (this.storeToken) {
      return this.storeToken;
    }

    const response = await fetch(`${this.apiURL}auth`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.SHOPER_CLIENT_ID}:${process.env.SHOPER_CLIENT_SECRET}`).toString('base64')}`
      }
    });

    const { access_token } = (await response.json()) as AuthResponse;

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
      return this.storeFetch<Product>(this.products.endpoint, {
        urlProps: [id.toString()],
        tags: [id.toString()]
      });
    },
    /**
     * Fetches a list of products from the Shoper API.
     */
    list: async (): Promise<Product[]> => {
      return this.storeFetch<Product[]>(this.products.endpoint, {
        tags: ['product-list']
      });
    }
  };

  /**
   * The product images endpoint.
   */
  public productImages = {
    endpoint: 'product-images',
    /**
     * Fetches a product image from the Shoper API.
     * @param id
     */
    get: async (id: Product['product_id']): Promise<Product> => {
      return this.storeFetch<Product>(this.productImages.endpoint, {
        urlProps: [id.toString()],
        tags: [id.toString()]
      });
    },
    /**
     * Fetches a list of product images from the Shoper API.
     */
    list: async (): Promise<Product[]> => {
      return this.storeFetch<Product[]>(this.productImages.endpoint, {
        tags: ['product-images-list']
      });
    }
  };
}
