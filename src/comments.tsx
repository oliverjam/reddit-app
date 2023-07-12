import { Time } from "./time.tsx";
import { Comment as CommentType, Kind } from "./reddit/types.ts";
import styles from "./comments.module.css";

export function Comments({ comments }: { comments: Kind[] }) {
  if (comments.length === 1 && comments[0].kind === "more") {
    return <button>+{comments[0].data.count}</button>;
  }
  return (
    <ul className={styles.List}>
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

export function Comment({
  stickied,
  author,
  permalink,
  created_utc,
  body_html,
  replies,
  is_submitter,
  distinguished,
  score,
}: CommentType["data"]) {
  const mod = distinguished === "moderator";
  const is_closed = (mod && stickied) || score < -5;
  return (
    <details className={styles.Comment} open={!is_closed}>
      <summary>
        <a
          className={
            styles.Author + (is_submitter || mod ? " Pill PillLink" : "")
          }
          href={"/u/" + author}
          style={{
            backgroundColor: mod ? "AccentColor" : "",
            color: mod ? "AccentColorText" : "",
          }}
        >
          {author}
        </a>
        <Divider />
        <Score>{score}</Score>
        <Divider />
        <Link href={permalink}>{created_utc}</Link>
      </summary>
      <Markdown __html={body_html} />
      {replies && <Comments comments={replies.data.children} />}
    </details>
  );
}

const num = new Intl.NumberFormat("en-GB");

export function Score({ children }: { children: number }) {
  const label = children === 1 ? "point" : "points";
  return (
    <span>
      {num.format(children)} {label}
    </span>
  );
}

export function Divider() {
  return (
    <span aria-hidden="true" className={styles.Divider}>
      •
    </span>
  );
}

export function Link({ href, children }: { href: string; children: number }) {
  return (
    <a href={href}>
      <Time>{children}</Time>
    </a>
  );
}

export function Markdown({ __html }: { __html: string }) {
  return (
    <div className={styles.Markdown} dangerouslySetInnerHTML={{ __html }} />
  );
}
