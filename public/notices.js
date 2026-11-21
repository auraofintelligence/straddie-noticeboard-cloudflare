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

const photos = {
  dunwich: {
    image: "./assets/dunwich-bay.webp",
    imageAlt: "Aerial view looking across the bay from Dunwich",
    imageCredit: {
      source: "Dunwich aerial from LJ Hooker Property Centre’s Ballow Road listing",
      sourceUrl: "https://www.commercialrealestate.com.au/property/10-12-ballow-road-dunwich-qld-4183-2020492491",
      note: "Cropped for display.",
    },
  },
  amity: {
    image: "./assets/amity-jetty.webp",
    imageAlt: "Amity Point Jetty at sunset",
    imageCredit: {
      source: "Amity Point Jetty at sunset by Pacificwizard",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Amity_Point_Jetty_at_Sunset._North_Stradbroke_Island,_Queensland,_Australia.jpg",
      licence: "CC0 1.0",
      licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      note: "Resized, converted to WebP and cropped for display.",
    },
  },
  point: {
    image: "./assets/point-lookout.webp",
    imageAlt: "The coast at Point Lookout",
    imageCredit: {
      source: "Point Lookout by Sarah Barry",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Point_Lookout,_North_Stradbroke_Island,_by_Sarah_Barry.jpg",
      licence: "CC BY 4.0",
      licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
      note: "Converted to WebP and cropped for display.",
    },
  },
};

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
    summary: "See how a community screening could invite neighbours to bring a camp chair and share a short film made on the island.",
    ...photos.dunwich,
  },
  {
    id: "amity-shared-table",
    place: "Amity Point",
    category: "Volunteering",
    title: "An island produce swap",
    summary: "A call-out for garden surplus, spare seedlings and volunteers to help run a shared table.",
    ...photos.amity,
  },
  {
    id: "point-club-match-report",
    place: "Point Lookout",
    category: "Clubs & sport",
    title: "Write a local match report",
    summary: "Ask a club to confirm its result and fixture. Capture a short comment with permission, then make a headline and a captioned clip for the club screen.",
    ...photos.point,
  },
  {
    id: "island-grant-ideas",
    place: "Island-wide",
    category: "Community",
    title: "From local idea to grant project",
    summary: "A notice inviting community groups to bring one project idea and look at the funding paths that might suit it.",
    ...photos.dunwich,
  },
  {
    id: "island-local-stories",
    place: "Island-wide",
    category: "Events",
    title: "Try a phone interview",
    summary: "A beginner practice session could teach how to ask one good question, record a clear answer and check which parts the speaker agrees to share.",
    ...photos.amity,
  },
  {
    id: "dunwich-ferry-weather-guide",
    place: "Dunwich",
    category: "Learning",
    title: "Check the ferry and the weather",
    summary: "A timetable shows the planned service. Check your ferry operator for changes, and the Bureau of Meteorology for current weather and warnings.",
    ...photos.dunwich,
  },
];
