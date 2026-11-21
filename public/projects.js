import { addPills } from "./filters.js";
import { projects } from "./network.js";

const groupFilters = document.querySelector("#project-groups");
const projectGrid = document.querySelector("#project-grid");
const projectTemplate = document.querySelector("#project-template");
const projectCount = document.querySelector("#project-count");
const moreProjects = document.querySelector("#more-projects");

const projectLimit = 6;
const areaIcons = {
  "Island life": "map",
  "Media & opportunity": "camera",
  "Civic & digital": "review",
};
const areaCounts = new Map();
for (const { group } of projects) {
  areaCounts.set(group, (areaCounts.get(group) ?? 0) + 1);
}
let selectedGroup = "";
let showAllProjects = false;

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

addPills(groupFilters, areaCounts.keys(), "All projects", group => {
  selectedGroup = group;
  showAllProjects = false;
  renderProjects();
});
for (const button of groupFilters.querySelectorAll("button")) {
  const group = button.dataset.value;
  const label = document.createElement("strong");
  label.textContent = button.textContent;
  const icon = document.createElement("img");
  icon.src = `./assets/icons/${areaIcons[group] ?? "notice"}.webp`;
  icon.alt = "";
  icon.width = 56;
  icon.height = 56;
  const count = document.createElement("span");
  count.textContent = `${group ? areaCounts.get(group) : projects.length} references`;
  button.replaceChildren(icon, label, count);
}
moreProjects.addEventListener("click", () => {
  showAllProjects = !showAllProjects;
  renderProjects();
  if (showAllProjects) projectGrid.children[projectLimit].querySelector("a").focus();
});

renderProjects();
