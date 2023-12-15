import { Link, useLocation, useParams } from "react-router-dom";
import clsx from "clsx";
import { Time } from "./time.tsx";
import { Comment as CommentType, Kind } from "./reddit/types.ts";
import { useEffect, useRef } from "react";
import * as Meta from "./meta.tsx";

export function Comments({ comments }: { comments: Kind[] }) {
	if (comments.length === 1 && comments[0].kind === "more") {
		return <button>+{comments[0].data.count}</button>;
	}
	return (
		<ul className="[&_&]:border-l [&_&]:mt-2[&_&]:ml-1 [&_&]:pt-2 [&_&]:pl-5 space-y-5">
			{comments.map((child) => {
				if (child.kind !== "t1") return null;
				return (
					<li key={child.data.id}>
						<Comment {...child.data} />
					</li>
				);
			})}
		</ul>
	);
}

function Comment({
	stickied,
	author,
	permalink,
	created_utc,
	body_html,
	replies,
	is_submitter: op,
	distinguished,
	score,
	id,
}: CommentType["data"]) {
	const ref = useRef<HTMLDetailsElement>(null);
	const { hash } = useLocation();
	const comment_id = hash.replace("#", "");
	const current = id === comment_id;
	const mod = distinguished === "moderator";
	const closed = (mod && stickied) || score < -5;

	useEffect(() => {
		if (ref.current?.id === comment_id) ref.current?.scrollIntoView();
	}, [comment_id]);
	return (
		<details
			ref={ref}
			id={id}
			className={clsx("space-y-2 [&[open]>summary]:after:content-none", {
				"bg-yellow-200": current,
			})}
			open={!closed}
		>
			<summary className="list-none text-sm after:content-['+'] after:ml-2 after:p-1">
				<Link
					to={"/u/" + author}
					className={clsx("font-semibold break-words", {
						"Pill PillLink": op || mod,
						"text-[AccentColorText] bg-[AccentColor]": mod,
					})}
				>
					{author}
				</Link>
				<Divider />
				<Score>{score}</Score>
				<Divider />
				<Permalink href={permalink}>{created_utc}</Permalink>
			</summary>
			<Markdown __html={body_html} />
			{replies && <Comments comments={replies.data.children} />}
		</details>
	);
}

export function CommentEntry({
	link_title,
	score,
	permalink,
	created_utc,
	body_html,
	link_id,
	id,
	subreddit,
}: CommentType["data"]) {
	const { subreddit: user } = useParams();
	link_id = link_id?.replace("t3_", "");
	const title_slug = link_title?.replace(/\s/g, "_");
	const url = `/u/${user}/comments/${link_id}/${title_slug}/#${id}`;
	const { hash } = useLocation();
	const current = id === hash.replace("#", "");
	return (
		<li
			className={clsx("text-sm p-3 -mx-3 rounded-lg", {
				"bg-[AccentColor] text-[AccentColorText]": current,
			})}
		>
			<header className="space-y-2">
				<div className="flex gap-3 flex-wrap text-sm z-10 isolate max-w-max font-semibold">
					<Meta.Subreddit>{subreddit!}</Meta.Subreddit>
				</div>
				<h2>
					<Link to={url}>{link_title}</Link>
				</h2>

				<div className="ml-1 pl-4 border-l border-[ButtonFace]">
					<Score>{score}</Score>
					<Divider />
					<Permalink href={permalink}>{created_utc}</Permalink>
					<Markdown __html={body_html} />
				</div>
			</header>
		</li>
	);
}

const num = new Intl.NumberFormat("en-GB");

function Score({ children }: { children: number }) {
	const label = children === 1 ? "point" : "points";
	return (
		<span>
			{num.format(children)} {label}
		</span>
	);
}

function Divider() {
	return (
		<span aria-hidden="true" className="mx-1">
			•
		</span>
	);
}

function Permalink({ href, children }: { href: string; children: number }) {
	return (
		<Link to={href}>
			<Time>{children}</Time>
		</Link>
	);
}

function Markdown({ __html }: { __html: string }) {
	return (
		<div className="Markdown max-w-xl" dangerouslySetInnerHTML={{ __html }} />
	);
}
