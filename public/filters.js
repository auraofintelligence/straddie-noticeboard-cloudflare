export function addPills(container, values, allLabel, select) {
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

export function setActivePill(container, value) {
  for (const button of container.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.value === value));
  }
}
