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
  ScrollRestoration,
} from "react-router-dom";
import { Suspense, useEffect } from "react";
import * as api from "./reddit/api.ts";
import { Entry } from "./entry.tsx";
import { Post } from "./post.tsx";
import { Icon } from "./icon.tsx";
import { CommentEntry, Comments } from "./comments.tsx";
import postStyles from "./entry.module.css";
import columnsStyles from "./columns.module.css";
import { Comment, Link as LinkType } from "./reddit/types.ts";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route Component={Root}>
      <Route
        path="/r/:subreddit"
        loader={(c) => api.posts(c.params.subreddit!)}
        Component={Subreddit}
      >
        <Route
          path="comments/:id/:slug?/*?"
          loader={async (c) => {
            const { cached, fresh, comments } = api.post(c.params.id!);
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
    </Route>
  )
);

function Root() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

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
  const posts = useLoaderData() as PostsData;
  const showing_post = !!params.id;
  const post = showing_post
    ? posts.find((post) => post.data.id === params.id)
    : undefined;
  return (
    <main className={columnsStyles.Columns}>
      <header className={showing_post ? columnsStyles.Desktop : undefined}>
        <div className="Gutter">
          <h1>{title}</h1>
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
      <div className={!showing_post ? columnsStyles.Desktop : undefined}>
        <Outlet context={post} />
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
