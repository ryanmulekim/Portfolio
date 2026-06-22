// =====================================================================
// PORTFÓLIO — INTERAÇÕES
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initScrollProgress();
  initCursor();
  initMobileNav();
  initActiveLink();
  initTypingRole();
  initScrollReveal();
  initContactForm();
  initFooterYear();
  initParticles();
  initCardTilt();
  initCounters();
  initMagnetic();
  initScrambleText();
});

/* ---------------- Loader ---------------- */
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const hide = () => {
    loader.classList.add("hidden");
  };

  if (document.readyState === "complete") {
    setTimeout(hide, 900);
  } else {
    window.addEventListener("load", () => setTimeout(hide, 900));
  }
}

/* ---------------- Scroll progress bar ---------------- */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  const update = () => {
    const scrolled = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = maxScroll > 0 ? (scrolled / maxScroll) * 100 + "%" : "0%";
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------------- Custom cursor (desktop only) ---------------- */
function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const outer = document.querySelector(".cursor-outer");
  const inner = document.querySelector(".cursor-inner");
  if (!outer || !inner) return;

  let mouseX = 0,
    mouseY = 0;
  let outerX = 0,
    outerY = 0;
  let rafId;

  document.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      inner.style.left = mouseX + "px";
      inner.style.top = mouseY + "px";
      outer.classList.add("active");
      inner.classList.add("active");
    },
    { passive: true }
  );

  const animateOuter = () => {
    outerX += (mouseX - outerX) * 0.14;
    outerY += (mouseY - outerY) * 0.14;
    outer.style.left = outerX + "px";
    outer.style.top = outerY + "px";
    rafId = requestAnimationFrame(animateOuter);
  };
  animateOuter();

  const hoverEls = document.querySelectorAll(
    "a, button, .skill-chip, .project-card, .contact-channel, label, input, textarea"
  );
  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      outer.classList.add("hover");
      inner.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      outer.classList.remove("hover");
      inner.classList.remove("hover");
    });
  });

  document.addEventListener("mouseleave", () => {
    outer.classList.remove("active");
    inner.classList.remove("active");
  });
  document.addEventListener("mouseenter", () => {
    outer.classList.add("active");
    inner.classList.add("active");
  });
}

/* ---------------- Hero canvas particles ---------------- */
function initParticles() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animId;
  let mouseX = -9999,
    mouseY = -9999;

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  window.addEventListener("resize", () => {
    resize();
    buildParticles();
  });
  resize();

  const buildParticles = () => {
    const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 14000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.4 + 0.4,
        opacity: Math.random() * 0.45 + 0.08,
        color: Math.random() > 0.3 ? "79,216,196" : "242,169,59",
      });
    }
  };
  buildParticles();

  canvas.parentElement.addEventListener(
    "mousemove",
    (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    },
    { passive: true }
  );

  canvas.parentElement.addEventListener("mouseleave", () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.x += (dx / dist) * force * 1.5;
        p.y += (dy / dist) * force * 1.5;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const alpha = 0.07 * (1 - dist / 110);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(79,216,196,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  };

  draw();
}

/* ---------------- 3D Card tilt ---------------- */
function initCardTilt() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -7;
      const rotY = ((x - cx) / cx) * 7;
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition =
        "transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.25s ease, box-shadow 0.25s ease";
      setTimeout(
        () =>
          (card.style.transition =
            "transform 0.2s ease, border-color 0.25s ease, box-shadow 0.25s ease"),
        500
      );
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.15s ease";
    });
  });
}

/* ---------------- Counter animation ---------------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        const valEl = el.querySelector(".count-val");
        if (!valEl) return;

        const duration = 1600;
        const startTime = performance.now();

        const update = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          valEl.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else valEl.textContent = target;
        };

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* ---------------- Magnetic buttons ---------------- */
function initMagnetic() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  document.querySelectorAll(".btn-primary, .nav-cta").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transition = "transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease";
    });

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.38}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transition =
        "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease";
      btn.style.transform = "";
    });
  });
}

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
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------------- Formulário de contato ---------------- */
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

/* ---------------- Scramble text (Matrix) ---------------- */
function initScrambleText() {
  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  document.querySelectorAll(".scramble-text").forEach((element) => {
    const originalText = element.dataset.text || element.textContent;
    let revealed = false;

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

    randomizeText();

    setInterval(() => {
      if (!revealed) randomizeText();
    }, 120);

    element.addEventListener("mouseenter", () => {
      revealed = true;
      let iteration = 0;

      const reveal = setInterval(() => {
        element.textContent = originalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return originalText[index];
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");

        if (iteration >= originalText.length) {
          clearInterval(reveal);
          element.textContent = originalText;
        }

        iteration += 0.5;
      }, 30);
    });

    element.addEventListener("mouseleave", () => {
      revealed = false;
    });
  });
}
