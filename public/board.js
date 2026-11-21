import { categories, notices, places } from "./notices.js";
import { addPills, setActivePill } from "./filters.js";

const placeFilters = document.querySelector("#places");
const categoryFilter = document.querySelector("#category-filter");
const noticeGrid = document.querySelector("#notice-grid");
const noticeTemplate = document.querySelector("#notice-template");
const noticeCount = document.querySelector("#notice-count");
const emptyState = document.querySelector("#empty-state");

let selectedPlace = "";

function renderNotices() {
  const category = categoryFilter.value;
  const matches = notices.filter(notice =>
    (!selectedPlace || notice.place === selectedPlace) &&
    (!category || notice.category === category),
  );

  noticeGrid.replaceChildren(...matches.map(notice => {
    const card = noticeTemplate.content.cloneNode(true);
    const image = card.querySelector(".notice-image");
    image.src = notice.image;
    image.alt = notice.imageAlt;
    card.querySelector(".notice-place").textContent = notice.place;
    card.querySelector(".notice-category").textContent = notice.category;
    card.querySelector("h2").textContent = notice.title;
    card.querySelector(".notice-summary").textContent = notice.summary;
    const link = card.querySelector(".notice-link");
    const params = new URLSearchParams({ place: notice.place, notice: notice.id });
    link.href = `./screen.html?${params}`;
    link.setAttribute("aria-label", `Preview on a screen: ${notice.title}`);
    return card;
  }));

  emptyState.hidden = matches.length > 0;
  noticeCount.textContent = `${matches.length} sample ${matches.length === 1 ? "notice" : "notices"}`;
}

for (const category of categories) {
  categoryFilter.add(new Option(category, category));
}

addPills(placeFilters, places, "All places", place => {
  selectedPlace = place;
  renderNotices();
});
categoryFilter.addEventListener("change", renderNotices);
document.querySelector("#clear-filters").addEventListener("click", () => {
  selectedPlace = "";
  categoryFilter.value = "";
  setActivePill(placeFilters, "");
  renderNotices();
  placeFilters.querySelector("button").focus();
});

renderNotices();
