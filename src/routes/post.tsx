import { Link, useLoaderData, Await, useNavigation } from "react-router-dom";
import { Suspense } from "react";
import { Post } from "../post.tsx";
import { Icon } from "../icon.tsx";
import { Comments } from "../comments.tsx";
import { Comment, Link as LinkType } from "../reddit/types.ts";
import { SortComments } from "../sort.tsx";
import { DisplayError } from "../error.tsx";
import type { Handle } from "./root.tsx";

type PostData = { post: LinkType["data"]; comments: Promise<Comment[]> };

export const handle: Handle<PostData> = {
  title: ({ data }) => `${data.post.title} - r/${data.post.subreddit}`,
};

export function Component() {
  const data = useLoaderData() as PostData;
  return (
    <div>
      <Link to=".." aria-label="Back">
        <Icon name="left" />
      </Link>
      <Post {...data.post} />
      <hr />
      <div className="Gutter" id="comments">
        <Suspense>
          <Await
            resolve={data.comments}
            errorElement={<DisplayError>Failed to load comments</DisplayError>}
          >
            {(comments: Awaited<PostData["comments"]>) => (
              <>
                <ul className="HStack" style={{ marginBlockEnd: "var(--s40)" }}>
                  <SortComments sort="best">Best</SortComments>
                  <SortComments sort="top">Top</SortComments>
                  <SortComments sort="new">New</SortComments>
                  <SortComments sort="old">Old</SortComments>
                  <SortComments sort="controversial">
                    Controversial
                  </SortComments>
                </ul>
                <Comments comments={comments} />
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

Component.displayName = "PostPage";

export function ErrorBoundary() {
  return (
    <div className="Cover">
      <DisplayError>Failed to load post</DisplayError>
    </div>
  );
}
