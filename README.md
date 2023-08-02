# App for Reddit

[![Netlify Status](https://api.netlify.com/api/v1/badges/c7a5d704-5020-46fd-aed7-1dd66dd3e55f/deploy-status)](https://app.netlify.com/sites/rddit/deploys)

No idea what to name this yet. A simplified Reddit viewer—no API required. I actually use this, which is more than I can say for the official apps.

## Run locally

1. Make sure you have Git and Node installed
1. Clone this repo
1. `npm install`
1. `npm run dev`

## Architecture

This is a pretty standard client-side React Router app written in TypeScript. It used the fancy new data loader APIs back-ported from Remix. The routes are defined in `src/index.tsx`. All the wrangling of Reddit's awful API is quarantined in the `src/reddit/` directory.

## UX

I'm used to browsing Reddit via Relay on Android. This preloads all the posts in a subreddit view so that you can instantly view the content while the comments lazy-load underneath. I wanted to reproduce this on the web—it turns out React Router's `defer` is really nice for this.

I also like multi-column UIs on desktop, so I wanted to ensure I could see a list of subreddit posts on the left whilst browsing specific individual posts on the right.
