import { DisplayError } from "../error.tsx";
import { Handle } from "./root.tsx";

export const handle: Handle = {
  title: "Not found",
};

export function Component() {
  return (
    <div className="Cover">
      <DisplayError retry={false}>Not found</DisplayError>
    </div>
  );
}

Component.displayName = "MissingPage";
