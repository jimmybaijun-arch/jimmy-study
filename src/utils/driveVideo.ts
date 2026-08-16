/**
 * Google Drive Video URL Parser
 * Converts various Google Drive sharing links into responsive preview/embed URLs.
 */

export interface DriveVideoParseResult {
  isValid: boolean;
  fileId: string | null;
  embedUrl: string | null;
  errorMessage?: string;
}

export function parseGoogleDriveVideoUrl(rawUrl: string): DriveVideoParseResult {
  if (!rawUrl || !rawUrl.trim()) {
    return {
      isValid: false,
      fileId: null,
      embedUrl: null,
    };
  }

  const url = rawUrl.trim();

  // Pattern 1: https://drive.google.com/file/d/{FILE_ID}/view or /preview or similar
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/);
  if (fileDMatch && fileDMatch[1]) {
    const fileId = fileDMatch[1];
    return {
      isValid: true,
      fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    };
  }

  // Pattern 2: https://drive.google.com/open?id={FILE_ID} or ?id={FILE_ID}
  const idQueryMatch = url.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  if (idQueryMatch && idQueryMatch[1]) {
    const fileId = idQueryMatch[1];
    return {
      isValid: true,
      fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    };
  }

  // Pattern 3: direct ID string
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(url)) {
    return {
      isValid: true,
      fileId: url,
      embedUrl: `https://drive.google.com/file/d/${url}/preview`,
    };
  }

  return {
    isValid: false,
    fileId: null,
    embedUrl: null,
    errorMessage: '無法辨識 Google Drive 影片網址，請確認分享連結是否正確（例如：https://drive.google.com/file/d/你的檔案ID/view）。',
  };
}
