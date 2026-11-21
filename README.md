# Straddie Noticeboard Network

A local pilot for a shared noticeboard across Dunwich, Amity Point, Point Lookout and the wider Minjerribah community. It takes the public notice, review and screen ideas from the [original Straddie Noticeboard Network](https://github.com/auraofintelligence/straddie-noticeboard-network) and brings them into a resident-facing board.

## Run locally

With Python 3 and Node.js available, run `npm start` from this folder and open [localhost:4185](http://localhost:4185/). Run `npm run check` to check the JavaScript modules. The site has no install step or hosted service dependencies.

- The board filters sample notices by place and category. The project directory includes the island, media, opportunity, civic and digital projects that informed the site.
- The draft editor keeps the active draft in this browser and exports a review-only Markdown file. Share that file with the responsible publisher outside the site.
- The screen preview can rotate the sample notices or show them one at a time. Use `screen.html?place=Dunwich&format=portrait` for a Dunwich portrait preview.

## Cloudflare

The `public/` folder is the complete deployable site. `wrangler.jsonc` configures Cloudflare Workers Static Assets. When ready to publish from an authenticated Cloudflare session, run `npx wrangler deploy` in the repository root. The local pilot has no deployed Cloudflare URL.

## Notices and images

The examples in `public/notices.js` are illustrations of possible notices. A live feed would need publisher approval, a verifiable public source, issue and expiry times, and confirmation of consent for the people and images represented.

Based on straddie-noticeboard-network by Luke Nathan Hayes / Strange But True / Aura of Intelligence, under the [Strange But True Public Source Licence](LICENCE.md).

- [Point Lookout](https://commons.wikimedia.org/wiki/File:Point_Lookout,_North_Stradbroke_Island,_by_Sarah_Barry.jpg) by Sarah Barry, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- [Amity Point Jetty at Sunset](https://commons.wikimedia.org/wiki/File:Amity_Point_Jetty_at_Sunset._North_Stradbroke_Island,_Queensland,_Australia.jpg) by Pacificwizard, [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
- [Dunwich aerial](https://github.com/auraofintelligence/ballow-road-sand-screen-hub/blob/main/assets/img/site-aerial-west-northwest-bay.webp) from Ballow Road Sand and Screen Hub, under the [project licence](https://github.com/auraofintelligence/ballow-road-sand-screen-hub/blob/main/LICENCE.md).

Photos are compressed or cropped for display.
