import {
	Link,
	LinkProps,
	Outlet,
	useLoaderData,
	useLocation,
	useParams,
	useRouteError,
	useSearchParams,
} from "react-router-dom";
import { useRef } from "react";
import { useScrollRestoration } from "../scroll.ts";
import { Icon } from "../icon.tsx";
import { SortEntries } from "../sort.tsx";
import { Search } from "../search.tsx";
import { Entry } from "../entry.tsx";
import { DisplayError } from "../error.tsx";
import type { Kind } from "../reddit/types.ts";
import type { Handle } from "./root.tsx";
import clsx from "clsx";
import { CommentEntry } from "../comments.tsx";

export const handle: Handle = {
	title: ({ params }) => `r/${params.subreddit}`,
};

const current_panel = (current: boolean) =>
	clsx("overflow-y-auto [scrollbar-gutter:stable]", {
		"hidden md:block": current,
	});

export function Component() {
	const params = useParams<"subreddit" | "id">();
	const post_scroller = useRef<HTMLDivElement>(null);
	useScrollRestoration(post_scroller);

	const posts = useLoaderData() as Array<Kind>;
	const { pathname } = useLocation();
	const user_page = pathname.startsWith("/u");
	const showing_post = !!params.id;
	return (
		<main className="md:grid md:grid-cols-2 h-screen">
			<header className={current_panel(!!showing_post)}>
				<div className="Gutter">
					<div className="flex gap-4 items-center">
						<Search defaultValue={params.subreddit!} />
						<div className="ml-auto flex gap-3 items-center font-semibold">
							<Link
								to=""
								relative="path"
								replace
								className="flex gap-1 items-center"
							>
								<Icon name="reload" /> Refresh
							</Link>
							<LinkWithSearch to="media" className="flex gap-1 items-center">
								<Icon name="video" /> Media
							</LinkWithSearch>
						</div>
					</div>
					<ul className="flex gap-2 mt-4 overflow-auto">
						<SortEntries sort="hot">Hot</SortEntries>
						<SortEntries sort="new">New</SortEntries>
						<SortEntries sort="top" t="all">
							Top ever
						</SortEntries>
						<SortEntries sort="top" t="year">
							Top year
						</SortEntries>
						<SortEntries sort="top" t="month">
							Top month
						</SortEntries>
						<SortEntries sort="top" t="week">
							Top week
						</SortEntries>
						<SortEntries sort="top" t="day">
							Top today
						</SortEntries>
					</ul>
					<ul className="mt-6">
						{posts.map((post) => {
							switch (post.kind) {
								case "t1":
									return <CommentEntry {...post.data} key={post.data.id} />;
								case "t3":
									return (
										<Entry
											{...post.data}
											show_sub={
												params.subreddit === "all" ||
												user_page ||
												params.subreddit?.includes("+")
											}
											key={post.data.id}
										/>
									);
							}
						})}
					</ul>
				</div>
			</header>
			<div className={current_panel(!showing_post)} ref={post_scroller}>
				<Outlet />
			</div>
		</main>
	);
}

Component.displayName = "SubredditPage";

export function ErrorBoundary() {
	const e = useRouteError();
	console.error(e.issues);
	return (
		<div className="Cover">
			<DisplayError>Failed to load posts</DisplayError>
			<Outlet />
		</div>
	);
}

function LinkWithSearch({ to, ...rest }: LinkProps) {
	const [s] = useSearchParams();
	return <Link to={to + "?" + s} {...rest} />;
}
