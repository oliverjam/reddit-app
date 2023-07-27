import { Link, Outlet, useLoaderData, useParams } from "react-router-dom";
import { useRef } from "react";
import { useScrollRestoration } from "../scroll.ts";
import { Icon } from "../icon.tsx";
import { SortEntries } from "../sort.tsx";
import { Search } from "../search.tsx";
import { Entry } from "../entry.tsx";
import { DisplayError } from "../error.tsx";
import type { Link as LinkType } from "../reddit/types.ts";
import type { Handle } from "./root.tsx";
import clsx from "clsx";

export const handle: Handle = {
  title: ({ params }) => `r/${params.subreddit}`,
};

const current_panel = (current: boolean) =>
  clsx("overflow-y-auto [scrollbar-gutter:stable]", {
    "hidden md:block": current,
  });

export function Component() {
  const params = useParams<"subreddit" | "id">();
  const post_scroller = useRef<HTMLDivElement>(null);
  useScrollRestoration(post_scroller);

  const posts = useLoaderData() as LinkType[];
  const showing_post = !!params.id;
  return (
    <main className="md:grid md:grid-cols-2 h-screen">
      <header className={current_panel(!!showing_post)}>
        <div className="Gutter">
          <div className="flex gap-4 items-center justify-between">
            <Search defaultValue={params.subreddit!} />
            <Link
              to=""
              relative="path"
              replace
              aria-label="Refresh posts"
              title="Refresh posts"
            >
              <Icon name="reload" />
            </Link>
          </div>
          <ul className="flex gap-2 mt-4 overflow-auto">
            <SortEntries sort="hot">Hot</SortEntries>
            <SortEntries sort="new">New</SortEntries>
            <SortEntries sort="top" t="all">
              Top ever
            </SortEntries>
            <SortEntries sort="top" t="year">
              Top year
            </SortEntries>
            <SortEntries sort="top" t="month">
              Top month
            </SortEntries>
            <SortEntries sort="top" t="week">
              Top week
            </SortEntries>
            <SortEntries sort="top" t="day">
              Top today
            </SortEntries>
          </ul>
          <ul className="mt-6 text-sm sm:text-base">
            {posts.map((post) => {
              return (
                <Entry
                  {...post.data}
                  show_sub={
                    params.subreddit === "all" ||
                    params.subreddit?.includes("+")
                  }
                  key={post.data.id}
                />
              );
            })}
          </ul>
        </div>
      </header>
      <div className={current_panel(!showing_post)} ref={post_scroller}>
        <Outlet />
      </div>
    </main>
  );
}

Component.displayName = "SubredditPage";

export function ErrorBoundary() {
  return (
    <div className="Cover">
      <DisplayError>Failed to load posts</DisplayError>
      <Outlet />
    </div>
  );
}
