export interface Banner {
  id: number;
  url: string;
  link: string;
}

export interface Category {
  id: number;
  name: string;
  img: string;
}

export interface SubCategory {
  id: number;
  name: string;
  img: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  img: string;
  categoryId: number;
  subCategoryId: number;
  trending?: boolean;
  description?: string;
  url?: string;
}

export interface ShopInfo {
  about: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  whatsapp: string;
  outlets: string;
  googleMapsUrl?: string;
}

export interface AppData {
  settings: {
    showTrendingBanner: boolean;
    trendingBannerUrl: string;
    midBannerUrl?: string;
    footerStickyUrl?: string;
    promoBannerUrl?: string;
  };
  shopInfo?: ShopInfo;
  banners: Banner[];
  categories: Category[];
  subCategories: SubCategory[];
  products: Product[];
}
