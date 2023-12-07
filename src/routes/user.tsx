import { useLoaderData, useParams } from "react-router-dom";
import { CommentEntry } from "../comments.tsx";
import { Entry } from "../entry.tsx";
import { Kind } from "../reddit/types.ts";
import { Handle } from "./root.tsx";

export const handle: Handle = {
	title: ({ params }) => `u/${params.user}`,
};

export function Component() {
	const params = useParams<"user">();
	const posts = useLoaderData() as Kind[];
	return (
		<div className="Gutter">
			<h1>u/{params.user}</h1>
			<ul className="mt-6 text-sm sm:text-base space-y-5">
				{posts.map((post) => {
					switch (post.kind) {
						case "t1":
							return <CommentEntry {...post.data} key={post.data.id} />;
						case "t3":
							return <Entry {...post.data} key={post.data.id} />;
					}
				})}
			</ul>
		</div>
	);
}

Component.displayName = "UserPage";
