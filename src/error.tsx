import { Link, useNavigation } from "react-router-dom";
import { Icon } from "./icon.tsx";

export function DisplayError({
  children,
  retry = true,
}: {
  children: string;
  retry?: boolean;
}) {
  const { state } = useNavigation();
  return (
    <div
      className="Gutter"
      style={{
        display: "grid",
        gap: "var(--s10)",
        placeContent: "center",
        placeItems: "center",
      }}
    >
      <p
        style={{
          display: "flex",
          gap: "var(--s0)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon name="error" size={16} /> <b>{children}</b>
      </p>
      {retry && (
        <Link className="Pill PillLink" to="" relative="path" replace>
          {state === "loading" ? "Retrying" : "Retry"}{" "}
          <Icon name="reload" size={16} />
        </Link>
      )}
    </div>
  );
}
