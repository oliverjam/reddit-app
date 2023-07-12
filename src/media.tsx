import { Link, parse_kind } from "./reddit/types.ts";
import styles from "./media.module.css";

export function Media(data: Link["data"]) {
  const source = parse_media(data);
  switch (source.kind) {
    case "crosspost":
      return <Media {...data?.crosspost_parent_list?.[0]!} />;
    case "image":
      return (
        <img
          loading="lazy"
          src={source.url}
          width={source.width}
          height={source.height}
          alt=""
        />
      );
    case "gallery":
      return (
        <ul className="Gallery">
          {source.images.map(({ url, width, height }) => {
            return (
              <li>
                <img
                  loading="lazy"
                  src={url}
                  width={width}
                  height={height}
                  alt=""
                />
              </li>
            );
          })}
        </ul>
      );
    case "video": {
      const AUDIO_REGEX = /DASH_\d+.mp4/;
      const audio_src = source.url.replace(AUDIO_REGEX, "DASH_audio.mp4");
      return (
        <div
          className={styles.Media}
          style={{ aspectRatio: `${source.width} / ${source.height}` }}
        >
          <video
            width={source.width}
            height={source.height}
            src={source.url}
            controls
            muted
            autoPlay
            playsInline
            loop
          ></video>
          <audio src={audio_src} playsInline loop></audio>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              const vid = document.querySelector("video");
              const aud = document.querySelector("audio");
              vid.addEventListener("playing", () => aud.play());
              vid.addEventListener("pause", () => aud.pause());
              vid.addEventListener("seeked", () => aud.currentTime = vid.currentTime);
              vid.addEventListener("ratechange", () => aud.playbackRate = vid.playbackRate);
            `,
            }}
          ></script>
        </div>
      );
    }
    case "gif":
      return (
        <video
          width={source.width}
          height={source.height}
          src={source.url}
          controls
          muted
          autoPlay
          playsInline
          loop
        ></video>
      );
    case "embed":
      return (
        <div
          className={styles.Media}
          style={{ aspectRatio: `${source.width} / ${source.height}` }}
          dangerouslySetInnerHTML={{ __html: source.html }}
        />
      );
    case "nothing":
      return null;
    case "mystery":
    default:
      return <div>Couldn't parse media</div>;
  }
}

type MediaKind =
  | Image
  | Gif
  | Gallery
  | Video
  | Embed
  | Crosspost
  | Mystery
  | Nothing;
type Image = { kind: "image"; url: string; width: number; height: number };
type Video = { kind: "video"; url: string; width: number; height: number };
type Gif = { kind: "gif"; url: string; width: number; height: number };
type Embed = { kind: "embed"; html: string; width: number; height: number };
type Crosspost = { kind: "crosspost" };
type Mystery = { kind: "mystery" };
type Nothing = { kind: "nothing" };
type Gallery = {
  kind: "gallery";
  images: Array<{ url: string; width: number; height: number }>;
};

function parse_media(data: Link["data"]): MediaKind {
  if (data.crosspost_parent_list) return { kind: "crosspost" };

  const kind = parse_kind(data);
  switch (kind) {
    case "image":
      return { kind: "image", ...data?.preview?.images[0].source! };
    case "gallery":
      return {
        kind: "gallery",
        images: data.gallery_data.items.map(({ media_id }) => {
          const { s } = data.media_metadata[media_id];
          return { url: s.u, width: s.x, height: s.y };
        }),
      };
    case "video": {
      const source =
        data.media?.reddit_video || data.preview?.reddit_video_preview!;
      return {
        kind: "video",
        url: source.fallback_url,
        width: source.width,
        height: source.height,
      };
    }
    case "embed":
      return { kind: "embed", ...data?.media?.oembed! };
    case "gif":
      return { kind: "gif", ...data.preview?.images[0]?.variants?.mp4.source! };
    case "link":
    case "self":
      return { kind: "nothing" };
    default:
      return { kind: "mystery" };
  }
}
