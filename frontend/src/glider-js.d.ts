// src/glider-js.d.ts
declare module "glider-js" {
  interface GliderOptions {
    slidesToShow?: number;
    slidesToScroll?: number;
    draggable?: boolean;
    dots?: boolean | string | HTMLElement | null; // Fixed: Allow boolean values
    arrows?:
      | boolean
      | {
          prev: string | HTMLElement;
          next: string | HTMLElement;
        };
    responsive?: Array<{
      breakpoint: number;
      settings: {
        slidesToShow?: number;
        slidesToScroll?: number;
        draggable?: boolean;
        dots?: boolean | string | HTMLElement | null;
      };
    }>;
  }

  class Glider {
    constructor(element: HTMLElement, options?: GliderOptions);
    scrollItem(slide: number | HTMLElement, animate?: boolean): void;
    setOption(option: GliderOptions, global?: boolean): void;
    refresh(purgeCaches?: boolean): void;
    destroy(): void;
  }

  export = Glider;
}
