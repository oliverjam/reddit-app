type Props = { children: number };

export function Time({ children }: Props) {
	const date = new Date(children * 1000); // reddit uses seconds
	const relative = getRelativeTime(date);
	const full = date.toLocaleString("en-GB", {
		year: "2-digit",
		month: "long",
		day: "numeric",
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
	});
	return (
		<time dateTime={date.toISOString()} title={full}>
			{relative}
		</time>
	);
}

const rtf = new Intl.RelativeTimeFormat("en-GB", {
	numeric: "always",
	style: "short",
});

const time = {
	second: 1000,
	minute: 1000 * 60,
	hour: 1000 * 60 * 60,
	day: 1000 * 60 * 60 * 24,
	week: 1000 * 60 * 60 * 24 * 7,
	month: 1000 * 60 * 60 * 24 * 31,
	year: 1000 * 60 * 60 * 24 * 365,
};

// const SEC_MS = 1000;
// const MIN_MS = 1000 * 60;
// const HOUR_MS = 1000 * 60 * 60;
// const DAY_MS = 1000 * 60 * 60 * 24;
// const WEEK_MS = DAY_MS * 7;
// const MONTH_MS = DAY_MS * 31;
// const YEAR_MS = DAY_MS * 365;

type Unit = {
	value: number;
	unit: Intl.RelativeTimeFormatUnit;
};

function getTimeUnit(ms: number): Unit {
	if (ms < time.minute) return { value: ms / time.second, unit: "second" };
	if (ms < time.hour) return { value: ms / time.minute, unit: "minute" };
	if (ms < time.day) return { value: ms / time.hour, unit: "hour" };
	if (ms < time.week) return { value: ms / time.day, unit: "day" };
	if (ms < time.month) return { value: ms / time.week, unit: "week" };
	if (ms < time.year) return { value: ms / time.month, unit: "month" };
	return { value: ms / time.year, unit: "year" };
}

export function getRelativeTime(d: Date) {
	const now = Date.now();
	const then = d.getTime();
	const diff = now - then;
	const { value, unit } = getTimeUnit(diff);
	return rtf.format(Math.round(value) * -1, unit);
}
