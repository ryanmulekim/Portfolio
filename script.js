// =====================================================================
// PORTFÓLIO — INTERAÇÕES
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initActiveLink();
  initTypingRole();
  initScrollReveal();
  initContactForm();
  initFooterYear();
});

/* ---------------- Menu mobile ---------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => links.classList.remove("open"));
  });
}

/* ---------------- Link ativo conforme rolagem ---------------- */
function initActiveLink() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------- Efeito de digitação no papel (hero) ---------------- */
function initTypingRole() {
  const el = document.querySelector("[data-typing]");
  if (!el) return;

  const roles = JSON.parse(el.getAttribute("data-roles") || "[]");
  if (!roles.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const textNode = el.querySelector(".typed-text");
  if (prefersReduced) {
    textNode.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      textNode.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
      setTimeout(tick, 55);
    } else {
      charIndex--;
      textNode.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 30);
    }
  }

  tick();
}

/* ---------------- Revelar elementos ao rolar ---------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------------- Formulário de contato (demonstração local) ---------------- */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  const messageInput = form.querySelector("#message");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  // Limpa erros anteriores
  [nameInput, emailInput, messageInput].forEach((field) => {
    field.classList.remove("field-error");
  });

  if (!name) {
    nameInput.classList.add("field-error");
    nameInput.focus();

    status.textContent = "Informe seu nome.";
    status.style.color = "#F2A93B";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    emailInput.classList.add("field-error");
    emailInput.focus();

    status.textContent = "Informe seu e-mail.";
    status.style.color = "#F2A93B";
    return;
  }

  if (!emailPattern.test(email)) {
    emailInput.classList.add("field-error");
    emailInput.focus();

    status.textContent = "Informe um e-mail válido.";
    status.style.color = "#F2A93B";
    return;
  }

  if (!message) {
    messageInput.classList.add("field-error");
    messageInput.focus();

    status.textContent = "Digite sua mensagem.";
    status.style.color = "#F2A93B";
    return;
  }

  status.textContent = `Mensagem pronta para envio, ${name}!`;
  status.style.color = "#4FD8C4";

  form.reset();
});
}

/* ---------------- Ano atual no rodapé ---------------- */
function initFooterYear() {
  const el = document.querySelector("#year");
  if (el) el.textContent = new Date().getFullYear();
}

function initScrambleText() {
  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  document.querySelectorAll(".scramble-text").forEach((element) => {
    const originalText = element.dataset.text;

    let revealed = false;

    // Gera um texto embaralhado
    function randomizeText() {
      if (revealed) return;

      element.textContent = originalText
        .split("")
        .map((char) => {
          if (char === " ") return " ";

          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");
    }

    // Mantém as letras se mexendo
    randomizeText();

    const idleAnimation = setInterval(() => {
      if (!revealed) {
        randomizeText();
      }
    }, 120);

    // Revelação no hover
    element.addEventListener("mouseenter", () => {
      revealed = true;

      let iteration = 0;

      const reveal = setInterval(() => {
        element.textContent = originalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";

            if (index < iteration) {
              return originalText[index];
            }

            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");

        if (iteration >= originalText.length) {
          clearInterval(reveal);
          element.textContent = originalText;
        }

        iteration += 1 / 2;
      }, 30);
    });

    // Volta a embaralhar quando sai o mouse
    element.addEventListener("mouseleave", () => {
      revealed = false;
    });
  });
}
initScrambleText();