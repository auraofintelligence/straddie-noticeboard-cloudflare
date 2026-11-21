export const places = ["Dunwich", "Amity Point", "Point Lookout", "Island-wide"];

export const categories = ["Events", "Clubs & sport", "Paid work", "Volunteering", "Arts & culture", "Community", "Learning"];

export const noticeOutlets = Object.freeze(["web", "tv", "kiosk"]);

export function allowsNoticeOutlet(notice, outlet) {
  return noticeOutlets.includes(outlet)
    && (notice.outlets === undefined || (Array.isArray(notice.outlets) && notice.outlets.includes(outlet)));
}

export function noticesForScreen(records, place, format) {
  const outlet = format === "portrait" ? "kiosk" : "tv";
  return records.filter(notice => (!place || notice.place === place) && allowsNoticeOutlet(notice, outlet));
}

const practiceArt = {
  artsNight: {
    image: "./assets/practice-film-night.webp",
    imageAlt: "Concept of neighbours watching a film outdoors beside the bay",
    imageCredit: {
      source: "Ballow Road Sand and Screen Hub by Luke Nathan Hayes / Strange But True / Aura of Intelligence",
      sourceUrl: "https://auraofintelligence.github.io/ballow-road-sand-screen-hub/film.html",
      licence: "Public Source Licence",
      licenceUrl: "https://github.com/auraofintelligence/ballow-road-sand-screen-hub/blob/main/LICENCE.md",
      note: "Concept illustration, cropped for display.",
    },
  },
  produceSwap: {
    image: "./assets/practice-produce-swap.webp",
    imageAlt: "Concept of people sorting harvested herbs and leafy greens around a shared table",
    imageCredit: {
      source: "Straddie Shared Table by Luke Nathan Hayes / Strange But True / Aura of Intelligence",
      sourceUrl: "https://auraofintelligence.github.io/shared-table-initiative/garden-mate.html",
      licence: "Public Source Licence",
      licenceUrl: "https://github.com/auraofintelligence/shared-table-initiative/blob/master/LICENCE.md",
      note: "Garden Mate concept illustration, cropped for display.",
    },
  },
  beachVolleyball: {
    image: "./assets/practice-beach-volleyball.webp",
    imageAlt: "Concept illustration of players at a volleyball net on sand courts with shaded spectator seating",
    imageCredit: {
      source: "Sand sports concept by Luke Nathan Hayes / Strange But True / Aura of Intelligence",
      sourceUrl: "https://auraofintelligence.github.io/ballow-road-sand-screen-hub/sports.html",
      licence: "Public Source Licence",
      licenceUrl: "https://github.com/auraofintelligence/ballow-road-sand-screen-hub/blob/main/LICENCE.md",
      note: "Illustration of a proposed facility.",
    },
  },
};

function spotIllustration(subject) {
  return { image: `./assets/icons/${subject}.webp`, imageAlt: "", imageKind: "spot" };
}

export function renderImageCredit(caption, credit) {
  caption.replaceChildren();
  caption.hidden = !credit;
  if (!credit) return;

  const source = document.createElement("a");
  source.href = credit.sourceUrl;
  source.textContent = credit.source;
  caption.append(source);

  if (credit.licence) {
    const licence = document.createElement("a");
    licence.href = credit.licenceUrl;
    licence.textContent = credit.licence;
    caption.append(" · ", licence);
  }
  if (credit.note) caption.append(" · ", credit.note);
}

export const notices = [
  {
    id: "dunwich-screen-night",
    place: "Dunwich",
    category: "Arts & culture",
    title: "Dunwich island arts night",
    summary: "Practice invitation. Saturday, 6.30 pm in the community hall courtyard, Dunwich. Hear original music performed live and see a short captioned film about local printmaking, painting and music, told in the artists’ own voices.",
    ...practiceArt.artsNight,
  },
  {
    id: "amity-shared-table",
    place: "Amity Point",
    category: "Volunteering",
    title: "An island produce swap",
    summary: "Bring spare seedlings, herbs or garden produce to the shared table. Label what you bring so neighbours know what grows well. If you can help set out the table, let the swap organiser know.",
    ...practiceArt.produceSwap,
  },
  {
    id: "point-club-match-report",
    place: "Point Lookout",
    category: "Clubs & sport",
    title: "First time playing lawn bowls?",
    summary: "Coming along on your own? Ask at the clubhouse about joining a social game. Check the roll-up time, what to wear on the green and whether bowls are available to borrow.",
    ...spotIllustration("lawn-bowls"),
  },
  {
    id: "island-grant-ideas",
    place: "Island-wide",
    category: "Community",
    title: "From local idea to grant project",
    summary: "Bring a community project idea to the funding workshop. Sketch what it would cost to get started, who would look after it and which islanders would benefit.",
    ...spotIllustration("grants"),
  },
  {
    id: "island-local-stories",
    place: "Island-wide",
    category: "Events",
    title: "Bring a song to an acoustic night",
    summary: "Locals and travellers are invited to share a song. Tell the organiser what you play, which language you’ll sing in and whether you’d like an introduction. Ask the musicians before recording or sharing a set.",
    ...spotIllustration("guitar"),
  },
  {
    id: "dunwich-ferry-weather-guide",
    place: "Dunwich",
    category: "Learning",
    title: "Check the ferry and the weather",
    summary: "A timetable shows the planned service. Check your ferry operator for changes, and the Bureau of Meteorology for current weather and warnings.",
    ...spotIllustration("ferry"),
  },
  {
    id: "amity-cricket-scorer",
    place: "Amity Point",
    category: "Clubs & sport",
    title: "Can you score an innings?",
    summary: "Amity cricketers could use another pair of hands at the scorer’s table. New to the scorebook? Sit with an experienced scorer for an innings. Check the start time with the team before heading to the ground.",
    ...spotIllustration("cricket"),
  },
  {
    id: "dunwich-league-gate",
    place: "Dunwich",
    category: "Volunteering",
    title: "Lend a hand at the footy",
    summary: "A rugby league match at Ron Stark Oval needs someone on the gate and a second person to take over at half-time. Ask the volunteer coordinator about a shift. Visiting supporters can check the kick-off against their return ferry.",
    ...spotIllustration("league"),
  },
  {
    id: "point-surf-club",
    place: "Point Lookout",
    category: "Clubs & sport",
    title: "Come along to a surf club sign-on",
    summary: "Families interested in junior surf lifesaving can ask the organisers about age groups, swim checks and what to bring. Confirm the meeting beach before leaving home.",
    ...spotIllustration("surf-club"),
  },
  {
    id: "amity-fishing-club",
    place: "Amity Point",
    category: "Clubs & sport",
    title: "Bring your reel to club night",
    summary: "Bring a reel you’d like a hand with at a fishing club gear night. Members can show newcomers how to look after their tackle. Check the meeting place with the organiser.",
    ...spotIllustration("fishing"),
  },
  {
    id: "island-beach-volleyball",
    place: "Island-wide",
    category: "Clubs & sport",
    title: "Help shape a beach volleyball club",
    summary: "What would make social beach volleyball work for you on Straddie? The proposed club could hear from players, people who could look after portable nets, and hosts with a suitable space. A court and playing times would need local agreement.",
    ...practiceArt.beachVolleyball,
  },
  {
    id: "point-paid-market-shift",
    place: "Point Lookout",
    category: "Paid work",
    title: "Market morning setup shift",
    summary: "A stallholder needs paid help setting up before market opening and packing down afterwards. Ask for the rate, start and finish times, location and employer’s contact before accepting. Check how you’ll get there for the early start.",
    ...spotIllustration("venue"),
  },
  {
    id: "island-film-club",
    place: "Island-wide",
    category: "Arts & culture",
    title: "What would you put on the big screen?",
    summary: "Help shape a proposed island film club. Suggest a local short, offer to introduce a film, or help with captions and projection. The crew would clear screening rights before announcing a programme.",
    ...spotIllustration("camera"),
  },
  {
    id: "island-conservation-volunteers",
    place: "Island-wide",
    category: "Volunteering",
    title: "Help out behind the scenes in wildlife rescue",
    summary: "Interested in helping an island wildlife group with phone cover, supplies or fundraising? Ask the volunteer coordinator what training and time each job needs. Sick or injured animals should be reported directly to a trained rescuer.",
    ...spotIllustration("phone"),
  },
  {
    id: "island-rural-fire-volunteering",
    place: "Island-wide",
    category: "Volunteering",
    title: "Ask about joining a rural fire brigade",
    summary: "Volunteers can help with brigade support as well as trained firefighting roles. Use the brigade finder on the work and volunteering page to ask about local needs, availability and training.",
    ...spotIllustration("review"),
  },
  {
    id: "dunwich-dance-invitation",
    place: "Dunwich",
    category: "Arts & culture",
    title: "What to know before a dance performance",
    summary: "For a public performance on Quandamooka Country, the dancers and cultural organisers would choose the introduction, audience invitation and any photography conditions. Check the organiser’s notice before getting a phone out.",
    ...spotIllustration("notice"),
  },
];
