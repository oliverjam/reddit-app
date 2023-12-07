import { defer, LoaderFunctionArgs } from "react-router-dom";
import { Link, LinkListing, Listing, parse, Post } from "./types.ts";

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

export async function posts(context: LoaderFunctionArgs) {
  const { subreddit, sort = "" } = context.params;
  const t = new URL(context.request.url).searchParams.get("t");
  const url = subreddit === "all" ? "/" : "/r/" + subreddit + "/.json";
  const res = await get(url + sort, { limit: 15, t });
  const listing = parse(LinkListing, res, { abortEarly: true });
  for (const post of listing.data.children) {
    posts_cache.set(post.data.id, post);
  }
  return listing.data.children;
}

export async function user(context: LoaderFunctionArgs) {
  const username = context.params.user;
  const res = await get("/user/" + username, { limit: 20 });
  const listing = parse(Listing, res);
  return listing.data.children;
}

export async function post(context: LoaderFunctionArgs) {
  const id = context.params.id!;
  const sort = new URL(context.request.url).searchParams.get("sort");
  const url = `/comments/${id}/.json`;
  const res = get(url, { limit: 150, sort });
  const cached = posts_cache.get(id);
  const fresh = res.then((json: unknown) => {
    const [listing] = parse(Post, json, { abortEarly: true });
    const post = listing.data.children[0];
    posts_cache.set(post.data.id, post);
    return post.data;
  });
  const comments = res.then((json) => {
    const [, comments] = parse(Post, json, { abortEarly: true });
    return comments.data.children;
  });
  return defer({
    post: cached ? cached.data : await fresh,
    comments,
  });
}

export async function search(context: LoaderFunctionArgs) {
  const query = new URL(context.request.url).searchParams.get("query") || "";
  const url = `/api/search_reddit_names.json`;
  const res = await get(url, { query, include_over_18: "true" });
  return res.names;
}
