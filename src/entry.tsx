import { Link, useParams, useSearchParams } from "react-router-dom";
import { Icon, IconName } from "./icon.tsx";
import { parse_kind } from "./reddit/types.ts";
import * as Meta from "./meta.tsx";
import type { Link as LinkType, PostKind } from "./reddit/types.ts";
import styles from "./entry.module.css";

export function Entry(props: LinkType["data"] & { show_sub?: boolean }) {
  const [search] = useSearchParams();
  const post_kind = parse_kind(props);
  const href =
    post_kind === "link"
      ? props.url
      : relative_url(props.permalink) + "?" + search.toString();
  const params = useParams<"id">();
  const current = props.id === params.id;
  const images = props.preview?.images[0].resolutions;
  // images are in ascending size order. Try to use bigger one
  let image = images?.[1] || images?.[0];
  if (!image && props.thumbnail !== "self" && props.thumbnail !== "default") {
    image = {
      url: props.thumbnail,
      width: +props.thumbnail_width,
      height: +props.thumbnail_height,
    };
  }
  return (
    <li className={styles.Entry} data-current={current || undefined}>
      <Link to={href} className={styles.Thumbnail}>
        <Thumbnail icon={kind_icon(post_kind, props.stickied)} {...image} />
      </Link>
      <header>
        <h2>
          <Link to={href}>
            {props.title}{" "}
            {post_kind === "link" && (
              <Icon name="external" fill="currentcolor" size={16} />
            )}
          </Link>
        </h2>
        <div className={styles.Meta}>
          <Meta.Score>{props.score}</Meta.Score>
          {props.show_sub && <Meta.Subreddit>{props.subreddit}</Meta.Subreddit>}
          <Meta.Comments href={relative_url(props.permalink)}>
            {props.num_comments}
          </Meta.Comments>
          <Meta.Author>{props.author}</Meta.Author>
        </div>
      </header>
    </li>
  );
}

function relative_url(permalink: string) {
  return permalink.split("/").slice(3).join("/");
}

type ThumbnailProps = {
  url?: string;
  width?: number;
  height?: number;
  icon: IconName | false;
  fill?: string;
};

function Thumbnail({ url, width, height, icon }: ThumbnailProps) {
  return (
    <>
      {url ? (
        <img src={url} width={width} height={height} alt="" />
      ) : (
        <div className={styles.ThumbnailFallback} />
      )}
      {icon && <Icon name={icon} size={40} fill={url ? "white" : undefined} />}
    </>
  );
}

function kind_icon(kind: PostKind, stickied: boolean): IconName | false {
  if (stickied) return "stickied";
  switch (kind) {
    case "gallery":
      return "image";
    case "embed":
    case "video":
    case "gif":
      return "video";
    case "self":
      return "self";
    case "link":
      return "link";
    default:
      return false;
  }
}
