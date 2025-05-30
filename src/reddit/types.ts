import {
	array,
	boolean,
	literal,
	nullable,
	nullish,
	record,
	number,
	object,
	optional,
	picklist,
	lazy,
	string,
	tuple,
	union,
} from "valibot";
import { type GenericSchema, type InferOutput } from "valibot";
export { parse } from "valibot";

export type Link = InferOutput<typeof Link>;
export type Comment = InferOutput<typeof Comment>;
export type Kind = InferOutput<typeof Kind>;

/**
 * Base API definition
 * This describes shared data across all kinds
 */

const Base = object({
	id: string(),
	permalink: string(),
	subreddit: string(),
	author: string(),
	created_utc: number(),
	score: number(),
	ups: number(),
	downs: number(),
	stickied: boolean(),
});

/**
 * More API definition
 * This is used when there are more posts/comments to load
 */

const More = object({
	kind: literal("more"),
	data: object({
		count: number(),
		name: string(),
		id: string(),
		parent_id: string(),
		depth: number(),
		children: array(string()),
	}),
});

/**
 * Comment API definition
 * This describes a comment on Reddit
 */

const BaseCommentData = object({
	...Base.entries,
	...object({
		link_title: optional(string()),
		link_permalink: optional(string()),
		link_id: optional(string()),
		body: string(),
		body_html: string(),
		is_submitter: boolean(),
		distinguished: nullable(literal("moderator")),
	}).entries,
});

// TypeScript cannot infer recursive type, so we define it manually
type CommentData = InferOutput<typeof BaseCommentData> & {
	replies: "" | InferOutput<typeof CommentListing>;
};

const CommentData: GenericSchema<CommentData> = object({
	...BaseCommentData.entries,
	...object({
		replies: union([literal(""), lazy(() => CommentListing)]),
	}).entries,
});

const Comment = object({
	kind: literal("t1"),
	data: CommentData,
});

const CommentListing = object({
	kind: literal("Listing"),
	data: object({
		children: array(union([Comment, More])),
	}),
});

/**
 * Link API definition
 * This describes a post on Reddit
 */

const Source = object({
	url: string(),
	width: number(),
	height: number(),
});

const LinkData = object({
	...Base.entries,
	...object({
		title: string(),
		url: string(),
		is_self: boolean(),
		selftext: string(),
		selftext_html: nullable(string()),
		num_comments: number(),
		thumbnail: string(),
		thumbnail_width: nullish(number()),
		thumbnail_height: nullish(number()),
		post_hint: optional(
			picklist([
				"link",
				"image",
				"hosted:video",
				"rich:video",
				"self",
				"gallery",
			])
		),
		domain: string(),
		is_video: boolean(),
		preview: optional(
			object({
				images: array(
					object({
						source: Source,
						resolutions: array(
							object({
								url: string(),
								width: number(),
								height: number(),
							})
						),
						variants: object({
							gif: optional(object({ source: Source })),
							mp4: optional(object({ source: Source })),
						}),
					})
				),
				reddit_video_preview: optional(
					object({
						fallback_url: string(),
						width: number(),
						height: number(),
					})
				),
			})
		),
		media: nullable(
			optional(
				object({
					oembed: optional(
						object({
							provider_name: string(),
							thumbnail_url: optional(string()),
							width: number(),
							height: nullable(number()),
							html: string(),
						})
					),
					reddit_video: optional(
						object({
							fallback_url: string(),
							width: number(),
							height: number(),
						})
					),
				})
			)
		),
		gallery_data: nullish(
			object({
				items: array(
					object({
						media_id: string(),
					})
				),
			})
		),
		media_metadata: nullish(
			record(
				string(),
				object({
					s: object({
						x: number(),
						y: number(),
						u: optional(string()),
						gif: optional(string()),
						mp4: optional(string()),
					}),
				})
			)
		),
	}).entries,
});

const Link = object({
	kind: literal("t3"),
	data: object({
		...LinkData.entries,
		...object({
			crosspost_parent_list: optional(array(LinkData)), // avoids recursive type
		}).entries,
	}),
});

export const LinkListing = object({
	kind: literal("Listing"),
	data: object({
		children: array(Link),
	}),
});

/**
 * Listing API definition
 * This represents a generic response that could include anything
 */
const Kind = union([Comment, Link, More]);

export const Listing = object({
	kind: literal("Listing"),
	data: object({
		children: array(Kind),
	}),
});

/**
 * A top-level post is represented by an array of:
 * 0: the link
 * 1: its comments
 */
export const Post = tuple([LinkListing, CommentListing]);

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
	if (data.is_self) return "self";
	if (data.gallery_data) return "gallery";
	if (data.is_video) return "video";
	if (data.preview?.images[0]?.variants?.mp4) return "gif";
	if (data.media?.oembed) return "embed";
	if (data.preview?.reddit_video_preview) return "video";
	if (data.crosspost_parent_list) return "crosspost";
	switch (data.post_hint) {
		case "hosted:video":
		case "rich:video":
			return "video";
		case "link":
			return "link";
		case "gallery":
			return "image";
		case "image":
			return "image";
		case "self":
			return "self";
	}
	if (data.domain !== window.location.hostname) return "link";
	return "self";
}
