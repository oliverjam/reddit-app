import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./routes/root.tsx";
import * as api from "./reddit/api.ts";
import "./index.css";

const router = createBrowserRouter([
  {
    Component: Root,
    children: [
      {
        path: "/r/:subreddit/:sort?",
        loader: api.posts,
        lazy: () => import("./routes/subreddit.tsx"),
        children: [
          {
            path: "comments/:id/:slug?/*?",
            loader: api.post,
            lazy: () => import("./routes/post.tsx"),
          },
        ],
      },
      {
        path: "/u/:user",
        loader: api.user,
        lazy: () => import("./routes/user.tsx"),
      },
      { path: "/search", loader: api.search },
      { path: "/*", lazy: () => import("./routes/missing.tsx") },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
