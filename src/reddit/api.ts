import type { Comment, Link, Listing } from "./types.ts";

export function get(
  pathname: string,
  search: Record<string, string | number | null>,
) {
  const url = new URL("https://api.reddit.com/");
  url.searchParams.set("raw_json", "1");
  for (const [name, value] of Object.entries(search)) {
    if (value != null) {
      url.searchParams.set(name, value.toString());
    }
  }
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

export async function posts(
  subreddit: string,
  sort: string = "",
  t: string | null,
) {
  const url = subreddit === "all" ? "/" : "/r/" + subreddit + "/";
  const res = await get(url + sort, { limit: 15, t }) as Listing<Link>;
  for (const post of res.data.children) {
    posts_cache.set(post.data.id, post);
  }
  return res.data.children;
}

export async function user(username: string) {
  const res = await get("/user/" + username, { limit: 20 }) as Listing;
  return res.data.children;
}

type PostResponse = [Listing<Link>, Listing<Comment>];

export function post(id: string, sort: string | null) {
  const url = `/comments/${id}/`;
  const res = get(url, { limit: 150, sort }) as Promise<PostResponse>;
  const cached = posts_cache.get(id);
  const fresh = res.then(([listing]) => {
    const post = listing.data.children[0];
    posts_cache.set(post.data.id, post);
    return post.data;
  });
  const comments = res.then(([, comments]) => comments.data.children);
  return { cached, fresh, comments };
}
