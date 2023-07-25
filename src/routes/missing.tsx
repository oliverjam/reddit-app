import { Handle } from "./root.tsx";

export const handle: Handle = {
  title: "Not found",
};

export function Component() {
  return <h1>Not found</h1>;
}

Component.displayName = "MissingPage";
