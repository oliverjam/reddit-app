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

const posts_cache = new Map<string, Link>();

export async function posts(subreddit: string): Promise<Link[]> {
  const url = subreddit === "all" ? "/" : "/r/" + subreddit;
  const res = await get(url, 15) as Listing<Link>;
  for (const post of res.data.children) {
    posts_cache.set(post.data.id, post);
  }
  return res.data.children;
}

export async function user(
  username: string,
): Promise<Listing["data"]["children"]> {
  const res = await get("/user/" + username, 20) as Listing;
  return res.data.children;
}

type PostResponse = [Listing<Link>, Listing<Comment>];

export function post(id: string) {
  const url = `/comments/${id}/`;
  const res = get(url, 150) as Promise<PostResponse>;
  const cached = posts_cache.get(id);
  const fresh = res.then(([listing]) => {
    const post = listing.data.children[0];
    posts_cache.set(post.data.id, post);
    return post.data;
  });
  const comments = res.then(([, comments]) => comments.data.children);
  return { cached, fresh, comments };
}
