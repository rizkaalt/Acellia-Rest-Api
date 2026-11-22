export interface DownloadItem {
  label: string;
  url: string;
  quality: "hd" | "sd" | "audio";
  type: "video" | "audio";
}
export interface MediaResult {
  platform: string;
  title: string;
  author: string;
  cover: string;
  duration?: number;
  downloads: DownloadItem[];
}
