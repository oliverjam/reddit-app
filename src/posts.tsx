// import { useLoaderData } from "react-router-dom";

type Props = { title: string };

export function Posts({ title }: Props) {
  // const posts = useLoaderData();
  return (
    <>
      <h1>{title}</h1>
      {/* <ul>
        {posts.data.children.map((post) => (
          <li key={post.data.id}>{post.data.title}</li>
        ))}
      </ul> */}
    </>
  );
}
