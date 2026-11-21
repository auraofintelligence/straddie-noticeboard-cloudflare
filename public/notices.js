export const places = ["Dunwich", "Amity Point", "Point Lookout", "Island-wide"];

export const categories = ["Events", "Clubs & sport", "Volunteering", "Arts & culture", "Community", "Learning"];

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
    id: "plfc-junior-clinic",
    place: "Point Lookout",
    category: "Clubs & sport",
    title: "Junior fishing clinic",
    summary: "A club notice could tell families what to bring, who can take part and where to check the details before heading out.",
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
    title: "Share a short island story",
    summary: "A sample invitation to a community storytelling session, with space for first-time contributors and local groups.",
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
