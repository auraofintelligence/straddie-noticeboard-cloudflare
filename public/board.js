import { allowsNoticeOutlet, categories, notices, places } from "./notices.js";
import { addPills, setActivePill } from "./filters.js";
import { formatPilotTime, watchPilotFeed } from "./pilot-feed.js";

const placeFilters = document.querySelector("#places");
const categoryFilter = document.querySelector("#category-filter");
const noticeGrid = document.querySelector("#notice-grid");
const noticeTemplate = document.querySelector("#notice-template");
const noticeCount = document.querySelector("#notice-count");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyDescription = document.querySelector("#empty-description");
const clearFilters = document.querySelector("#clear-filters");
const coverage = document.querySelector("#board-coverage");
const startDraft = document.querySelector("#board-empty-draft");
const isPilot = new URLSearchParams(window.location.search).get("mode") === "pilot";
const itemLabel = isPilot ? "reviewed" : "sample";

let selectedPlace = "";
let feedState = isPilot ? "loading" : "ready";
let displayNotices = isPilot ? [] : notices.filter(notice => allowsNoticeOutlet(notice, "web"));

function renderNotices() {
  const category = categoryFilter.value;
  const categoryMatches = displayNotices.filter(notice => !category || notice.category === category);
  const matches = categoryMatches.filter(notice => !selectedPlace || notice.place === selectedPlace);

  for (const { button, label, count } of placeCards) {
    const place = button.dataset.value;
    const total = place ? categoryMatches.filter(notice => notice.place === place).length : categoryMatches.length;
    count.textContent = String(total);
    button.setAttribute("aria-label", `${label}, ${total} ${itemLabel} ${total === 1 ? "notice" : "notices"}`);
    button.style.setProperty("--notice-share", `${categoryMatches.length ? total / categoryMatches.length * 100 : 0}%`);
  }

  noticeGrid.replaceChildren(...matches.map(notice => {
    const card = noticeTemplate.content.cloneNode(true);
    const image = card.querySelector(".notice-image");
    if (notice.image) {
      image.src = notice.image;
      image.alt = notice.imageAlt;
    } else {
      image.hidden = true;
      card.querySelector(".notice-media").classList.add("notice-media-text");
    }
    card.querySelector(".notice-place").textContent = notice.place;
    card.querySelector(".notice-category").textContent = notice.category;
    card.querySelector("h2").textContent = notice.title;
    card.querySelector(".notice-summary").textContent = notice.summary;
    const link = card.querySelector(".notice-link");
    const params = new URLSearchParams({ place: notice.place, notice: notice.id });
    if (isPilot) {
      const source = card.querySelector(".notice-source");
      const sourceLink = card.querySelector(".notice-source-link");
      source.textContent = `${notice.publisher} · Expires ${formatPilotTime(notice.expiresAt)} AEST`;
      source.hidden = false;
      sourceLink.href = notice.sourceUrl;
      sourceLink.hidden = false;
      params.set("mode", "pilot");
    }
    const hasTv = allowsNoticeOutlet(notice, "tv");
    const hasKiosk = allowsNoticeOutlet(notice, "kiosk");
    link.hidden = !hasTv && !hasKiosk;
    if (!link.hidden) {
      if (!hasTv) params.set("format", "portrait");
      link.href = `./screen.html?${params}`;
      link.setAttribute("aria-label", `Preview on a screen: ${notice.title}`);
    }
    return card;
  }));

  coverage.hidden = isPilot && displayNotices.length === 0;
  emptyState.hidden = matches.length > 0 || feedState !== "ready";
  clearFilters.hidden = displayNotices.length === 0;
  startDraft.hidden = !isPilot || displayNotices.length > 0;
  const hasNotices = displayNotices.length > 0;
  emptyTitle.textContent = hasNotices ? "No notices match those filters" : "No reviewed notices on this board yet";
  emptyDescription.textContent = hasNotices ? "Try another place or category." : "Notices will appear here when a steward approves them for the phone and web board.";
  if (feedState === "loading") noticeCount.textContent = "Checking the reviewed pilot feed…";
  else if (feedState === "unavailable") noticeCount.textContent = "The reviewed pilot feed is unavailable. This board will try again shortly.";
  else noticeCount.textContent = `${matches.length} ${itemLabel} ${matches.length === 1 ? "notice" : "notices"} shown`;
}

for (const category of categories) {
  categoryFilter.add(new Option(category, category));
}

addPills(placeFilters, places, "All places", place => {
  selectedPlace = place;
  renderNotices();
});
const placeCards = Array.from(placeFilters.querySelectorAll("button"), button => {
  const label = button.textContent;
  const count = document.createElement("span");
  const bar = document.createElement("span");
  count.className = "board-place-count";
  bar.className = "board-place-bar";
  bar.setAttribute("aria-hidden", "true");
  button.append(count, bar);
  return { button, label, count };
});
categoryFilter.addEventListener("change", renderNotices);
clearFilters.addEventListener("click", () => {
  selectedPlace = "";
  categoryFilter.value = "";
  setActivePill(placeFilters, "");
  renderNotices();
  placeFilters.querySelector("button").focus();
});

if (isPilot) {
  document.title = "Reviewed pilot board | Straddie Noticeboard Network";
  document.querySelector("#board-title").textContent = "Reviewed pilot board";
  document.querySelector("#board-description").textContent = "See current notices approved for the Minjerribah phone and web board. Each notice names its publisher, public source and take-down time.";
  document.querySelector("#coverage-title").textContent = "Reviewed notices by place";
  document.querySelector("#board-footer-note").textContent = "Reviewed notices for Dunwich, Amity Point, Point Lookout and the wider island.";
  const modeLink = document.querySelector("#board-mode-link");
  modeLink.href = "./board.html";
  modeLink.textContent = "Try the practice board";
  document.querySelector("#board-pilot-screen").hidden = false;
  watchPilotFeed((state, currentNotices) => {
    feedState = state;
    displayNotices = currentNotices.filter(notice => allowsNoticeOutlet(notice, "web"));
    renderNotices();
  });
} else {
  renderNotices();
}
