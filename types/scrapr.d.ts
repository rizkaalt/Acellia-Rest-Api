declare module "@coflyn/scrapr" {
  type ScrapeResult = { status: boolean; result?: any; message?: string };
  type Fn = (url: string) => Promise<ScrapeResult>;
  export const tiktok: { snaptik: Fn; ssstik: Fn; tiktokio: Fn; savetik: Fn; tikdownloader: Fn };
  const scrapr: Record<string, any>;
  export default scrapr;
}
