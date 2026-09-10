/**
 * Image processing utilities for efficient CSV transmission of club logos
 */

export function getStandardLogoFileName(clubName: string, originalFileName?: string): string {
  const ext = originalFileName && originalFileName.includes('.')
    ? originalFileName.split('.').pop()?.toLowerCase() || 'png'
    : 'png';

  const cleanName = (clubName || 'club')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 25);

  return `escudo_${cleanName || 'equipo'}.${ext}`;
}

/**
 * Resizes and compresses an image data URL to a lightweight, compact Base64 PNG.
 * This prevents cell-overflow, memory crashes, and CSV bloat while preserving sharpness.
 */
export async function optimizeLogoImage(
  dataUrl: string,
  maxDimension = 120
): Promise<{ compactDataUrl: string; sizeKb: number }> {
  return new Promise((resolve) => {
    // If it's not a data URL (e.g., empty or external URL), return as is
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve({ compactDataUrl: dataUrl, sizeKb: 0 });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let { width, height } = img;
      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // High quality downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to compact PNG
        const compactDataUrl = canvas.toDataURL('image/png');
        const sizeKb = Math.round((compactDataUrl.length * 3) / 4 / 1024);
        resolve({ compactDataUrl, sizeKb });
      } else {
        resolve({ compactDataUrl: dataUrl, sizeKb: Math.round(dataUrl.length / 1024) });
      }
    };

    img.onerror = () => {
      resolve({ compactDataUrl: dataUrl, sizeKb: Math.round(dataUrl.length / 1024) });
    };

    img.src = dataUrl;
  });
}

/**
 * Downloads the current logo image with its standardized filename
 */
export function downloadLogoFile(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
