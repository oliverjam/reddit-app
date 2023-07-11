import {
  createBrowserRouter,
  Link,
  useLoaderData,
  useParams,
} from "react-router-dom";
import * as api from "./reddit/api.ts";

export const router = createBrowserRouter([
  {
    path: "/p/:id/*?",
    Component: Post,
    loader: (c) => api.post(c.params.id!),
  },
  {
    path: "/r/:subreddit",
    Component: Subreddit,
    loader: (c) => api.posts(c.params.subreddit!),
  },
  {
    path: "/u/:user",
    Component: User,
    loader: (c) => api.user(c.params.user!),
  },
  { path: "/", Component: Home, loader: () => api.posts("all") },
  { path: "/*", Component: Missing },
]);

type PostData = Awaited<ReturnType<typeof api.post>>;
type PostsData = Awaited<ReturnType<typeof api.posts>>;
type UserData = Awaited<ReturnType<typeof api.user>>;

function Post() {
  const { post, comments } = useLoaderData() as PostData;
  return (
    <main>
      <h1>{post.title}</h1>
      {post.is_self && (
        <div dangerouslySetInnerHTML={{ __html: post.selftext_html }} />
      )}
      <p>{comments.length} comments</p>
    </main>
  );
}

function Subreddit() {
  const params = useParams<"subreddit">();
  const posts = useLoaderData() as PostsData;
  return (
    <>
      <h1>/r/{params.subreddit}</h1>
      <ul>
        {posts.map((post) => {
          return (
            <li key={post.data.id}>
              <Link to={`/p/${post.data.id}/`}>{post.data.title}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function User() {
  const params = useParams<"user">();
  const posts = useLoaderData() as UserData;
  return (
    <>
      <h1>/u/{params.user}</h1>
      <ul>
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
              return (
                <li key={post.data.id}>
                  <Link to={post.data.permalink}>{post.data.title}</Link>
                </li>
              );
          }
        })}
      </ul>
    </>
  );
}

function Home() {
  const posts = useLoaderData() as Awaited<ReturnType<typeof api.posts>>;
  return (
    <>
      <h1>/r/all</h1>
      <ul>
        {posts.map((post) => {
          return (
            <li key={post.data.id}>
              <Link to={`/p/${post.data.id}/`}>{post.data.title}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Missing() {
  return <h1>Not found</h1>;
}
