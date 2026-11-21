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
    credits: "Ballow Road Sand and Screen Hub",
  },
  amity: {
    image: "./assets/amity-jetty.webp",
    imageAlt: "Amity Point Jetty at sunset",
    credits: "Pacificwizard, CC0",
  },
  point: {
    image: "./assets/point-lookout.webp",
    imageAlt: "The coast at Point Lookout",
    credits: "Sarah Barry, CC BY 4.0",
  },
};

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
