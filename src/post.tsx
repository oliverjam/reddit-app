import { Link as LinkType, parse_kind } from "./reddit/types.ts";
import * as Meta from "./meta.tsx";
import { Media } from "./media.tsx";
import { Link } from "react-router-dom";
import { Icon } from "./icon.tsx";
import { Entry } from "./entry.tsx";

export function Post(props: LinkType["data"]) {
	const {
		score,
		subreddit,
		num_comments,
		author,
		title,
		selftext_html,
		crosspost_parent_list,
		created_utc,
	} = props;
	const kind = parse_kind(props);
	return (
		<article className="Gutter max-w-3xl space-y-4">
			<header className="space-y-2">
				<div className="flex gap-3 items-center">
					<Link to=".." className="Pill PillLink md:hidden">
						<Icon name="left" size={16} />
						{subreddit}
					</Link>
				</div>
				<h1 className="text-lg lg:text-xl xl:text-2xl">{title}</h1>
				<div className="flex gap-4 items-center font-semibold">
					<Meta.Score>{score}</Meta.Score>
					<Meta.Comments href="">{num_comments}</Meta.Comments>
					<Meta.Author>{author}</Meta.Author>
					<Meta.Created href={props.permalink}>{created_utc}</Meta.Created>
				</div>
			</header>
			{kind === "crosspost" && (
				<Entry
					{...crosspost_parent_list![0]}
					show_sub={true}
					crosspost={true}
				/>
			)}
			{selftext_html && (
				<div
					className="Markdown text-lg"
					dangerouslySetInnerHTML={{ __html: selftext_html }}
				/>
			)}
			<Media {...props} />
		</article>
	);
}
