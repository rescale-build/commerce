export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface Product {
  product_id: number;
  type: number;
  producer_id?: number;
  group_id: number;
  tax_id: number;
  category_id: number;
  unit_id: number;
  add_date: string;
  edit_date: string;
  other_prise: number;
  promo_price: number;
  code: string;
  dimension_w: number;
  dimension_h: number;
  dimension_l: number;
  ean: string;
  pkwiu: string;
  is_product_of_day: boolean;
  loyalty_score?: number;
  loyalty_price?: number;
  in_loyalty: boolean;
  bestseller: boolean;
  newproduct: boolean;
  vol_weight: number;
  gauge_id?: number;
  currency_id: number;
  additional_isbn: string;
  additional_kgo: string;
  additional_bloz8: number;
  additional_bloz12: number;
  additional_gtu: string;
  additional_producer: string;
  additional_warehouse: string;
  related: number[];
  options: number[];
  main_image?: MainImage;
  stock: Stock;
  translations: Record<string, Translation>;
  attributes: Record<string, Record<string, number>>;
  categories: number[];
  special_offer: SpecialOffer;
  unit_price_calculation: boolean;
  children: ProductChildren;
  feeds_excludes: number[];
}

export interface MainImage {
  gfx_id: number;
  order: number;
  name: string;
  unic_name: string;
  hidden: boolean;
  extension: string;
}

export interface Translation {
  translation_id: number;
  product_id: number;
  name: string;
  short_description: string;
  description: string;
  active: boolean;
  isdefault: boolean;
  lang_id: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_url?: string;
  permalink: string;
  order: number;
  main_page: boolean;
  main_page_order: number;
}

export interface Stock {
  stock_id: number;
  product_id: number;
  extended: boolean;
  price: number;
  active: boolean;
  default: boolean;
  stock: number;
  warehouses: Record<string, Record<string, number>>;
  warn_level?: number;
  sold: number;
  code: string;
  ean: string;
  weight: number;
  weight_type: number;
  availability_id: number;
  delivery_id: number;
  gfx_id?: number;
  package: number;
  price_wholesale: number;
  price_special: number;
  calculation_unit_id: number;
  calculation_unit_ratio: number;
  historical_lowest_price: number;
  wholesale_historical_lowest_price: number;
  special_historical_lowest_price: number;
}

export interface SpecialOffer {
  promo_id: number;
  date_from: string;
  date_to: string;
  discount: number;
  discount_wholesale: number;
  discount_special: number;
  discount_type: number;
  condition_type: number;
  stocks: number[];
}

export interface ProductChildren {
  id: number;
  bundle_id: number;
  stock_id: number;
  product_id: number;
  stock: number;
  order: number;
}
