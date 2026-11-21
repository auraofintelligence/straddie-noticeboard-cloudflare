# Straddie Noticeboard Network

A local community resource and proposed venue pilot for Minjerribah / North Stradbroke Island. Luke Nathan Hayes is developing the proposal through [Strange But True](https://auraofintelligence.github.io/strange-but-true/index.html) while seeking local support to form Ready SETCO. The proposed co-operative would convene local publishers and hosts and moderate the board. The software includes a reviewed public feed. A staffed venue and a moderation team still need local agreement.

## Run locally

With Python 3 and Node.js available, run `npm start` from this folder and open [localhost:4185](http://localhost:4185/). Run `npm run check` to check the JavaScript modules. The site has no install step or hosted service dependencies.

- The homepage introduces the island pilot, community resources and a worked Dunwich notice. The [publishing guide](public/how-it-works.html) explains the workflow and responsibilities. The [practice noticeboard](public/board.html) filters examples by place and category. [Project references](public/network.html) stay in the home footer.
- The [media training page](public/training.html) takes a beginner from a story brief and source check through phone recording, editing, captioning, publication and corrections.
- The [setup guide](public/setup.html) covers TV players, independent power, reviewing notices, Council coordination, outage exercises and a first pilot. [Screens and outages](public/resilience.html) explains failure modes and correction checks.
- [Business onboarding](public/businesses.html) covers posting and hosting, with a local plan exporter. [Grants for a first pilot](public/grants.html) explains scope, applicant readiness, a sample budget, evidence and official grant leads.
- The draft editor keeps the active draft in this browser and exports a review-only Markdown file. It can also build a prompt to copy into an AI tool for screen variants. Share the draft with the responsible publisher outside the site and check all adaptations.
- The screen preview can rotate the sample notices or show them one at a time. The portrait preview offers touch controls and a link to the matching town map. Use `screen.html?place=Dunwich&format=portrait&outage=1` to try text fallback with the sample set.
- The [maps and weather page](public/island.html) helps readers distinguish forecasts, observations and radar and links to the relevant official information, including Council's disaster dashboard. The drill simulates text fallback in the demo. A new browser session needs connectivity to load the site. Installed offline packs, tested battery runtime and maintenance arrangements require a venue trial.

- The [island pilot](public/pilot.html) brings the first host, media crew, funding and review responsibilities together. [Work and volunteering](public/opportunities.html) includes sourced opportunity finders and a private Community Hours worksheet. [Emergency information](public/emergencies.html) points residents and visitors to the issuing agencies and local radio.

## Publishing a pilot notice

The [pilot board](http://localhost:4185/board.html?mode=pilot) and [pilot screen](http://localhost:4185/screen.html?mode=pilot) use the reviewed notices in [pilot-notices.json](public/data/pilot-notices.json). The initial feed is empty. Example notices are available in the practice board.

1. An author exports a local draft and shares it with the responsible reviewer. Confirm the issuer, reuse permissions, audience and closing time. Keep private contacts and permission records outside the public folder.
2. An authorised steward adds an approved record to the file’s `notices` array. Leave the top-level `schema` as `notice-feed.v1` and `zone` as `minjerribah`. Each record requires a unique lower-case, hyphenated `id`, `status` set to `approved`, `title`, `publisher`, `place`, `category`, `summary`, public HTTPS `sourceUrl`, a public `reviewedBy` role or credit, `reviewedAt` and `expiresAt`. Use the places and categories in the draft form. Timestamps include seconds and an offset, for example `2027-02-15T09:00:00+10:00`. An optional `startsAt` controls when display begins.
3. Run `npm run check:feed`. Review the change on the local pilot board and screen. Release the same checked site to the participating venue under its agreed publication process. Connected devices request updates roughly once a minute and remove expired notices at their take-down time.
4. Correct or renew a notice under its existing ID with a fresh review time. For a withdrawal, remove the row or replace it with only its ID and `"status": "withdrawn"`. Publish the revision and have the host verify it on the actual display. If the feed cannot be checked, the pilot display reports it as unavailable.

## Cloudflare

The `public/` folder is the complete deployable site. `wrangler.jsonc` configures Cloudflare Workers Static Assets. When ready to publish from an authenticated Cloudflare session, run `npx wrangler deploy` in the repository root. The local pilot has no deployed Cloudflare URL.

## Notices and images

The examples in `public/notices.js` are illustrations of possible notices. A live feed would need publisher approval, a verifiable public source, issue and expiry times, and confirmation of consent for the people and images represented.

Based on straddie-noticeboard-network by Luke Nathan Hayes / Strange But True / Aura of Intelligence, under the [Strange But True Public Source Licence](LICENCE.md).

- The original homepage artwork by Luke Nathan Hayes / Strange But True / Aura of Intelligence is reproduced unchanged. It illustrates how one draft could become a wall display, kiosk, tablet, phone notice or low-power fallback. [Original artwork](https://github.com/auraofintelligence/straddie-noticeboard-network/blob/main/assets/noticeboard-device-pipeline.webp).
- [Point Lookout](https://commons.wikimedia.org/wiki/File:Point_Lookout,_North_Stradbroke_Island,_by_Sarah_Barry.jpg) by Sarah Barry, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- [Amity Point Jetty at Sunset](https://commons.wikimedia.org/wiki/File:Amity_Point_Jetty_at_Sunset._North_Stradbroke_Island,_Queensland,_Australia.jpg) by Pacificwizard, [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
- [Dunwich aerial](https://github.com/auraofintelligence/ballow-road-sand-screen-hub/blob/main/assets/img/site-aerial-west-northwest-bay.webp) from Ballow Road Sand and Screen Hub, under the [project licence](https://github.com/auraofintelligence/ballow-road-sand-screen-hub/blob/main/LICENCE.md).

- The island locator uses the north-up relief supplied by [The Straddie Twins](https://github.com/auraofintelligence/straddie-twins/blob/main/assets/island/island-relief.jpg). Source, imagery and terrain credits are displayed with the map.
- The [editorial icon sheet](public/assets/icons/noticeboard-sheet.webp) and [venue rehearsal](public/assets/pilot-rehearsal.webp) are original AI illustrations generated with the built-in image tool. Individual icons are cut from the sheet for local delivery.
- The site uses the local Archivo variable typeface from the Ready SETCO project, distributed with its [SIL Open Font License](public/assets/fonts/OFL.txt).

Photos are compressed or cropped for display.

The ferry-stop touchscreen is an AI-generated concept image showing a possible installation. The AI-generated logo and multi-size favicon use three overlapping notice slips, with neon green in front. The four accents come from the Ready SETCO favicon.

<details>
<summary>Image generation briefs</summary>

**Visual guide icons**

Create a square editorial illustration asset sheet for the Straddie Noticeboard Network website. EXACTLY twelve separate illustrated objects in a 4-column by 3-row regular grid. Each cell is an equal rectangle; center one icon in each cell, wide generous transparent gutters, no dividers, no lettering, no numbers, no text, no captions. Place objects at relative X centers 12.5%, 37.5%, 62.5%, 87.5% and Y centers 16.7%, 50%, 83.3%. Clear distinct object per cell in this exact reading order: top row = (1) folded paper notice with mint green pushpin, (2) clipboard with large tick and pencil for editorial review, (3) vertical mobile phone displaying one mint notice, (4) wide flat-screen television displaying a simple notice. Middle row = (5) freestanding interactive touch kiosk terminal on sturdy pedestal, (6) portable backup battery with bolt, (7) compact video camera with microphone, (8) unfolded paper island map with pin. Bottom row = (9) coastal shopfront with striped awning and a display in the window, (10) grant budget ledger with stack of coins, (11) small Queensland passenger ferry with wheelhouse on blue water, (12) local radio mast with signal rings. Distinctive high-end field-guide spot illustrations, bold dark navy ink contours, subtle offset screenprint details, sculptural 3/4 perspective, crisp luminous mint/neon green, sky aqua, pale apricot, small lilac and golden yellow accents, plenty of light internal fill for legibility on either dark navy or pale backgrounds. Confident graphic simplification and eye-catching silhouettes that read at 48px. No cast shadows outside silhouettes, no backgrounds, no land or environment outside icon, genuinely transparent canvas, each mark fully inside its cell and consistently scaled. No frames.

**Local pilot rehearsal**

A wide cinematic editorial photograph-style concept illustration for an Australian island community noticeboard pilot website, roughly 16:9 landscape composition. A small practical, open-sided subtropical Queensland community clubhouse beside the bay near a ferry landing. In the foreground a local female volunteer coordinator and a young adult media trainee are checking an ordinary wall-mounted widescreen TV against the same notice on a phone; a third visitor with a sun hat pauses by the window, and in the distance a small commuter ferry on calm water. Candid human gestures, documentary observation, warm afternoon light on natural timber, deep ink-blue shadows, teals and small natural mint accents, honest analogue texture, restrained professional Australian magazine art direction. Screen shows a restrained public notice with simple graphic headline bars and a bay thumbnail, no legible words. Composition clear and credible at desktop and mobile, main people and TV near centre, one phone held naturally, no split-screen, no floating overlays, no brands or logos, no official insignia, no Olympics references, no visible text, no fake warning or timetable. Make the people the story; a rehearsal concept, not a real facility or named person.

**Touchscreen concept**

Use case: product mockup, photorealistic documentary-style concept rendering for the Straddie Noticeboard Network. Create a horizontal 3:2 photograph-like proposal illustration of a freestanding outdoor public information touchscreen near a simple unbranded subtropical island ferry shelter in Moreton Bay, Queensland. Three-quarter eye-level view, kiosk in central foreground with generous room around it, quiet bay and low coastal vegetation behind, daylight after a passing shower, warm natural sunlight, realistic casual community infrastructure rather than a futuristic object. The kiosk is matte deep teal with a sheltered recessed portrait display at an accessible height, subtle anti-glare glass and broad base. Screen depicts a restrained warm-white and green interface with three large touch targets and a small abstract island map; omit readable words to avoid misleading display content. Soft teal water and sand palette. No people, brand logos, agency insignia, watermarks, emergency warnings, wires, electrical diagrams or assertions that this is an installed device. Make it a polished, believable rendering of a possible local installation, not a depiction of an identifiable venue.

**Logo and favicon**

Create one completely new brand icon for Straddie Noticeboard Network, a proposal for a public community noticeboard on an Australian island. Composition: a square midnight-navy #101020 rounded tile, nearly filling the canvas, with genuinely transparent corners. Center one bold modern pictogram of three overlapping notice slips, loosely fanned from one pin. The front sheet is unmistakably electric neon green #62F6A5, a chunky solid shape that occupies at least one-quarter of the whole icon, with one small midnight-navy horizontal line etched into the front so it reads as a notice. The back-left purple #8F4DFF and back-right sky blue #5FD8FF slips are distinct broad visible blocks. Place a yellow #FFD166 circular pushpin head at the upper center of the green sheet. The large green sheet must be the primary shape, memorable at 16 pixels. Carefully balanced, modern, confident, simple silhouette. Use plain, uniform solid colour on every shape, vector-like graphic fidelity, clean hard edges, no shading, reflections, smudges, gradients, light effects, mottling, shadows, dust or texture anywhere. No words or letters, no map pins, no mountains, no waves, no scenery, no mockup, no borders or additional icons. Export one centered square logo.

</details>
