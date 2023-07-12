import { Icon } from "./icon.tsx";

type Kids<T> = { children: T };

const num = new Intl.NumberFormat("en-GB");

export function Score({ children }: Kids<number>) {
  return (
    <span className="Pill">
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
    <a href={href + "#comments"} className="Pill PillLink">
      <Icon name="comment" size={16} /> {num.format(children)}
    </a>
  );
}

export function Subreddit({ children }: Kids<string>) {
  return (
    <a href={"/r/" + children} className="Pill PillLink">
      <Icon name="newspaper" size={16} /> r/{children}
    </a>
  );
}

export function Author({ children }: Kids<string>) {
  return (
    <a href={"/u/" + children} className="Pill PillLink">
      <Icon name="user" size={16} /> u/{children}
    </a>
  );
}
