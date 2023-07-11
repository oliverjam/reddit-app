import { Link, useLoaderData } from "react-router-dom";
import * as api from "./reddit/api.ts";

type Props = { title: string };

export function Posts({ title }: Props) {
  const posts = useLoaderData() as Awaited<ReturnType<typeof api.posts>>;
  return (
    <>
      <h1>{title}</h1>
      <ul>
        {posts.map((post) => {
          return (
            <li key={post.data.id}>
              <Link to={post.data.permalink}>{post.data.title}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
