/**
 * Utility to process host image and extract character with transparent background
 * so Koko is never boxed and can move freely across any dark or neon game show background.
 */

let cachedTransparentUrl: string | null = null;
let isProcessing = false;
const listeners: ((url: string) => void)[] = [];

export function getTransparentHostImage(
  sourceUrl = `${import.meta.env.BASE_URL}assets/aistudio/bbef74db-2e1c-4874-9ab4-1dd0520cb9c0_e1e6224b.webp`,
  onReady?: (url: string) => void
): string {
  if (cachedTransparentUrl) {
    if (onReady) onReady(cachedTransparentUrl);
    return cachedTransparentUrl;
  }

  if (typeof window === 'undefined') {
    return sourceUrl;
  }

  if (onReady) {
    listeners.push(onReady);
  }

  if (!isProcessing) {
    isProcessing = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sourceUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          cachedTransparentUrl = sourceUrl;
          broadcast(sourceUrl);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Process pixels to remove white/near-white backdrop
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // White or very light gray studio background detection
          const min = Math.min(r, g, b);
          const max = Math.max(r, g, b);
          const diff = max - min;

          // If low saturation and very high brightness (typical studio white/light gray background)
          if (diff < 15 && min > 232) {
            data[i + 3] = 0; // 100% transparent
          } else if (diff < 20 && min > 218) {
            // Smooth edge feathering
            const alphaFactor = Math.max(0, (232 - min) / 14);
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        cachedTransparentUrl = canvas.toDataURL('image/png');
        broadcast(cachedTransparentUrl);
      } catch (err) {
        console.warn('Transparent host cutout fallback:', err);
        cachedTransparentUrl = sourceUrl;
        broadcast(sourceUrl);
      }
    };

    img.onerror = () => {
      cachedTransparentUrl = sourceUrl;
      broadcast(sourceUrl);
    };
  }

  return cachedTransparentUrl || sourceUrl;
}

function broadcast(url: string) {
  while (listeners.length > 0) {
    const cb = listeners.shift();
    if (cb) cb(url);
  }
}
