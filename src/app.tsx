import {
  Link,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  useLoaderData,
  useParams,
  defer,
  Await,
} from "react-router-dom";
import { Suspense, useEffect, useRef } from "react";
import * as api from "./reddit/api.ts";
import { Entry } from "./entry.tsx";
import { Post } from "./post.tsx";
import { Icon } from "./icon.tsx";
import { CommentEntry, Comments } from "./comments.tsx";
import postStyles from "./entry.module.css";
import columnsStyles from "./columns.module.css";
import { Comment, Link as LinkType } from "./reddit/types.ts";
import { useScrollRestoration } from "./scroll.ts";
import { SortEntries, SortComments } from "./sort.tsx";
import { Search } from "./search.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/r/:subreddit/:sort?"
        loader={(c) => {
          const t = new URL(c.request.url).searchParams.get("t");
          return api.posts(c.params.subreddit!, c.params.sort, t);
        }}
        Component={Subreddit}
      >
        <Route
          path="comments/:id/:slug?/*?"
          loader={async (c) => {
            const sort = new URL(c.request.url).searchParams.get("sort");
            const { cached, fresh, comments } = api.post(c.params.id!, sort);
            return defer({
              post: cached ? cached.data : await fresh,
              comments,
            });
          }}
          Component={PostPage}
        />
      </Route>
      <Route
        path="/u/:user"
        loader={(c) => api.user(c.params.user!)}
        Component={User}
      />
      <Route path="/*" Component={Missing} />
      <Route
        path="/search"
        loader={(c) => {
          const query = new URL(c.request.url).searchParams.get("query") || "";
          return api.search(query);
        }}
      />
    </>
  )
);

function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

type PostsData = Awaited<ReturnType<typeof api.posts>>;
type UserData = Awaited<ReturnType<typeof api.user>>;

function Subreddit() {
  const params = useParams<"subreddit" | "id">();
  const title = `r/${params.subreddit}`;
  useTitle(title);

  const post_scroller = useRef<HTMLDivElement>(null);
  useScrollRestoration(post_scroller);

  const posts = useLoaderData() as PostsData;
  const showing_post = !!params.id;
  return (
    <main className={columnsStyles.Columns}>
      <header className={showing_post ? columnsStyles.Desktop : undefined}>
        <div className="Gutter">
          <div
            className="HStack"
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
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
          <ul className="HStack" style={{ marginBlockStart: "var(--s20)" }}>
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
          <ul className={postStyles.List}>
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
      <div
        className={!showing_post ? columnsStyles.Desktop : undefined}
        ref={post_scroller}
      >
        <Outlet />
      </div>
    </main>
  );
}

type PostData = { post: LinkType["data"]; comments: Comment[] };

function PostPage() {
  const data = useLoaderData() as PostData;
  useTitle(`${data.post.title} - r/${data.post.subreddit}`);
  return (
    <div>
      <Link to=".." aria-label="Back">
        <Icon name="left" />
      </Link>
      <Post {...data.post} />
      <hr />
      <div className="Gutter" id="comments">
        <ul className="HStack" style={{ marginBlockEnd: "var(--s40)" }}>
          <SortComments sort="best">Best</SortComments>
          <SortComments sort="top">Top</SortComments>
          <SortComments sort="new">New</SortComments>
          <SortComments sort="old">Old</SortComments>
          <SortComments sort="controversial">Controversial</SortComments>
        </ul>
        <Suspense>
          <Await resolve={data.comments}>
            {(comments: Awaited<PostData["comments"]>) => (
              <Comments comments={comments} />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

function User() {
  const params = useParams<"user">();
  const posts = useLoaderData() as UserData;
  const title = `u/${params.user}`;
  useTitle(title);
  return (
    <div className="Gutter">
      <h1>{title}</h1>
      <ul className={postStyles.List}>
        {posts.map((post) => {
          switch (post.kind) {
            case "t1":
              return <CommentEntry {...post.data} key={post.data.id} />;
            case "t3":
              return <Entry {...post.data} key={post.data.id} />;
          }
        })}
      </ul>
    </div>
  );
}

function Missing() {
  return <h1>Not found</h1>;
}
