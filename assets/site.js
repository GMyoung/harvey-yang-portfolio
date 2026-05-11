const body = document.body;
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
const requestCard = document.querySelector(".request-card");
const tabs = document.querySelectorAll(".request-card .tab");
const cardCta = document.querySelector("[data-card-cta]");

const requestModes = {
  build: {
    rows: {
      primary: ["Workflow", "AI agent infrastructure"],
      secondary: ["Data source", "Email, calendar, documents, CRM"],
      tertiary: ["Output", "Approval-gated automation"],
    },
    cta: "Discuss a workflow",
  },
  analyze: {
    rows: {
      primary: ["Business question", "Operational analytics dashboard"],
      secondary: ["Inputs", "SQL data, spreadsheets, user feedback"],
      tertiary: ["Decision", "Clear metrics and next actions"],
    },
    cta: "Plan an analysis",
  },
};

requestAnimationFrame(() => {
  body.classList.add("is-ready");
});

menuButton?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

function setRequestMode(mode) {
  const nextMode = requestModes[mode] ? mode : "build";
  const config = requestModes[nextMode];

  tabs.forEach((tab) => {
    const isActive = tab.dataset.mode === nextMode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  requestCard?.querySelectorAll("[data-row-label]").forEach((label) => {
    const key = label.dataset.rowLabel;
    if (key && config.rows[key]) {
      label.textContent = config.rows[key][0];
    }
  });

  requestCard?.querySelectorAll("[data-row-value]").forEach((value) => {
    const key = value.dataset.rowValue;
    if (key && config.rows[key]) {
      value.textContent = config.rows[key][1];
    }
  });

  if (cardCta) {
    cardCta.textContent = config.cta;
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setRequestMode(tab.dataset.mode);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && body.classList.contains("menu-open")) {
    body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});
