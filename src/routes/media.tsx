import { Link, useLoaderData } from "react-router-dom";
import type { Link as LinkType } from "../reddit/types.ts";
import type { Handle } from "./root.tsx";
import { VideoAudio, parse_media } from "../media.tsx";
import { useEffect, useMemo, useRef } from "react";

export const handle: Handle = {
	title: ({ params }) => `r/${params.subreddit}`,
};

export function Component() {
	const posts = useLoaderData() as LinkType[];
	const rootRef = useRef<HTMLUListElement>(null);
	usePauseWhenNotInView(rootRef);
	return (
		<ul
			ref={rootRef}
			className="bg-black h-screen grid [grid:100%/auto-flow_100%] snap-x snap-mandatory overflow-x-auto touch-pan-x overscroll-contain"
		>
			{posts.map((post) => {
				let t = post.data.thumbnail;
				if (!t || t === "default" || t === "self") return null;
				return (
					<li
						key={post.data.id}
						className="relative snap-center snap-always grid grid-rows-[auto_1fr]"
					>
						<header className="p-2 bg-gradient-to-b from-black text-white">
							<h2>{post.data.title}</h2>
							<Link to={"/u/" + post.data.author}>{post.data.author}</Link>
						</header>
						<Media {...post.data} />
					</li>
				);
			})}
		</ul>
	);
}

function Media(data: LinkType["data"]) {
	const source = parse_media(data);
	switch (source.kind) {
		case "video":
			return (
				<VideoAudio
					src={source.url}
					className="h-full justify-self-center"
					controls
					playsInline
				/>
			);
		case "gif":
			return (
				<video
					src={source.url}
					controls
					playsInline
					className="h-full justify-self-center"
					preload="metadata"
				></video>
			);
		case "image":
			return (
				<img
					src={source.url}
					className="h-full justify-self-center"
					loading="lazy"
				/>
			);
		case "embed":
			return (
				<div
					dangerouslySetInnerHTML={{ __html: source.html }}
					className="h-full w-full relative justify-self-center"
				/>
			);
		default:
			return <span>{source.kind}</span>;
	}
}

function usePauseWhenNotInView(ref: React.RefObject<HTMLElement>) {
	useEffect(() => {
		const options = { root: ref.current, rootMargin: "0px", threshold: 0.75 };
		const o = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (!e.isIntersecting && e.target instanceof HTMLVideoElement) {
					e.target.pause();
				}
			}, options);
		});
		const vids = ref.current?.querySelectorAll("video");
		vids?.forEach((v) => o.observe(v));
		return () => vids?.forEach((v) => o.unobserve(v));
	}, []);
}
