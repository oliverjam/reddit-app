import { useEffect, useRef } from "react";
import { useFetcher, useNavigate } from "react-router-dom";

export function Search({ defaultValue }: { defaultValue: string }) {
	const fetcher = useFetcher();
	const subreddits = fetcher.data as string[] | undefined;
	const navigate = useNavigate();
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		function focus(e: KeyboardEvent) {
			if (e.key === "k" && e.metaKey) {
				e.preventDefault();
				ref.current?.select();
			}
		}
		window.addEventListener("keydown", focus);
		return () => window.removeEventListener("keydown", focus);
	}, []);
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				navigate(`/r/${e.currentTarget.query.value}/`);
			}}
		>
			<input
				className="font-bold text-lg px-2 -ml-2"
				ref={ref}
				name="query"
				aria-label="Search subreddits"
				placeholder="Search subreddits"
				defaultValue={defaultValue}
				list="results"
				onChange={(e) => {
					fetcher.submit(
						{ query: e.currentTarget.value },
						{ action: "/search" }
					);
				}}
			/>
			{subreddits && (
				<datalist id="results">
					{subreddits.map((sub) => (
						<option key={sub}>{sub}</option>
					))}
				</datalist>
			)}
		</form>
	);
}
