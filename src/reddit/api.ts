import type { Listing } from "./types.ts";

export function get(pathname: string, limit: number) {
  const url = new URL("https://api.reddit.com/");
  url.searchParams.set("raw_json", "1");
  url.searchParams.set("limit", limit.toString());
  url.pathname = pathname;
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    } else {
      return res.json();
    }
  });
}

export function posts(subreddit: string): Promise<Listing> {
  return get("/r/" + subreddit, 15);
}
