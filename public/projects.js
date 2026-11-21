import { addPills } from "./filters.js";
import { projects } from "./network.js";

const groupFilters = document.querySelector("#project-groups");
const projectGrid = document.querySelector("#project-grid");
const projectTemplate = document.querySelector("#project-template");
const projectCount = document.querySelector("#project-count");
const moreProjects = document.querySelector("#more-projects");

const projectLimit = 6;
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

renderProjects();
