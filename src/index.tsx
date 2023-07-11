import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";
import { Posts } from "./posts.tsx";
import * as api from "./reddit/api.ts";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/r/:subreddit/comments/:id/:title/*?",
    Component: Post,
  },
  {
    path: "/r/:subreddit",
    Component: Subreddit,
    loader: ({ params }) => {
      return api.posts(params.subreddit as string);
    },
  },
  { path: "/u/:user", Component: User },
  { path: "/", Component: Home },
  { path: "/*", Component: Missing },
]);

function Post() {
  const params = useParams<{ subreddit: string; id: string; title: string }>();
  return <h1>{params.title}</h1>;
}

function Subreddit() {
  const params = useParams<{ subreddit: string }>();
  return <Posts title={"/r/" + params.subreddit} />;
}

function User() {
  const params = useParams<{ user: string }>();
  return <Posts title={"/u/" + params.user} />;
}

function Home() {
  return <Posts title="/r/all" />;
}

function Missing() {
  return <h1>Not found</h1>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
