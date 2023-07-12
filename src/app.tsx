import {
  Link,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  useLoaderData,
  useOutletContext,
  useParams,
  defer,
  Await,
} from "react-router-dom";
import { Suspense } from "react";
import * as api from "./reddit/api.ts";
import { Entry } from "./entry.tsx";
import { Post } from "./post.tsx";
import { Icon } from "./icon.tsx";
import { Comments } from "./comments.tsx";
import postStyles from "./entry.module.css";
import columnsStyles from "./columns.module.css";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/r/:subreddit"
        loader={(c) => api.posts(c.params.subreddit!)}
        Component={Subreddit}
      >
        <Route
          path=":id/*?"
          loader={(c) => defer(api.post(c.params.id!))}
          Component={PostPage}
        />
      </Route>
      <Route
        path="/u/:user"
        loader={(c) => api.user(c.params.user!)}
        Component={User}
      />
      <Route path="/*" Component={Missing} />
    </>
  )
);

type PostsData = Awaited<ReturnType<typeof api.posts>>;
type PostData = Awaited<ReturnType<typeof api.post>>;
type UserData = Awaited<ReturnType<typeof api.user>>;

function Subreddit() {
  const params = useParams<"subreddit" | "id">();
  const posts = useLoaderData() as PostsData;
  const showing_post = !!params.id;
  const post = showing_post
    ? posts.find((post) => post.data.id === params.id)
    : undefined;
  return (
    <main className={columnsStyles.Columns}>
      <header className={showing_post ? columnsStyles.Desktop : undefined}>
        <div className="Gutter">
          <h1>/r/{params.subreddit}</h1>
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

function PostPage() {
  const post = useOutletContext() as PostsData[0];
  const data = useLoaderData() as PostData;
  return (
    <div>
      <Link to=".." aria-label="Back">
        <Icon name="left" />
      </Link>
      <Post {...post.data} />
      <hr />
      <div className="Gutter">
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
  return (
    <>
      <h1>/u/{params.user}</h1>
      <ul className={postStyles.List}>
        {posts.map((post) => {
          switch (post.kind) {
            case "t1":
              return (
                <li key={post.data.id}>
                  <p
                    dangerouslySetInnerHTML={{ __html: post.data.body_html }}
                  />
                </li>
              );
            case "t3":
              return <Post {...post.data} key={post.data.id} />;
          }
        })}
      </ul>
    </>
  );
}

function Missing() {
  return <h1>Not found</h1>;
}
