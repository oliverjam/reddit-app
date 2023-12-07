import { useEffect } from "react";
import { Outlet, Params, useMatches } from "react-router-dom";

export type Handle<Data = unknown> = {
	// Routes should define their title as a simple string or function called with match info
	title?: string | ((c: { params: Params; data: Data }) => string);
};

type Match = { params: Params; data: unknown; handle: Handle };

export function Root() {
	// Get the final match, which is the deepest matching route
	const { params, data, handle } = useMatches().at(-1) as Match;
	const title =
		typeof handle.title === "string"
			? handle.title
			: handle.title?.({ params, data });
	useEffect(() => {
		if (title) document.title = title;
	}, [title]);
	return <Outlet />;
}
