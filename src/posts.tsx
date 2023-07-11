import { useLoaderData } from "react-router-dom";
import { Listing } from "./reddit/types.ts";

type Props = { title: string };

export function Posts({ title }: Props) {
  const posts = useLoaderData() as Listing;
  return (
    <>
      <h1>{title}</h1>
      <ul>
        {posts.data.children.map((post) => {
          if (post.kind !== "t3") return null;
          return <li key={post.data.id}>{post.data.title}</li>;
        })}
      </ul>
    </>
  );
}
