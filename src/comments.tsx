import { Link } from "react-router-dom";
import clsx from "clsx";
import { Time } from "./time.tsx";
import { Comment as CommentType, Kind } from "./reddit/types.ts";

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
}: CommentType["data"]) {
	const mod = distinguished === "moderator";
	const closed = (mod && stickied) || score < -5;
	return (
		<details
			className="space-y-2 [&[open]>summary]:after:content-none"
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
	link_permalink,
	link_title,
	score,
	permalink,
	created_utc,
	body_html,
}: CommentType["data"]) {
	const { pathname } = new URL(link_permalink!);
	return (
		<li className="text-sm">
			<Link to={pathname}>
				<h2>{link_title}</h2>
			</Link>
			<div className="mt-2 ml-1 pl-4 border-l border-[ButtonFace]">
				<Score>{score}</Score>
				<Divider />
				<Permalink href={permalink}>{created_utc}</Permalink>
				<Markdown __html={body_html} />
			</div>
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
