import {
	Link,
	useLocation,
	useParams,
	useSearchParams,
} from "react-router-dom";
import { Icon, IconName } from "./icon.tsx";
import { parse_kind } from "./reddit/types.ts";
import * as Meta from "./meta.tsx";
import type { Link as LinkType, Kind, PostKind } from "./reddit/types.ts";
import clsx from "clsx";

export function Entry(
	props: LinkType["data"] & { show_sub?: boolean; crosspost?: boolean }
) {
	const [search] = useSearchParams();
	const { subreddit } = useParams();
	const post_kind = parse_kind(props);
	const href =
		post_kind === "link" || props.crosspost
			? props.url
			: subreddit
			? relative_url(props.permalink) + "?" + search.toString()
			: props.permalink;
	const params = useParams<"id">();
	const { hash } = useLocation();
	const current = !hash && props.id === params.id;
	const images = props.preview?.images[0].resolutions;
	// images are in ascending size order. Try to use bigger one
	let image = images?.[1] || images?.[0];
	if (
		!image &&
		props.thumbnail &&
		props.thumbnail !== "self" &&
		props.thumbnail !== "default"
	) {
		image = {
			url: props.thumbnail,
			width: props.thumbnail_width || 0,
			height: props.thumbnail_height || 0,
		};
	}
	return (
		<li
			className={clsx(
				"relative flex gap-3 md:gap-5 items-start md:items-center rounded-lg p-3 -mx-3 scroll-my-3",
				{ "bg-[AccentColor] text-[AccentColorText]": current }
			)}
		>
			{image && (
				<div className="flex-none grid place-items-center rounded-lg bg-[ButtonFace] w-16 lg:w-24 xl:w-32 aspect-square overflow-hidden">
					<Thumbnail icon={kind_icon(post_kind)} {...image} />
				</div>
			)}
			<header className="space-y-2">
				{props.show_sub && (
					<div className="flex gap-3 flex-wrap text-sm isolate relative z-10 max-w-max font-semibold">
						<Meta.Subreddit>{props.subreddit}</Meta.Subreddit>
					</div>
				)}
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
				<div className="flex gap-3 flex-wrap text-sm isolate max-w-max font-semibold">
					<Meta.Score>{props.score}</Meta.Score>
					<Meta.Comments
						href={
							props.crosspost ? props.permalink : relative_url(props.permalink)
						}
					>
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

function kind_icon(kind: PostKind): IconName | false {
	switch (kind) {
		case "gallery":
			return "image";
		case "embed":
		case "video":
		case "gif":
			return "video";
		default:
			return false;
	}
}
