const dialog = document.getElementById("dialog");
const closeDialogButton = document.getElementById("close-dialog");
const addProjectCard = document.getElementById("open-dialog");
const okDialogButton = document.getElementById("ok-dialog");
const form = document.getElementById("add-project-form");

const PROJECT_STORE_KEY = "project-store-key";

let store = {
  meta: {},
  projects: [],
};
const generateId = () => {
  const timestamp = Date.now().toString(16);
  const random = Math.random().toString(16).substring(2, 8);
  return timestamp + random;
};

const saveProject = (projectData) => {
  store.projects.push(projectData);
  localStorage.setItem(PROJECT_STORE_KEY, JSON.stringify(store));
};

// Функция для рендеринга всех проектов
const renderProjects = () => {
  // Очищаем контейнер перед рендерингом
  const projectsContainer = document.querySelector(".projects-container");
  projectsContainer.innerHTML = "";

  // Получаем все проекты из хранилища
  const projects = store.projects;

  // Если проектов нет - выводим сообщение
  if (projects.length === 0) {
    projectsContainer.innerHTML = '<p class="no-projects">Нет проектов</p>';
    return;
  }

  // Создаем HTML для каждого проекта
  projects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("page__page-card");

    card.innerHTML = `
      <div class="card">
        <div class="card__header">
          <div>
            <h1 class="card__header-title">${project.title}</h1>
            <h2 class="card__header-subtitle">
              ${project.description}
            </h2>
          </div>
          <div class="card__header-actions">
            <button 
              class="button button_size_md button_secondary button_hoverable button_rounded_md"
              data-id="${project.id}"
              onclick="editProject(this)"
            >
              <svg class="icon icon_size_md" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4"/>
              </svg>
            </button>
            <button 
              class="button button_size_md button_danger button_hoverable button_rounded_md"
              data-id="${project.id}"
              onclick="deleteProject(this)"
            >
              <svg class="icon icon_size_md" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="card__body">
          <div>
            <strong>Срочность:</strong> ${getUrgencyLabel(project.urgency)}<br>
            <strong>Сложность:</strong> ${getComplexityLabel(
              project.complexity
            )}<br>
            <strong>Дедлайн:</strong> ${new Date(
              project.deadline
            ).toLocaleString()}
          </div>
        </div>
        <div class="card__footer">
          <div class="card__footer-actions">
            <button 
              class="button button_size_md button_secondary button_hoverable button_rounded_md"
              onclick="openTasks(event, '${project.id}')"
            >
              Открыть задачи
            </button>
          </div>
        </div>
      </div>
    `;

    projectsContainer.appendChild(card);
  });
};

// Вспомогательные функции для отображения статусов
function getUrgencyLabel(value) {
  switch (value) {
    case "low":
      return "Низкая";
    case "medium":
      return "Средняя";
    case "high":
      return "Высокая";
    default:
      return "Не указано";
  }
}

function getComplexityLabel(value) {
  switch (value) {
    case "easy":
      return "Простая";
    case "medium":
      return "Средняя";
    case "hard":
      return "Сложная";
    default:
      return "Не указано";
  }
}

window.addEventListener("load", () => {
  try {
    const savedData = localStorage.getItem(PROJECT_STORE_KEY);
    if (savedData) {
      store = JSON.parse(savedData);
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titleInput = document.getElementById("title-input");
  const descriptionInput = document.getElementById("description-input");
  const urgencyInput = document.getElementById("urgency-select");
  const complexityInput = document.getElementById("complexity-select");
  const deadlineInput = document.getElementById("deadline-input");

  if (!form.checkValidity()) {
    event.stopPropagation();
    return;
  }

  const data = {
    id: generateId(),
    title: titleInput.value,
    description: descriptionInput.value,
    urgency: urgencyInput.value,
    complexity: complexityInput.value,
    deadline: deadlineInput.value,
    tasks: [],
  };

  saveProject(data);

  dialog.close();
});

dialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    dialog.close();
  }
});
const openDialog = () => {
  dialog.showModal();
};

const closeDialog = () => {
  dialog.close();
  form.reset();
};

closeDialogButton.addEventListener("click", () => {
  closeDialog();
});
// okDialogButton.addEventListener("click", () => {
//   console.log("OK");
//   closeDialog();
// });

addProjectCard.addEventListener("click", () => {
  console.log("CLICK");
  openDialog();
});
