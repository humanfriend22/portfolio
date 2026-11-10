// Image service: Astro's sharp service plus a `crop="left,top,right,bottom"` option (percentages removed from each edge).
// Registered in astro.config.ts. <Image {...imgProps(pic)} /> in lib/images.ts is what passes `crop`.
import sharp from 'sharp';
import sharpService from 'astro/assets/services/sharp';
import { baseService } from 'astro/assets';
import type { LocalImageService } from 'astro';

const service: LocalImageService = {
  ...sharpService,
  propertiesToHash: [...(baseService.propertiesToHash ?? []), 'crop'],

  // Keep `crop` out of the rendered <img> attributes
  getHTMLAttributes(options, config) {
    const { crop, ...rest } = options as typeof options & { crop?: string };
    return sharpService.getHTMLAttributes!(rest, config);
  },

  getURL(options, config) {
    const url = sharpService.getURL(options, config);
    const { crop } = options as { crop?: string };
    return crop ? `${url}${url.includes('?') ? '&' : '?'}crop=${crop}` : url;
  },

  parseURL(url, config) {
    const transform = sharpService.parseURL(url, config);
    const crop = url.searchParams.get('crop');
    return transform && crop ? { ...transform, crop } : transform;
  },

  async transform(input, options, config, logger) {
    const { crop, ...rest } = options as typeof options & { crop?: string };
    if (!crop) return sharpService.transform(input, rest, config, logger);

    // Cut the edges off first, then let the normal pipeline resize/convert what is left
    const [l, t, r, b] = crop.split(',').map(Number);
    const { width, height } = await sharp(input).rotate().metadata();
    const kept = await sharp(input)
      .rotate()
      .extract({
        left: Math.round(width! * l / 100),
        top: Math.round(height! * t / 100),
        width: Math.round(width! * (1 - (l + r) / 100)),
        height: Math.round(height! * (1 - (t + b) / 100)),
      })
      .toBuffer();
    return sharpService.transform(kept, rest, config, logger);
  },
};

export default service;
