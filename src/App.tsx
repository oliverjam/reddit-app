import type { Component } from "solid-js";
import { Routes, Route, useParams } from "@solidjs/router";

const App: Component = () => {
  return (
    <Routes>
      <Route path="/r/:subreddit/comments/:id/:title/*?" component={Post} />
      <Route path="/r/:subreddit" component={Subreddit} />
      <Route path="/u/:user" component={User} />
      <Route path="/" component={Home} />
      <Route path="/*" component={Missing} />
    </Routes>
  );
};

const Post: Component = () => {
  const params = useParams<{ subreddit: string; id: string; title: string }>();
  return <h1>{params.title}</h1>;
};

const Subreddit: Component = () => {
  const params = useParams<{ subreddit: string }>();
  return <h1>/r/{params.subreddit}</h1>;
};

const User: Component = () => {
  const params = useParams<{ user: string }>();
  return <h1>/u/{params.user}</h1>;
};

const Home: Component = () => {
  return <h1>/r/all</h1>;
};

const Missing: Component = () => {
  return <h1>Not found</h1>;
};

export default App;
