// Data murni (aman dipakai di client & server). Satu sumber kebenaran untuk API dan halaman docs.
export type Category = "Downloader" | "Resolver" | "Anime" | "Comic";

export interface ScrapeEndpoint {
  key: string; // contoh: "tiktok/snaptik" -> /api/v1/scrape/tiktok/snaptik
  group: string; // label platform / situs
  category: Category;
  input: "url" | "query";
  hosts?: string[]; // whitelist host; kosong = bebas selama host publik
  source: string; // situs sumber
  summary: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function row(category: Category, key: string, source: string, hosts?: string[]): ScrapeEndpoint {
  const parts = key.split("/");
  const action = parts[parts.length - 1];
  const group = parts.length === 3 || parts[0] === "resolver" ? parts[1] : parts[0];
  const input: "url" | "query" = action === "search" ? "query" : "url";
  let summary: string;
  if (action === "search") summary = `Cari judul di ${cap(group)}`;
  else if (action === "getEpisodes") summary = `Daftar episode dari URL anime ${cap(group)}`;
  else if (action === "getChapters") summary = `Daftar chapter dari URL komik ${cap(group)}`;
  else if (category === "Anime") summary = `Ambil stream/link unduhan episode ${cap(group)}`;
  else if (category === "Comic") summary = `Ambil gambar chapter ${cap(group)}`;
  else if (category === "Resolver") summary = `Resolve link ${cap(group)} ke URL unduhan langsung`;
  else summary = `Ambil link unduhan ${cap(group)} via ${source}`;
  return { key, group: cap(group), category, input, hosts, source, summary };
}

const D = (k: string, s: string, h: string[]) => row("Downloader", k, s, h);
const R = (k: string, s: string, h?: string[]) => row("Resolver", k, s, h);
const A = (k: string, s: string, h?: string[]) => row("Anime", k, s, h);
const C = (k: string, s: string, h?: string[]) => row("Comic", k, s, h);

const TERABOX = ["terabox.com", "1024terabox.com", "teraboxapp.com", "terabox.app", "4funbox.com", "mirrobox.com", "nephobox.com", "freeterabox.com", "momerybox.com", "tibibox.com"];
const DOOD = ["dood.to", "dood.la", "dood.ws", "dood.pm", "dood.so", "dood.watch", "dood.wf", "dood.re", "dood.sh", "dood.yt", "dood.cx", "ds2play.com", "doodstream.com", "d000d.com", "d0000d.com"];

export const SCRAPE_ENDPOINTS: ScrapeEndpoint[] = [
  D("applemusic/aplmate", "aplmate.com", ["music.apple.com", "apple.com"]),
  D("bilibili/direct", "bilibili.com", ["bilibili.com", "bilibili.tv", "b23.tv"]),
  D("douyin/direct", "douyin.com", ["douyin.com", "iesdouyin.com"]),
  D("facebook/snapsave", "snapsave.app", ["facebook.com", "fb.watch", "fb.com"]),
  D("facebook/fdown", "fdown.net", ["facebook.com", "fb.watch", "fb.com"]),
  D("soundcloud/klickaud", "klickaud.org", ["soundcloud.com"]),
  D("tiktok/snaptik", "snaptik.app", ["tiktok.com"]),
  D("tiktok/tiktokio", "tiktokio.com", ["tiktok.com"]),
  D("tiktok/savetik", "savetik.co", ["tiktok.com"]),
  D("tiktok/ssstik", "ssstik.io", ["tiktok.com"]),
  D("tiktok/tikdownloader", "tikdownloader.io", ["tiktok.com"]),
  D("youtube/ytmp3", "ytmp3.mobi", ["youtube.com", "youtu.be"]),
  D("youtube/ytmp3gg", "media.ytmp3.gg", ["youtube.com", "youtu.be"]),
  D("youtube/playlist", "youtube.com/playlist", ["youtube.com", "youtu.be"]),
  D("instagram/direct", "embed scrape", ["instagram.com", "instagr.am"]),
  D("instagram/indown", "indown.net", ["instagram.com", "instagr.am"]),
  D("instagram/snapsave", "snapsave.app", ["instagram.com", "instagr.am"]),
  D("instagram/snapinsta", "snapinsta.to", ["instagram.com", "instagr.am"]),
  D("pinterest/direct", "page scrape", ["pinterest.com", "pin.it"]),
  D("pinterest/pindown", "pindown.io", ["pinterest.com", "pin.it"]),
  D("bandcamp/direct", "page scrape", ["bandcamp.com"]),
  D("bandcamp/bandcampdownloader", "bandcampdownloader.app", ["bandcamp.com"]),
  D("pixiv/ajax", "pixiv.net / pixiv.re", ["pixiv.net", "pixiv.re"]),
  D("rednote/direct", "xiaohongshu.com", ["xiaohongshu.com", "rednote.com", "xhslink.com"]),
  D("spotify/spotisaver", "spotisaver.net", ["spotify.com", "spotify.link"]),
  D("spotify/spotidown", "spotidown.app", ["spotify.com", "spotify.link"]),
  D("spotify/spotmate", "spotmate.online", ["spotify.com", "spotify.link"]),
  D("spotify/soundloaders", "soundloaders.app", ["spotify.com", "spotify.link"]),
  D("twitter/direct", "api.fxtwitter.com", ["twitter.com", "x.com"]),
  D("twitter/tweeload", "tweeload.com", ["twitter.com", "x.com"]),
  D("twitter/tvd", "twittervideodownloader.com", ["twitter.com", "x.com"]),
  D("twitter/savetwt", "savetwt.com", ["twitter.com", "x.com"]),
  D("threads/threadster", "threadster.app", ["threads.net", "threads.com"]),
  D("reddit/rapidsave", "rapidsave.com", ["reddit.com", "redd.it"]),
  D("terabox/sechno", "sechno.com", TERABOX),

  R("resolver/mediafire", "mediafire.com", ["mediafire.com"]),
  R("resolver/sfile", "sfile.co / sfile.mobi", ["sfile.co", "sfile.mobi"]),
  R("resolver/sub2unlock", "sub2unlock.com", ["sub2unlock.com", "sub4unlock.com", "sub2unlock.net"]),
  R("resolver/rekonise", "rekonise.com", ["rekonise.com"]),
  R("resolver/safelinku", "safelinku.com", ["safelinku.com", "sfl.gl"]),
  R("resolver/unshorten", "shortlink universal (bit.ly, dub.sh, dll)"),
  R("resolver/pixeldrain", "pixeldrain.com", ["pixeldrain.com"]),
  R("resolver/catbox", "catbox.moe", ["catbox.moe"]),
  R("resolver/gdrive", "drive.google.com", ["drive.google.com", "docs.google.com"]),
  R("resolver/krakenfiles", "krakenfiles.com", ["krakenfiles.com"]),
  R("resolver/doodstream", "doodstream", DOOD),

  A("anime/otakudesu/search", "otakudesu"),
  A("anime/otakudesu/getEpisodes", "otakudesu"),
  A("anime/otakudesu/scrape", "otakudesu"),
  A("anime/gogoanime/search", "gogoanime"),
  A("anime/gogoanime/getEpisodes", "gogoanime"),
  A("anime/gogoanime/scrape", "gogoanime / megaplay.buzz"),
  A("anime/nimegami/scrape", "nimegami.id"),
  A("anime/animetosho/scrape", "animetosho.org"),

  C("comic/komikindo/search", "komikindo"),
  C("comic/komikindo/getChapters", "komikindo"),
  C("comic/komikindo/scrape", "komikindo"),
  C("comic/komiku/search", "api.komiku.org"),
  C("comic/komiku/getChapters", "komiku.org"),
  C("comic/komiku/scrape", "komiku.org"),
  C("comic/asurascans/search", "asuracomic.net"),
  C("comic/asurascans/getChapters", "asuracomic.net"),
  C("comic/asurascans/scrape", "asuracomic.net"),
  C("comic/kiryuu/scrape", "kiryuu.org"),
  C("comic/komikcast/scrape", "komikcast.bz"),
  C("comic/mangadex/scrape", "mangadex.org"),
  C("comic/bacakomik/scrape", "bacakomik.net"),
  C("comic/manhwaindo/scrape", "manhwaindo.id"),
  C("comic/mangabats/scrape", "mangabats.com"),
];

export function findEndpoint(key: string): ScrapeEndpoint | undefined {
  return SCRAPE_ENDPOINTS.find((e) => e.key === key);
}
