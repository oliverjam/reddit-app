import { Link, parse_kind } from "./reddit/types.ts";
import { useRef } from "react";

export function Media(data: Link["data"]) {
	const source = parse_media(data);
	switch (source.kind) {
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
		case "video":
			return (
				<VideoAudio
					className="max-h-[75vh] w-auto"
					src={source.url}
					width={source.width}
					height={source.height}
					controls
					playsInline
				/>
			);
		case "gif":
			return (
				<video
					className="max-h-[75vh] w-auto"
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
					dangerouslySetInnerHTML={{ __html: source.html }}
					className="relative max-w-full min-h-[50vh]"
					style={{ width: source.width, height: source.height }}
				/>
			);
		case "nothing":
			return null;
		case "mystery":
		default:
			return <div>Couldn't parse media</div>;
	}
}

export function VideoAudio({
	src,
	loop,
	...rest
}: JSX.IntrinsicElements["video"]) {
	if (!src) {
		console.error("Missing video src");
		return null;
	}
	const audio = useRef<HTMLAudioElement>(null);
	const AUDIO_REGEX = /DASH_\d+.mp4/;
	const audio_src = src.replace(AUDIO_REGEX, "DASH_AUDIO_128.mp4");
	return (
		<>
			<video
				{...rest}
				src={src}
				loop={loop}
				onPlaying={() => audio.current?.play()}
				onPause={() => audio.current?.pause()}
				onSeeked={(e) => {
					if (audio.current) {
						audio.current.currentTime = e.currentTarget.currentTime;
					}
				}}
				onRateChange={(e) => {
					if (audio.current) {
						audio.current.playbackRate = e.currentTarget.playbackRate;
					}
				}}
			></video>
			<audio src={audio_src} playsInline loop={loop} ref={audio}></audio>
		</>
	);
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

export function parse_media(data: Link["data"]): MediaKind {
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
		case "crosspost":
			return { kind: "nothing" };
		default:
			return { kind: "mystery" };
	}
}
