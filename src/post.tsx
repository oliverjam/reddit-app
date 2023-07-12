import { Link } from "./reddit/types.ts";
import * as Meta from "./meta.tsx";
import styles from "./post.module.css";

export function Post({
  score,
  subreddit,
  num_comments,
  author,
  title,
  is_self,
  selftext_html,
}: Link["data"]) {
  return (
    <article className={styles.Post}>
      <header>
        <div className="HStack">
          <Meta.Score>{score}</Meta.Score>
          <Meta.Subreddit>{subreddit}</Meta.Subreddit>
          <Meta.Comments href="">{num_comments}</Meta.Comments>
          <Meta.Author>{author}</Meta.Author>
        </div>
        <h1>{title}</h1>
      </header>
      {is_self && (
        <div
          className={styles.Markdown}
          dangerouslySetInnerHTML={{ __html: selftext_html }}
        />
      )}
    </article>
  );
}
