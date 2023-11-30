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
	} = props;
	const kind = parse_kind(props);
	return (
		<article className="Gutter max-w-3xl space-y-4">
			<header>
				<div className="flex gap-4 items-center">
					<Link to=".." aria-label="Back">
						<Icon name="left" />
					</Link>
					<Meta.Score>{score}</Meta.Score>
					<Meta.Subreddit>{subreddit}</Meta.Subreddit>
					<Meta.Comments href="">{num_comments}</Meta.Comments>
					<Meta.Author>{author}</Meta.Author>
				</div>
				<h1 className="mt-4 text-lg lg:text-xl xl:text-2xl">{title}</h1>
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
