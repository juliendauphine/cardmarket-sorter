// Cardmarket Shopping Wizard Sorter
// Trie les blocs vendeurs par nombre de cartes (Wanted Articles) décroissant

(function () {
  "use strict";

  // ── Utilitaires ─────────────────────────────────────────────────────────────

  /**
   * Extrait le nombre de "Wanted Articles" d'un bloc vendeur.
   * Le label est dans un <dt> qui contient le texte "Wanted Articles".
   * La valeur est dans le <dd> qui suit immédiatement.
   */
  function getWantedArticles(card) {
    const dts = card.querySelectorAll("dl.row dt");
    for (const dt of dts) {
      if (dt.textContent.includes("Wanted Articles")) {
        const dd = dt.nextElementSibling;
        if (dd) {
          const val = parseInt(dd.textContent.trim(), 10);
          return isNaN(val) ? 0 : val;
        }
      }
    }
    return 0;
  }

  // ── Tri ──────────────────────────────────────────────────────────────────────

  /**
   * Cardmarket utilise masonry avec des positions CSS absolues sur chaque col
   * (ex: style="position: absolute; left: 0%; top: 367.9px;").
   * Réordonner les éléments dans le DOM ne suffit pas : il faut redistribuer
   * ces positions selon le nouvel ordre.
   *
   * Stratégie :
   *  1. Lire les positions actuelles dans l'ordre originel (avant tri).
   *  2. Trier les blocs selon le critère voulu.
   *  3. Réattribuer les positions dans l'ordre des blocs triés en respectant
   *     la disposition en 2 colonnes (left 0% / left 50%) et en recalculant
   *     les tops colonne par colonne.
   */
  function sortBlocks(order) {
    const container = document.querySelector("[data-masonry]");
    if (!container) return;

    const cols = Array.from(container.querySelectorAll(":scope > .col-lg-6"));
    if (cols.length === 0) return;

    // Trier les blocs
    const scored = cols.map((col) => ({
      el: col,
      count: getWantedArticles(col),
    }));
    scored.sort((a, b) =>
      order === "asc" ? a.count - b.count : b.count - a.count
    );

    // Redistribuer les positions en 2 colonnes (left 0% et left 50%)
    // On alterne gauche / droite et on cumule la hauteur dans chaque colonne.
    const GAP = 24; // mb-4 ≈ 24px
    let leftTop = 0;
    let rightTop = 0;

    scored.forEach(({ el }, i) => {
      const isLeft = i % 2 === 0;
      const top = isLeft ? leftTop : rightTop;
      const left = isLeft ? "0%" : "50%";

      el.style.position = "absolute";
      el.style.left = left;
      el.style.top = top + "px";

      // Hauteur réelle du bloc pour décaler la prochaine carte dans la même colonne
      const h = el.offsetHeight + GAP;
      if (isLeft) leftTop += h;
      else rightTop += h;
    });

    // Ajuster la hauteur du conteneur
    container.style.height = Math.max(leftTop, rightTop) + "px";

    updateButtonState(order);
  }

  // ── Interface utilisateur ────────────────────────────────────────────────────

  let currentOrder = null; // null | 'desc' | 'asc'

  function updateButtonState(order) {
    currentOrder = order;
    const btn = document.getElementById("cm-sorter-btn");
    if (!btn) return;

    if (order === "desc") {
      btn.textContent = "🔢 Trié : ↓ Cartes";
      btn.title = "Cliquer pour trier par ordre croissant";
      btn.dataset.state = "desc";
    } else {
      btn.textContent = "🔢 Trié : ↑ Cartes";
      btn.title = "Cliquer pour trier par ordre décroissant";
      btn.dataset.state = "asc";
    }
  }

  function injectUI() {
    if (document.getElementById("cm-sorter-btn")) return;

    const btn = document.createElement("button");
    btn.id = "cm-sorter-btn";
    btn.textContent = "🔢 Trier par nbre de cartes";
    btn.title = "Trier les vendeurs par nombre de cartes (décroissant)";
    btn.dataset.state = "none";

    btn.addEventListener("click", () => {
      const nextOrder = btn.dataset.state === "desc" ? "asc" : "desc";
      sortBlocks(nextOrder);
    });

    // Insérer après le titre "Detailed Results" ou avant le conteneur masonry
    const heading = document.querySelector("h3");
    const container = document.querySelector("[data-masonry]");

    if (heading) {
      heading.insertAdjacentElement("afterend", btn);
    } else if (container) {
      container.insertAdjacentElement("beforebegin", btn);
    }

    // Badge résumé : affiche le comptage par vendeur
    injectSummaryBadges();
  }

  /**
   * Ajoute un petit badge coloré dans chaque carte pour rendre
   * le nombre de cartes immédiatement visible.
   */
  function injectSummaryBadges() {
    const container = document.querySelector("[data-masonry]");
    if (!container) return;

    container.querySelectorAll(".detailed-result-card").forEach((card) => {
      if (card.querySelector(".cm-sorter-badge")) return; // déjà fait

      const count = getWantedArticles(card);
      const badge = document.createElement("span");
      badge.className = "cm-sorter-badge";
      badge.textContent = `${count} carte${count > 1 ? "s" : ""}`;

      // Couleur selon le nombre
      if (count >= 10) badge.classList.add("cm-badge-high");
      else if (count >= 4) badge.classList.add("cm-badge-med");
      else badge.classList.add("cm-badge-low");

      // Insérer dans le header de la carte (juste avant le <hr> de séparation)
      const firstHr = card.querySelector("hr");
      if (firstHr) firstHr.insertAdjacentElement("beforebegin", badge);
    });
  }

  // ── Initialisation ───────────────────────────────────────────────────────────

  function init() {
    const container = document.querySelector("[data-masonry]");
    if (!container) {
      // Réessayer si le DOM n'est pas encore prêt (page SPA ou chargement lent)
      setTimeout(init, 500);
      return;
    }

    injectUI();

    // Tri automatique décroissant au chargement
    sortBlocks("desc");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
