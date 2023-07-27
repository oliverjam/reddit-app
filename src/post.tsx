import { Link as LinkType } from "./reddit/types.ts";
import * as Meta from "./meta.tsx";
import { Media } from "./media.tsx";
import { Link } from "react-router-dom";
import { Icon } from "./icon.tsx";

export function Post(props: LinkType["data"]) {
  const {
    score,
    subreddit,
    num_comments,
    author,
    title,
    is_self,
    selftext_html,
  } = props;
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
      {is_self && (
        <div
          className="Markdown text-lg"
          dangerouslySetInnerHTML={{ __html: selftext_html }}
        />
      )}
      <Media {...props} />
    </article>
  );
}
