import { Link, useParams, useSearchParams } from "react-router-dom";
import { Icon, IconName } from "./icon.tsx";
import { parse_kind } from "./reddit/types.ts";
import * as Meta from "./meta.tsx";
import type { Link as LinkType, PostKind } from "./reddit/types.ts";
import clsx from "clsx";

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
    <li
      className={clsx(
        "relative flex gap-3 md:gap-5 items-start md:items-center rounded-lg p-3 -mx-3 scroll-my-3",
        { "bg-[AccentColor] text-[AccentColorText]": current }
      )}
    >
      <div className="flex-none grid place-items-center rounded-lg bg-[ButtonFace] w-12 md:w-14 lg:w-18 xl:w-24 aspect-square overflow-hidden">
        <Thumbnail icon={kind_icon(post_kind, props.stickied)} {...image} />
      </div>
      <header>
        <h2>
          <Link to={href} className="after:absolute after:inset-0">
            {props.title}{" "}
            {post_kind === "link" && (
              <Icon
                name="external"
                className="inline align-baseline"
                fill="currentcolor"
                size={12}
              />
            )}
          </Link>
        </h2>
        <div className="flex gap-2 flex-wrap mt-2 text-xs md:text-sm z-10 isolate max-w-max">
          <Meta.Score>{props.score}</Meta.Score>
          {props.show_sub && <Meta.Subreddit>{props.subreddit}</Meta.Subreddit>}
          <Meta.Comments href={relative_url(props.permalink)}>
            {props.num_comments}
          </Meta.Comments>
          {!props.show_sub && <Meta.Author>{props.author}</Meta.Author>}
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
      {url && (
        <img
          className="row-span-full col-span-full object-cover aspect-square"
          src={url}
          width={width}
          height={height}
          alt=""
        />
      )}
      {icon && (
        <Icon
          className="row-span-full col-span-full xl:w-8 xl:h-8"
          name={icon}
          size={24}
          fill={url ? "white" : undefined}
        />
      )}
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
