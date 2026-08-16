/**
 * Browser-side Image Compression Utility
 * Resizes images to max 1200px and converts to WebP format, targeting under 400KB.
 */

export interface CompressionResult {
  dataUrl: string;
  sizeBytes: number;
  sizeKB: number;
  width: number;
  height: number;
}

export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  targetMaxSizeBytes = 400 * 1024 // 400 KB
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('請選擇有效的圖片檔案（例如 JPG、PNG、WebP）'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('讀取圖片檔案失敗，請重新選取。'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('無法載入此圖片格式。'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scale
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('瀏覽器不支援 Canvas 圖像處理。'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Iterative quality adjustment for WebP
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/webp', quality);
        let sizeBytes = Math.round((dataUrl.length * 3) / 4);

        // If larger than target, try reducing quality
        if (sizeBytes > targetMaxSizeBytes) {
          quality = 0.65;
          dataUrl = canvas.toDataURL('image/webp', quality);
          sizeBytes = Math.round((dataUrl.length * 3) / 4);
        }

        if (sizeBytes > targetMaxSizeBytes) {
          quality = 0.45;
          dataUrl = canvas.toDataURL('image/webp', quality);
          sizeBytes = Math.round((dataUrl.length * 3) / 4);
        }

        if (sizeBytes > 1024 * 1024) {
          // Exceeds 1MB safety hard limit
          reject(new Error('圖片檔案過大（壓縮後仍超過 1MB），請選擇尺寸較小的圖片。'));
          return;
        }

        resolve({
          dataUrl,
          sizeBytes,
          sizeKB: Math.round(sizeBytes / 1024),
          width,
          height
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
