// Year
const yEl = document.getElementById("y");
if (yEl) yEl.textContent = new Date().getFullYear();

// Burger menu
const burgerBtn = document.getElementById("burgerBtn");
const navMenu = document.getElementById("navMenu");
if (burgerBtn && navMenu) {
  burgerBtn.addEventListener("click", () => navMenu.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !burgerBtn.contains(e.target)) navMenu.classList.remove("open");
  });
}

// SVG icons (vrais logos)
function iconInstagram() {
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Z" stroke="currentColor" stroke-width="2"/>
  <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="2"/>
  <path d="M17.5 6.5h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}
function iconFacebook() {
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M14 8h2V6h-2c-2.2 0-4 1.8-4 4v2H8v2h2v6h2v-6h2l1-2h-3v-2c0-1.1.9-2 2-2Z" fill="currentColor"/>
  </svg>`;
}
function iconTikTok() {
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M14 3v10.2a3.8 3.8 0 1 1-3-3.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M14 3c.7 2.6 2.3 4.2 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

// Load site.json
fetch("content/site.json")
  .then(r => r.json())
  .then(site => {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el && val) el.textContent = val;
    };

    setText("siteName", site.name);
    setText("footerName", site.name);
    setText("siteTagline", site.tagline);
    setText("heroTitle", site.heroTitle);
    const heroText = document.getElementById("heroText");
    if (heroText && site.heroText) heroText.innerHTML = site.heroText;

    // Social links
    const socialRow = document.getElementById("socialRow");
    if (socialRow) {
      const items = [
        { key: "instagram", label: "Instagram", icon: iconInstagram() },
        { key: "tiktok", label: "TikTok", icon: iconTikTok() },
        { key: "facebook", label: "Facebook", icon: iconFacebook() }
      ];
      socialRow.innerHTML = items
        .filter(x => site.social && site.social[x.key])
        .map(x => `<a class="socialBtn" href="${site.social[x.key]}" target="_blank" rel="noopener">${x.icon}<span>${x.label}</span></a>`)
        .join("") || `<p class="empty">Réseaux à ajouter dans content/site.json</p>`;
    }

    // Media (about page)
    const mediaGrid = document.getElementById("mediaGrid");
    const emptyMedia = document.getElementById("empty-media");
    if (mediaGrid) {
      const media = (site.media || []);
      if (!media.length) {
        if (emptyMedia) emptyMedia.style.display = "block";
      } else {
        mediaGrid.innerHTML = media.map(m => `
          <div class="mediaCard">
            <a href="${m.url}" target="_blank" rel="noopener">
              <div>${m.title}</div>
              <span>Voir</span>
            </a>
          </div>
        `).join("");
      }
    }
  })
  .catch(() => { /* ignore */ });

// Load partners.json
fetch("content/partners.json")
  .then(r => r.json())
  .then(list => {
    const row = document.getElementById("partnersRow");
    if (!row) return;
    if (!Array.isArray(list) || list.length === 0) {
      row.innerHTML = `<p class="empty">Partenaires à ajouter dans content/partners.json</p>`;
      return;
    }
    row.innerHTML = list.map(p => `
      <span class="partnerBadge" title="${p.name}">
        ${p.logo ? `<img src="${p.logo}" alt="${p.name}"/>` : ``}
        ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.name}</a>` : `<span>${p.name}</span>`}
      </span>
    `).join("");
  })
  .catch(() => { /* ignore */ });

// Realisations page - tabs + gallery.json
const filters = document.getElementById("filters");
if (filters) {
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".chipBtn");
    if (!btn) return;
    document.querySelectorAll(".chipBtn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;
    document.getElementById("tab-interieur").style.display = tab === "interieur" ? "" : "none";
    document.getElementById("tab-exterieur").style.display = tab === "exterieur" ? "" : "none";
    document.getElementById("tab-avantapres").style.display = tab === "avantapres" ? "" : "none";
  });

  fetch("content/gallery.json")
    .then(res => res.json())
    .then(data => {
      function renderGallery(containerId, emptyId, images) {
        const container = document.getElementById(containerId);
        const empty = document.getElementById(emptyId);
        if (!container) return;

        const safe = Array.isArray(images) ? images.filter(Boolean) : [];
        if (safe.length === 0) {
          if (empty) empty.style.display = "block";
          container.innerHTML = "";
          return;
        }
        if (empty) empty.style.display = "none";
        container.innerHTML = safe.map(src => `
          <div class="photo" data-src="${src}">
            <img src="${src}" loading="lazy" alt="Photo réalisation">
          </div>
        `).join("");
      }

      function renderBeforeAfter(pairs) {
        const container = document.getElementById("galerie-avantapres");
        const empty = document.getElementById("empty-avantapres");
        const safe = Array.isArray(pairs) ? pairs.filter(p => p && p.avant && p.apres) : [];
        if (!container) return;

        if (safe.length === 0) {
          if (empty) empty.style.display = "block";
          container.innerHTML = "";
          return;
        }
        if (empty) empty.style.display = "none";

        container.innerHTML = safe.map(pair => `
          <div class="ba-card">
            <div class="photo" data-src="${pair.avant}">
              <img src="${pair.avant}" loading="lazy" alt="Avant">
              <span>Avant</span>
            </div>
            <div class="photo" data-src="${pair.apres}">
              <img src="${pair.apres}" loading="lazy" alt="Après">
              <span>Après</span>
            </div>
          </div>
        `).join("");
      }

      renderGallery("galerie-interieur", "empty-interieur", data.interieur);
      renderGallery("galerie-exterieur", "empty-exterieur", data.exterieur);
      renderBeforeAfter(data.avant_apres);

      // Modal
      const modal = document.getElementById("imgModal");
      const modalImg = document.getElementById("modalImg");
      const close = document.getElementById("closeModal");

      if (modal && modalImg) {
        document.body.addEventListener("click", (e) => {
          const card = e.target.closest(".photo");
          if (!card || !card.dataset.src) return;
          modalImg.src = card.dataset.src;
          modal.classList.add("open");
        });
        if (close) close.addEventListener("click", () => modal.classList.remove("open"));
        modal.addEventListener("click", (e) => {
          if (e.target === modal) modal.classList.remove("open");
        });
      }
    })
    .catch(() => { /* ignore */ });
}

// Formspree UX (contact page)
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");
if (contactForm && formMsg) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formMsg.textContent = "Envoi en cours…";
    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        formMsg.textContent = "✅ Message envoyé. Nous revenons vers vous rapidement.";
        contactForm.reset();
      } else {
        formMsg.textContent = "❌ Erreur d’envoi. Essayez WhatsApp.";
      }
    } catch {
      formMsg.textContent = "❌ Connexion impossible. Essayez WhatsApp.";
    }
  });
                             }
