import type { Comment, Link, Listing } from "./types.ts";

export function get(pathname: string, limit: number) {
  const url = new URL("https://api.reddit.com/");
  url.searchParams.set("raw_json", "1");
  url.searchParams.set("limit", limit.toString());
  url.pathname = pathname;
  console.log(`${new Date().toLocaleTimeString()} Fetching ${url}`);
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    } else {
      return res.json();
    }
  });
}

export async function posts(subreddit: string): Promise<Link[]> {
  const url = subreddit === "all" ? "/" : "/r/" + subreddit;
  const res = await get(url, 15) as Listing<Link>;
  return res.data.children;
}

export async function user(
  username: string,
): Promise<Listing["data"]["children"]> {
  const res = await get("/user/" + username, 20) as Listing;
  return res.data.children;
}

type PostResponse = [Listing<Link>, Listing<Comment>];
type PostData = Promise<{ post: Link["data"]; comments: Comment[] }>;

export function post(id: string) {
  const url = `/comments/${id}/`;
  const res = get(url, 150);
  return {
    // post: res.then(([post]: PostResponse) => post.data.children[0].data),
    comments: res.then(([, comments]: PostResponse) => comments.data.children),
  };
}
