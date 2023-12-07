import { Link } from "react-router-dom";
import { Icon } from "./icon.tsx";

type Kids<T> = { children: T };

const num = new Intl.NumberFormat("en-GB");
const time = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

export function Score({ children }: Kids<number>) {
	return (
		<span className="flex items-center gap-1">
			<Icon name="score" size={16} /> {num.format(children)}
		</span>
	);
}

export function Comments({
	href,
	children,
}: {
	href: string;
	children: number;
}) {
	return (
		<Link to={href + "#comments"} className="flex items-center gap-1">
			<Icon name="comment" size={16} />
			{num.format(children)}
		</Link>
	);
}

export function Subreddit({ children }: Kids<string>) {
	return (
		<Link to={"/r/" + children} className="flex items-center gap-1">
			<Icon name="newspaper" size={16} />
			{children}
		</Link>
	);
}

export function Created({
	href,
	children,
}: {
	href: string;
	children: number;
}) {
	const created = new Date(children * 1000);
	return (
		<Link to={href} className="flex items-center gap-1">
			<Icon name="clock" size={16} />
			<time>{time.format(created)}</time>
		</Link>
	);
}

export function Author({ children }: Kids<string>) {
	return (
		<Link to={"/u/" + children} className="flex items-center gap-1">
			<Icon name="user" size={16} />
			{children}
		</Link>
	);
}
