export type Listing<K = Kind> = {
  kind: "Listing";
  data: {
    children: Array<K>;
  };
};

type Kinds = {
  t1: Comment;
  // t2: Account,
  t3: Link;
  more: More;
};

export type Kind = Kinds[keyof (Kinds)];

export type Comment = {
  kind: "t1";
  data: SharedData & {
    replies: Listing;
    link_title: string;
    link_permalink: string;
    body: string;
    "body_html": string;
    is_submitter: boolean;
    distinguished: "moderator";
  };
};

export type Link = {
  kind: "t3";
  data: SharedData & {
    "is_self": boolean;
    selftext: string;
    "selftext_html": string;
    "num_comments": number;
    thumbnail: string;
    "thumbnail_width": string;
    "thumbnail_height": string;
    "crosspost_parent_list"?: Array<Link["data"]>;
    post_hint?: "link" | "image" | "hosted:video" | "rich:video" | "self";
    domain: string;
    is_video: boolean;
    preview?: {
      images: Array<{
        source: PreviewSource;
        resolutions: Array<{
          url: string;
          width: number;
          height: number;
        }>;
        variants?: {
          gif: { source: PreviewSource };
          mp4: { source: PreviewSource };
        };
      }>;
      "reddit_video_preview"?: {
        "fallback_url": string;
        width: number;
        height: number;
      };
    };
    media?: {
      oembed?: Oembed;
      "reddit_video"?: {
        "fallback_url": string;
        width: number;
        height: number;
      };
    };
    "gallery_data": { items: [{ media_id: Gallery_ID }] };
    "media_metadata": {
      [k: Gallery_ID]: {
        "s": { "y": number; "x": number; "u": string };
      };
    };
  };
};

export type PostKind =
  | "link"
  | "video"
  | "image"
  | "gif"
  | "gallery"
  | "embed"
  | "self"
  | "crosspost";

export function parse_kind(data: Link["data"]): PostKind {
  if (data.crosspost_parent_list) return "crosspost";
  if (data.gallery_data) return "gallery";
  if (data.is_video) return "video";
  if (data.preview?.reddit_video_preview) return "video";
  if (data.preview?.images[0]?.variants?.mp4) return "gif";
  if (data.media?.oembed) return "embed";
  switch (data.post_hint) {
    case "hosted:video":
    case "rich:video":
      return "video";
    case "link":
      return "link";
    case "image":
      return "image";
    case "self":
      return "self";
  }
  if (data.domain === "reddit.com") return "link";
  return "self";
}

type PreviewSource = {
  url: string;
  width: number;
  height: number;
};

type Gallery_ID = string;

type More = {
  "kind": "more";
  "data": {
    "count": 1;
    "name": "t1_joocuzs";
    "id": "joocuzs";
    "parent_id": "t1_jonruuy";
    "depth": 2;
    "children": ["joocuzs"];
  };
};

export type Oembed = {
  "provider_name": string;
  "thumbnail_url"?: string;
  width: number;
  height: number;
  html: string;
};

type SharedData = {
  id: string;
  title: string;
  permalink: string;
  subreddit: string;
  url: string;
  author: string;
  "created_utc": number;
  score: number;
  ups: number;
  downs: number;
  stickied: boolean;
};
