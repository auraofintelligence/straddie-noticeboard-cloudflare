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
  filmNight: {
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
    title: "A film night on the bay",
    summary: "Saturday, 6.30 pm in the community hall courtyard, Dunwich. Come for an evening of local short films, including a one-minute profile of a maker shaping a timber bellyboard.",
    ...practiceArt.filmNight,
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
    title: "Write a local match report",
    summary: "Ask a club to confirm its result and fixture. Capture a short comment with permission, then make a headline and a captioned clip for the club screen.",
    ...spotIllustration("camera"),
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
    title: "Try a phone interview",
    summary: "Bring a phone and pair up for a practice interview. Ask a question about something your partner makes or does. Play back the recording together and agree which parts you could share.",
    ...spotIllustration("phone"),
  },
  {
    id: "dunwich-ferry-weather-guide",
    place: "Dunwich",
    category: "Learning",
    title: "Check the ferry and the weather",
    summary: "A timetable shows the planned service. Check your ferry operator for changes, and the Bureau of Meteorology for current weather and warnings.",
    ...spotIllustration("ferry"),
  },
];
