# Straddie Noticeboard Network

A landing page and prototype for a proposed community noticeboard network on Minjerribah. One reviewed notice could appear on the web, clubhouse screens and public kiosks. Ready SETCO is the proposed local co-operative that would convene publishers and screen hosts and moderate the shared board. A live pilot still needs participating groups and venues, a shared review process and a way to publish to connected screens.

## Run locally

With Python 3 and Node.js available, run `npm start` from this folder and open [localhost:4185](http://localhost:4185/). Run `npm run check` to check the JavaScript modules. The site has no install step or hosted service dependencies.

- The board filters sample notices by place and category. The separate [project references page](public/network.html) lists work that informed the proposal.
- The [setup guide](public/setup.html) covers TV players, independent power, reviewing notices, Council coordination, outage exercises and a first pilot.
- The draft editor keeps the active draft in this browser and exports a review-only Markdown file. It can also build a prompt to copy into an AI tool for screen variants. Share the draft with the responsible publisher outside the site and check all adaptations.
- The screen preview can rotate the sample notices or show them one at a time. The portrait preview offers touch controls and a link to the matching town map. Use `screen.html?place=Dunwich&format=portrait&outage=1` to try text fallback with the sample set.
- The [maps and weather page](public/island.html) helps readers distinguish forecasts, observations and radar and links to the relevant official information, including Council's disaster dashboard. The drill simulates text fallback in the demo. Live publishing, an installed offline pack and device testing belong to a future pilot.

## Cloudflare

The `public/` folder is the complete deployable site. `wrangler.jsonc` configures Cloudflare Workers Static Assets. When ready to publish from an authenticated Cloudflare session, run `npx wrangler deploy` in the repository root. The local pilot has no deployed Cloudflare URL.

## Notices and images

The examples in `public/notices.js` are illustrations of possible notices. A live feed would need publisher approval, a verifiable public source, issue and expiry times, and confirmation of consent for the people and images represented.

Based on straddie-noticeboard-network by Luke Nathan Hayes / Strange But True / Aura of Intelligence, under the [Strange But True Public Source Licence](LICENCE.md).

- [Point Lookout](https://commons.wikimedia.org/wiki/File:Point_Lookout,_North_Stradbroke_Island,_by_Sarah_Barry.jpg) by Sarah Barry, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- [Amity Point Jetty at Sunset](https://commons.wikimedia.org/wiki/File:Amity_Point_Jetty_at_Sunset._North_Stradbroke_Island,_Queensland,_Australia.jpg) by Pacificwizard, [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
- [Dunwich aerial](https://github.com/auraofintelligence/ballow-road-sand-screen-hub/blob/main/assets/img/site-aerial-west-northwest-bay.webp) from Ballow Road Sand and Screen Hub, under the [project licence](https://github.com/auraofintelligence/ballow-road-sand-screen-hub/blob/main/LICENCE.md).

Photos are compressed or cropped for display.

The ferry-stop touchscreen is an AI-generated concept image showing a possible installation. The AI-generated logo and multi-size favicon use three overlapping notice slips, with neon green in front. The four accents come from the Ready SETCO favicon.

<details>
<summary>Image generation briefs</summary>

**Touchscreen concept**

Use case: product mockup, photorealistic documentary-style concept rendering for the Straddie Noticeboard Network. Create a horizontal 3:2 photograph-like proposal illustration of a freestanding outdoor public information touchscreen near a simple unbranded subtropical island ferry shelter in Moreton Bay, Queensland. Three-quarter eye-level view, kiosk in central foreground with generous room around it, quiet bay and low coastal vegetation behind, daylight after a passing shower, warm natural sunlight, realistic casual community infrastructure rather than a futuristic object. The kiosk is matte deep teal with a sheltered recessed portrait display at an accessible height, subtle anti-glare glass and broad base. Screen depicts a restrained warm-white and green interface with three large touch targets and a small abstract island map; omit readable words to avoid misleading display content. Soft teal water and sand palette. No people, brand logos, agency insignia, watermarks, emergency warnings, wires, electrical diagrams or assertions that this is an installed device. Make it a polished, believable rendering of a possible local installation, not a depiction of an identifiable venue.

**Logo and favicon**

Create one completely new brand icon for Straddie Noticeboard Network, a proposal for a public community noticeboard on an Australian island. Composition: a square midnight-navy #101020 rounded tile, nearly filling the canvas, with genuinely transparent corners. Center one bold modern pictogram of three overlapping notice slips, loosely fanned from one pin. The front sheet is unmistakably electric neon green #62F6A5, a chunky solid shape that occupies at least one-quarter of the whole icon, with one small midnight-navy horizontal line etched into the front so it reads as a notice. The back-left purple #8F4DFF and back-right sky blue #5FD8FF slips are distinct broad visible blocks. Place a yellow #FFD166 circular pushpin head at the upper center of the green sheet. The large green sheet must be the primary shape, memorable at 16 pixels. Carefully balanced, modern, confident, simple silhouette. Use plain, uniform solid colour on every shape, vector-like graphic fidelity, clean hard edges, no shading, reflections, smudges, gradients, light effects, mottling, shadows, dust or texture anywhere. No words or letters, no map pins, no mountains, no waves, no scenery, no mockup, no borders or additional icons. Export one centered square logo.

</details>
