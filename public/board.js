import { categories, notices, places } from "./notices.js";
import { projects } from "./network.js";

const placeFilters = document.querySelector("#places");
const categoryFilter = document.querySelector("#category-filter");
const noticeGrid = document.querySelector("#notice-grid");
const noticeTemplate = document.querySelector("#notice-template");
const noticeCount = document.querySelector("#notice-count");
const emptyState = document.querySelector("#empty-state");

const groupFilters = document.querySelector("#project-groups");
const projectGrid = document.querySelector("#project-grid");
const projectTemplate = document.querySelector("#project-template");
const projectCount = document.querySelector("#project-count");
const moreProjects = document.querySelector("#more-projects");

const projectLimit = 6;
let selectedPlace = "";
let selectedGroup = "";
let showAllProjects = false;

function addPills(container, values, allLabel, select) {
  for (const value of ["", ...values]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pill";
    button.dataset.value = value;
    button.textContent = value || allLabel;
    button.setAttribute("aria-pressed", String(!value));
    button.addEventListener("click", () => {
      setActivePill(container, value);
      select(value);
    });
    container.append(button);
  }
}

function setActivePill(container, value) {
  for (const button of container.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.value === value));
  }
}

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
    card.querySelector("h3").textContent = notice.title;
    card.querySelector(".notice-summary").textContent = notice.summary;
    const link = card.querySelector(".notice-link");
    link.href = notice.url;
    link.setAttribute("aria-label", `View example project for ${notice.title}`);
    return card;
  }));

  emptyState.hidden = matches.length > 0;
  noticeCount.textContent = `${matches.length} sample ${matches.length === 1 ? "notice" : "notices"}`;
}

function renderProjects() {
  const matches = selectedGroup ? projects.filter(project => project.group === selectedGroup) : projects;
  const visible = showAllProjects ? matches : matches.slice(0, projectLimit);
  projectGrid.replaceChildren(...visible.map(project => {
    const card = projectTemplate.content.cloneNode(true);
    card.querySelector(".eyebrow").textContent = project.group;
    card.querySelector(".project-description").textContent = project.description;
    const link = card.querySelector("h3 a");
    link.href = project.url;
    link.textContent = project.name;
    return card;
  }));

  moreProjects.hidden = matches.length <= projectLimit;
  moreProjects.setAttribute("aria-expanded", String(showAllProjects));
  moreProjects.textContent = showAllProjects ? "Show fewer projects" : `Show all ${matches.length} projects`;
  projectCount.textContent = `Showing ${visible.length} of ${matches.length} projects`;
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

addPills(groupFilters, [...new Set(projects.map(project => project.group))], "All projects", group => {
  selectedGroup = group;
  showAllProjects = false;
  renderProjects();
});
moreProjects.addEventListener("click", () => {
  showAllProjects = !showAllProjects;
  renderProjects();
  if (showAllProjects) projectGrid.children[projectLimit].querySelector("a").focus();
});

const credits = document.querySelector("#credits");
document.querySelector(".hero-credit").addEventListener("click", () => {
  credits.open = true;
});

renderNotices();
renderProjects();
