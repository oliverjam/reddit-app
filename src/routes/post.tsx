import { useLoaderData, Await, useRouteError, Link } from "react-router-dom";
import { Suspense } from "react";
import { Post } from "../post.tsx";
import { Comments } from "../comments.tsx";
import { Comment, Link as LinkType } from "../reddit/types.ts";
import { SortComments } from "../sort.tsx";
import { DisplayError } from "../error.tsx";
import type { Handle } from "./root.tsx";
import { Icon } from "../icon.tsx";

type PostData = { post: LinkType["data"]; comments: Promise<Comment[]> };

export const handle: Handle<PostData> = {
	title: ({ data }) => `${data?.post?.title} - r/${data?.post?.subreddit}`,
};

export function Component() {
	const data = useLoaderData() as PostData;
	return (
		<div>
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
								<ul className="flex gap-4 mb-6">
									<SortComments sort="best">Best</SortComments>
									<SortComments sort="top">Top</SortComments>
									<SortComments sort="new">New</SortComments>
									<SortComments sort="old">Old</SortComments>
									<SortComments sort="controversial">
										Controversial
									</SortComments>
									<li>
										<Link
											to=""
											relative="path"
											replace
											className="flex gap-1 items-center"
											aria-label="Refresh comments"
										>
											<Icon name="reload" />
										</Link>
									</li>
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
	const e = useRouteError();
	console.error(e.issues);
	return (
		<div className="Cover">
			<DisplayError>Failed to load post</DisplayError>
		</div>
	);
}
