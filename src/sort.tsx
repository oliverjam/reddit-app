import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";

type EntriesProps = {
  sort: "hot" | "new" | "top";
  t?: "all" | "year" | "month" | "week" | "day";
  children: string;
};

export function SortEntries({ sort, t, children }: EntriesProps) {
  const params = useParams<"subreddit" | "sort">();
  const { pathname } = useLocation();
  const [search] = useSearchParams();

  let current = false;
  if (!params.sort) current = sort === "hot";
  if (params.sort === sort) current = search.get("t") === t;
  if (params.sort === "new") current = sort === "new";

  const permalink = pathname
    .split("/")
    .slice(params.sort ? 4 : 3)
    .join("/");

  const to_search = new URLSearchParams(search);
  to_search.delete("t");
  if (t) to_search.set("t", t);

  let to = `/r/${params.subreddit}/`;
  if (sort !== "hot") to += `${sort}/`;
  to += permalink + "?" + to_search;

  return (
    <li>
      <Link
        className="Pill PillLink"
        to={to}
        aria-current={current ? "page" : undefined}
      >
        {children}
      </Link>
    </li>
  );
}

type CommentsProps = {
  sort: "best" | "top" | "new" | "old" | "controversial";
  children: string;
};

export function SortComments({ sort, children }: CommentsProps) {
  const { pathname } = useLocation();
  const [search] = useSearchParams();

  const current = search.has("sort")
    ? search.get("sort") === sort
    : sort === "best";

  const to_search = new URLSearchParams(search);
  to_search.delete("sort");
  if (sort !== "best") to_search.set("sort", sort);

  const to = pathname + "?" + to_search;
  return (
    <li>
      <Link
        className="Pill PillLink"
        to={to}
        aria-current={current ? "page" : undefined}
      >
        {children}
      </Link>
    </li>
  );
}
