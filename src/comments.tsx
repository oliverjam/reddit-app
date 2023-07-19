import { Link, NavLink } from "react-router-dom";
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

function Comment({
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
        <Link
          className={
            styles.Author + (is_submitter || mod ? " Pill PillLink" : "")
          }
          to={"/u/" + author}
          style={{
            backgroundColor: mod ? "AccentColor" : "",
            color: mod ? "AccentColorText" : "",
          }}
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
  const { pathname } = new URL(link_permalink);
  return (
    <li className={styles.Entry}>
      <Link to={pathname}>
        <h2>{link_title}</h2>
      </Link>
      <div className={styles.Compact}>
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
    <span aria-hidden="true" className={styles.Divider}>
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
    <div className={styles.Markdown} dangerouslySetInnerHTML={{ __html }} />
  );
}
