document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // INICIALIZACIÓN DE MÓDULOS
  // ==========================================
  initNavigation();
  initContactForm();
  initTypewriter();
  initTerminal();
  initProjectsCarousel(); // <--- 1. Agregado aquí
});

// ==========================================
// 1. MÓDULO: MENÚ HAMBURGUESA
// ==========================================
function initNavigation() {
  const toggleButton = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const menuLinks = document.querySelectorAll(".nav__link");

  if (!toggleButton || !navMenu) return;

  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    toggleButton.setAttribute("aria-expanded", "false");
  };

  toggleButton.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    toggleButton.setAttribute("aria-expanded", isOpen);
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("is-open")) {
        closeMenu();
      }
    });
  });
}

// ==========================================
// 2. MÓDULO: FORMULARIO DE CONTACTO
// ==========================================
function initContactForm() {
  const form = document.getElementById("form");
  const gracias = document.getElementById("gracias");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (gracias) gracias.style.display = "block";
    form.style.display = "none";
    form.submit();
  });
}

// ==========================================
// 3. MÓDULO: EFECTO TYPEWRITER (NOMBRE)
// ==========================================
function initTypewriter() {
  const el = document.getElementById("typewriter");
  const cursor = document.querySelector(".cursor");
  if (!el) return;

  const nameText = "AGUILERA SEBASTIÁN";
  const speed = 180;
  let index = 0;

  function type() {
    if (index < nameText.length) {
      el.textContent += nameText.charAt(index);
      index++;
      setTimeout(type, speed);
    } else if (cursor) {
      cursor.style.display = "none";
    }
  }

  type();
}

// ==========================================
// 4. MÓDULO: TERMINAL INTERACTIVA
// ==========================================
function initTerminal() {
  const terminalBody = document.getElementById("terminal__body");
  const inputHidden = document.getElementById("terminal__input");
  const currentText = document.getElementById("prompt__text");
  const historyContainer = document.getElementById("terminal__history");
  const terminalElement = document.getElementById("terminal");

  if (!terminalBody || !inputHidden || !currentText || !historyContainer)
    return;

  const commandHistory = [];
  let historyIndex = -1;

  const commands = {
    help: () => `Comandos disponibles:<br>
      - <span class="highlight">about</span>: Información sobre mí<br>
      - <span class="highlight">skills</span>: Tecnologías y herramientas<br>
      - <span class="highlight">contact</span>: Enlaces de contacto<br>
      - <span class="highlight">clear</span>: Limpiar la pantalla<br>`,

    about: () => `Hello, I'm <strong>AGUILERA SEBASTIÁN</strong><br>
      Estudiante de Ingeniería en Sistemas (4º año).<br>
      Apasionado por el desarrollo backend, arquitecturas distribuidas e integración de servicios.`,

    skills:
      () => `<strong>Backend & Lenguajes:</strong> Python (Flask, FastAPI), JavaScript<br>
      <strong>Bases de Datos & Caches:</strong> PostgreSQL, Redis<br>
      <strong>DevOps & Infra:</strong> Docker, Traefik, Git/GitHub<br>
      <strong>Tools:</strong> Postman, Linux / Bash`,

    contact: () => `Email: tu-email@ejemplo.com<br>
      GitHub: <a href="https://github.com/tu-usuario" target="_blank">github.com/tu-usuario</a><br>
      LinkedIn: <a href="https://linkedin.com/in/tu-usuario" target="_blank">linkedin.com/in/tu-usuario</a>`,

    clear: () => {
      historyContainer.innerHTML = "";
      return null;
    },
  };

  inputHidden.focus();

  if (terminalElement) {
    terminalElement.addEventListener("click", () => {
      inputHidden.focus();
    });
  }

  inputHidden.addEventListener("input", (e) => {
    currentText.textContent = e.target.value;
    scrollToBottom();
  });

  inputHidden.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      historyContainer.innerHTML = "";
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const inputVal = inputHidden.value.trim().toLowerCase();
      if (!inputVal) return;

      const availableCommands = Object.keys(commands);
      const matches = availableCommands.filter((cmd) =>
        cmd.startsWith(inputVal),
      );

      if (matches.length === 1) {
        inputHidden.value = matches[0];
        currentText.textContent = matches[0];
      } else if (matches.length > 1) {
        printExecutedCommand(inputVal);
        printOutput(matches.join("&nbsp;&nbsp;&nbsp;&nbsp;"));
        scrollToBottom();
      }
      return;
    }

    if (e.key === "Enter") {
      const rawCommand = inputHidden.value.trim();
      const command = rawCommand.toLowerCase();

      if (rawCommand !== "") {
        commandHistory.push(rawCommand);
        historyIndex = commandHistory.length;
      }

      printExecutedCommand(rawCommand);

      if (command !== "") {
        if (commands[command]) {
          const output = commands[command]();
          if (output) printOutput(output);
        } else {
          printOutput(
            `Comando no encontrado: <span style="color:#ef2929">${escapeHTML(rawCommand)}</span>. Escribe <span class="highlight">help</span> para ver la lista.`,
          );
        }
      }

      inputHidden.value = "";
      currentText.textContent = "";
      scrollToBottom();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        inputHidden.value = commandHistory[historyIndex];
        currentText.textContent = commandHistory[historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        inputHidden.value = commandHistory[historyIndex];
        currentText.textContent = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        inputHidden.value = "";
        currentText.textContent = "";
      }
    }
  });

  function printExecutedCommand(cmd) {
    const line = document.createElement("div");
    line.className = "terminal__prompt";
    line.innerHTML = `
      <span class="prompt__user">sebastian@ubuntu</span><span class="prompt__symbol">:</span><span class="prompt__path">~</span><span class="prompt__symbol">$</span>
      <span class="prompt__command">${escapeHTML(cmd)}</span>
    `;
    historyContainer.appendChild(line);
  }

  function printOutput(htmlContent) {
    const outputDiv = document.createElement("div");
    outputDiv.className = "terminal__output";
    outputDiv.innerHTML = htmlContent;
    historyContainer.appendChild(outputDiv);
  }

  function scrollToBottom() {
    terminalBody.scrollTo({
      top: terminalBody.scrollHeight,
      behavior: "instant",
    });
  }

  function escapeHTML(str) {
    return str.replace(
      /[&<>"']/g,
      (match) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[match],
    );
  }
}

// ==========================================
// 5. MÓDULO: CARRUSEL DE PROYECTOS
// ==========================================
function initProjectsCarousel() {
  const track = document.querySelector(".proyectos-track");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (!track || !prevBtn || !nextBtn) return;

  const originalCards = Array.from(track.children);
  if (originalCards.length === 0) return;

  // Clonar elementos para loop infinito suave
  const firstClone1 = originalCards[0].cloneNode(true);
  const firstClone2 = originalCards[1].cloneNode(true);
  const lastClone1 = originalCards[originalCards.length - 2].cloneNode(true);
  const lastClone2 = originalCards[originalCards.length - 1].cloneNode(true);

  track.appendChild(firstClone1);
  track.appendChild(firstClone2);
  track.insertBefore(lastClone2, originalCards[0]);
  track.insertBefore(lastClone1, track.firstElementChild);

  const allCards = Array.from(track.children);
  let currentIndex = 1; // Posición inicial para que P1 esté en el centro
  let isAnimating = false;

  const getCardWidthAndGap = () => {
    const cardWidth = allCards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    return { cardWidth, gap };
  };

  const updateActiveCard = (index) => {
    allCards.forEach((card) => card.classList.remove("is-active"));
    const visibleCards = window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    const activeIndex = visibleCards === 3 ? index + 1 : index + 2;
    if (allCards[activeIndex]) {
      allCards[activeIndex].classList.add("is-active");
    }
  };

  const setPosition = (index, animate = true) => {
    const { cardWidth, gap } = getCardWidthAndGap();
    if (animate) {
      track.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    } else {
      track.style.transition = "none";
    }
    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
  };

  setPosition(currentIndex, false);
  updateActiveCard(currentIndex);

  const nextSlide = () => {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex++;
    setPosition(currentIndex, true);
    updateActiveCard(currentIndex);

    setTimeout(() => {
      if (currentIndex >= allCards.length - 3) {
        currentIndex = 1;
        setPosition(currentIndex, false);
        updateActiveCard(currentIndex);
      }
      isAnimating = false;
    }, 400);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex--;
    setPosition(currentIndex, true);
    updateActiveCard(currentIndex);

    setTimeout(() => {
      if (currentIndex <= 1) {
        currentIndex = allCards.length - 4;
        setPosition(currentIndex, false);
        updateActiveCard(currentIndex);
      }
      isAnimating = false;
    }, 400);
  };

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  window.addEventListener("resize", () => {
    setPosition(currentIndex, false);
  });
}