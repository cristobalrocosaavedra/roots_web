(function () {
  "use strict";
  const R = window.ROOTS;
  const I18N = window.ROOTS_I18N;
  const $ = (s, el = document) => el.querySelector(s);
  const clp = (n) => "$" + n.toLocaleString("es-CL");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Idiomas (español, inglés, portugués) ----------
     El español es el texto original de index.html y config.js; las traducciones
     viven en assets/js/i18n.js. Orden para elegir idioma: ?lang= en la URL,
     la elección guardada del visitante, el idioma del navegador y, si no, español. */
  const IDIOMAS = Object.keys(I18N.idiomas);
  const guardado = () => { try { return localStorage.getItem("roots-idioma"); } catch (_) { return null; } };
  const guardar = (l) => { try { localStorage.setItem("roots-idioma", l); } catch (_) {} };
  const delNavegador = () => (navigator.languages || [navigator.language || ""]).map((l) => l.slice(0, 2).toLowerCase()).find((l) => IDIOMAS.includes(l));
  const deUrl = new URLSearchParams(location.search).get("lang");
  let lang = [deUrl, guardado(), delNavegador(), "es"].find((l) => IDIOMAS.includes(l));

  // t("clave"): texto de interfaz en el idioma actual (si falta, en español).
  const t = (k, vars) => {
    let s = (I18N[lang] && I18N[lang].ui[k]) ?? I18N.es.ui[k] ?? k;
    if (vars) for (const v in vars) s = s.replace(`{${v}}`, vars[v]);
    return s;
  };
  // tr("texto en español"): traduce textos de config.js; si no hay traducción, queda en español.
  const tr = (s) => (lang === "es" || !s ? s : (I18N[lang].frases[s] ?? s));

  // Guarda el español original de cada texto marcado con data-i18n para poder volver a él.
  const ATRIBUTOS = ["alt", "aria-label", "placeholder", "title"];
  const original = new Map();
  document.querySelectorAll("[data-i18n]").forEach((el) => original.set(el, { html: el.innerHTML }));
  ATRIBUTOS.forEach((a) =>
    document.querySelectorAll(`[data-i18n-${a}]`).forEach((el) => {
      const o = original.get(el) || {};
      o[a] = el.getAttribute(a);
      original.set(el, o);
    })
  );
  const metaDesc = $('meta[name="description"]');
  I18N.es.ui["meta.title"] = document.title;
  I18N.es.ui["meta.desc"] = metaDesc ? metaDesc.content : "";

  const traducirFijos = () => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.dataset.i18n;
      el.innerHTML = lang === "es" ? original.get(el).html : (I18N[lang].ui[k] ?? original.get(el).html);
    });
    ATRIBUTOS.forEach((a) =>
      document.querySelectorAll(`[data-i18n-${a}]`).forEach((el) => {
        const k = el.getAttribute(`data-i18n-${a}`);
        el.setAttribute(a, lang === "es" ? original.get(el)[a] : (I18N[lang].ui[k] ?? original.get(el)[a]));
      })
    );
    document.documentElement.lang = lang === "es" ? "es-CL" : I18N.idiomas[lang].locale;
    document.title = t("meta.title");
    if (metaDesc) metaDesc.content = t("meta.desc");
    $("#idiomas").setAttribute("aria-label", t("idioma.aria"));
    document.querySelectorAll("#idiomas [data-lang]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  };

  /* ---------- Contacto y redes ---------- */
  const igUrl = `https://www.instagram.com/${R.contacto.instagram}/`;
  const hasWa = /^\d{8,15}$/.test(R.contacto.whatsapp || "");
  const waUrl = (text) => `https://wa.me/${R.contacto.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const waVisible = hasWa ? R.contacto.whatsapp.replace(/^56(9)(\d{4})(\d{4})$/, "+56 $1 $2 $3") : "";

  $("#footer-ig").href = igUrl;
  $("#ig-card").href = igUrl;
  if (hasWa) {
    $("#footer-wa").href = waUrl();
    $("#footer-wa").textContent = "WhatsApp " + waVisible;
  } else {
    $("#footer-wa-li").remove();
    $("#contacto-wa").remove();
  }
  const pintarContacto = () => {
    $("#fab").href = hasWa ? waUrl(t("wa.consulta")) : `https://ig.me/m/${R.contacto.instagram}`;
    if (hasWa) $("#contacto-wa").innerHTML = `${esc(t("contacto.dudas"))} <a href="${waUrl(t("wa.llegar"))}" target="_blank" rel="noopener">WhatsApp ${waVisible}</a>`;
    document.querySelectorAll("[data-bind]").forEach((el) => (el.textContent = tr(R.contacto[el.dataset.bind] || "")));
  };

  /* ---------- Publicaciones de Instagram (embed oficial) ---------- */
  const posts = (R.contacto.instagramPosts || []).filter((u) => /^https:\/\/www\.instagram\.com\/(p|reel)\/[\w-]+\/?/.test(u));
  if (posts.length) {
    const box = $("#ig-posts");
    box.innerHTML = posts
      .map((u) => `<blockquote class="instagram-media" data-instgrm-permalink="${esc(u)}" data-instgrm-version="14"><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t("ig.ver"))}</a></blockquote>`)
      .join("");
    box.hidden = false;
    const sc = document.createElement("script");
    sc.async = true;
    sc.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(sc);
  }
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Mapa ---------- */
  const { lat, lng, googleMaps } = R.contacto.mapa;
  const pintarMapa = () => {
    // Se busca la ficha del local por nombre: con coordenadas + etiqueta, Google no pone el pin en Roots Salinas.
    $("#mapa").src = `https://maps.google.com/maps?q=${encodeURIComponent("Roots Salinas, Pullally, Papudo")}&z=17&hl=${lang}&output=embed`;
  };
  $("#link-mapa").href = googleMaps;
  $("#link-waze").href = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  /* ---------- Horarios y preguntas frecuentes ---------- */
  const pintarInfo = () => {
    $("#horarios").innerHTML = R.horarios.map((h) => `<div><dt>${esc(tr(h.dias))}</dt><dd>${esc(tr(h.horas))}</dd></div>`).join("");
    $("#faq-list").innerHTML = R.faq.map((f) => `<details><summary>${esc(tr(f.p))}</summary><p>${esc(tr(f.r))}</p></details>`).join("");
  };

  /* ---------- Carta ----------
     En computador todas las categorías abiertas; en celular cerradas, como lista desplegable. */
  const esCelular = window.matchMedia("(max-width: 760px)");
  const ajustarCarta = () =>
    document.querySelectorAll(".carta__cat").forEach((d) => {
      d.open = !esCelular.matches;
      d.querySelector("summary").tabIndex = esCelular.matches ? 0 : -1;
    });
  esCelular.addEventListener("change", ajustarCarta);
  const pintarCarta = () => {
    $("#carta-grid").innerHTML = R.carta
      .map(
        (cat) => `<details class="carta__cat">
          <summary>
            <h3>${esc(tr(cat.titulo))}</h3>
            <span class="carta__count">${cat.items.length} ${cat.items.length === 1 ? t("carta.opcion") : t("carta.opciones")}</span>
          </summary>
          <ul>${cat.items
            .map(
              (it) => `<li>
                <span class="carta__name">${esc(tr(it.nombre))}${it.destacado ? ` <em class="carta__fav">${esc(t("carta.favorito"))}</em>` : ""}</span>
                ${R.mostrarPrecios && it.precio ? `<span class="carta__price">${clp(it.precio)}</span>` : ""}
                ${it.detalle ? `<small>${esc(tr(it.detalle))}</small>` : ""}
              </li>`
            )
            .join("")}</ul>
        </details>`
      )
      .join("");
    document.querySelectorAll(".carta__cat").forEach((d) =>
      d.addEventListener("toggle", () => { if (!esCelular.matches && !d.open) d.open = true; })
    );
    ajustarCarta();
  };
  if (!R.mostrarPrecios) $(".carta__download").remove();

  /* ---------- Packs ---------- */
  const ICONOS = {
    mochila: '<path d="M16 22v-4a8 8 0 0 1 16 0v4"/><rect x="10" y="22" width="28" height="22" rx="6"/><path d="M18 32h12M18 44v-6h12v6"/>',
    taza: '<path d="M10 20h24v10a12 12 0 0 1-24 0z"/><path d="M34 22h3a5 5 0 0 1 0 10h-3"/><path d="M8 44h30M18 8c-2 3 2 5 0 8M26 8c-2 3 2 5 0 8"/>',
    corazon: '<path d="M24 40S8 30 8 19a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 11-16 21-16 21z"/><path d="M4 30c4 0 6 3 10 3M44 30c-4 0-6 3-10 3"/>',
    pelota: '<circle cx="24" cy="24" r="16"/><path d="M24 15l7 5-3 8h-8l-3-8z M24 8v7 M31 20l8-3 M28 28l5 7 M20 28l-5 7 M17 20l-8-3"/>',
    torta: '<rect x="9" y="24" width="30" height="16" rx="3"/><path d="M9 31c5 3 10-3 15 0s10 3 15 0"/><path d="M17 24v-6M24 24v-6M31 24v-6M17 14c-1-2 1-3 0-5M24 14c-1-2 1-3 0-5M31 14c-1-2 1-3 0-5M6 44h36"/>',
  };
  const icono = (k) => `<svg viewBox="0 0 48 48" aria-hidden="true">${ICONOS[k] || ICONOS.corazon}</svg>`;
  const selPack = $("#select-pack");
  const pintarPacks = () => {
    $("#packs-grid").innerHTML = R.packs
      .map(
        (p) => `<article class="pack">
          <div class="pack__icon">${icono(p.icono)}</div>
          <h3>${esc(tr(p.nombre))}</h3>
          <p class="pack__for">${esc(tr(p.para))}</p>
          <p class="pack__min">${esc(t("packs.minimo", { n: p.minimo }))}</p>
          <ul>${p.incluye.map((i) => `<li>${esc(tr(i))}</li>`).join("")}</ul>
          <p class="pack__price">${
            R.mostrarValoresBase && p.valorBase ? t("packs.precioDesde", { p: clp(p.valorBase) }) : esc(t("packs.consultar"))
          }</p>
          <a href="#reservar" class="btn btn--ghost btn--sm btn--block" data-pack="${p.id}">${esc(t("packs.cotizarEste"))}</a>
        </article>`
      )
      .join("");
    // Opciones del selector de pack en el formulario (se conserva lo que estaba elegido)
    const elegido = selPack.value;
    [...selPack.options].slice(1).forEach((o) => o.remove());
    R.packs.forEach((p) => selPack.insertAdjacentHTML("beforeend", `<option value="${p.id}">${esc(tr(p.nombre))}</option>`));
    selPack.value = elegido;
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-pack]");
    if (a) selPack.value = a.dataset.pack;
  });

  /* ---------- Carrusel de packs ---------- */
  const track = $("#packs-grid");
  const dotsBox = $("#packs-dots");
  const [btnPrev, btnNext] = document.querySelectorAll(".carrusel__btn");
  const cards = () => [...track.children];
  const paso = () => cards()[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 20);
  const visibles = () => Math.max(1, Math.round(track.clientWidth / paso()));
  const irA = (i) => track.scrollTo({ left: i * paso(), behavior: "smooth" });
  const actualizar = (forzar) => {
    const total = cards().length - visibles() + 1;
    const i = Math.min(total - 1, Math.round(track.scrollLeft / paso()));
    if (forzar === true || dotsBox.children.length !== total) {
      dotsBox.innerHTML = Array.from({ length: total }, (_, n) => `<button type="button" aria-label="${esc(t("carrusel.irA", { n: n + 1 }))}"></button>`).join("");
      [...dotsBox.children].forEach((d, n) => d.addEventListener("click", () => irA(n)));
    }
    [...dotsBox.children].forEach((d, n) => d.setAttribute("aria-current", n === i));
    btnPrev.disabled = track.scrollLeft < 4;
    btnNext.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    $(".carrusel__ctrl").hidden = total < 2;
  };
  btnPrev.addEventListener("click", () => track.scrollBy({ left: -paso(), behavior: "smooth" }));
  btnNext.addEventListener("click", () => track.scrollBy({ left: paso(), behavior: "smooth" }));
  track.addEventListener("scroll", () => requestAnimationFrame(actualizar), { passive: true });
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); btnNext.click(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); btnPrev.click(); }
  });
  window.addEventListener("resize", actualizar);

  /* ---------- Comanda (formulario de reserva) ----------
     El mensaje de WhatsApp sale en el idioma del visitante (con una nota del idioma
     cuando no es español, para que el local sepa en qué idioma responder). */
  const form = $("#form-reserva");
  const msg = $("#form-msg");
  form.fecha.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("is-touched");
      msg.textContent = t("form.faltan");
      form.querySelector(":invalid").focus();
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    const pack = R.packs.find((p) => p.id === d.pack);
    const fecha = new Date(d.fecha + "T12:00").toLocaleDateString(I18N.idiomas[lang].locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const texto = [
      t("msg.hola"),
      `• ${t("msg.organizador")}: ${d.organizador}`,
      `• ${t("msg.tipo")}: ${d.tipo}`,
      `• ${t("msg.pack")}: ${pack ? tr(pack.nombre) : t("msg.noSe")}`,
      `• ${t("msg.personas")}: ${d.personas}`,
      `• ${t("msg.fecha")}: ${fecha}${d.hora ? ` ${t("msg.aLas")} ${d.hora}` : ""}`,
      d.comentarios ? `• ${t("msg.comentarios")}: ${d.comentarios}` : "",
      t("msg.idioma"),
    ].filter(Boolean).join("\n");

    if (hasWa) {
      window.open(waUrl(texto), "_blank", "noopener");
      msg.textContent = t("form.waOk");
    } else {
      try { await navigator.clipboard.writeText(texto); } catch (_) {}
      window.open(`https://ig.me/m/${R.contacto.instagram}`, "_blank", "noopener");
      msg.textContent = t("form.igOk");
    }
  });

  /* ---------- Compartir con el grupo ---------- */
  $("#compartir").addEventListener("click", async () => {
    const url = new URL(location.href.split("#")[0]);
    if (lang === "es") url.searchParams.delete("lang"); else url.searchParams.set("lang", lang);
    const data = { title: "Roots Salinas", text: t("share.texto"), url: url.toString() };
    if (navigator.share) {
      try { await navigator.share(data); } catch (_) {}
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(`${data.text} ${data.url}`), "_blank", "noopener");
    }
  });

  /* ---------- Galería emergente ----------
     Se abren en grande las fotos con personas: clientes (#atencion) y los grupos de fotos
     marcados con data-galeria en index.html (Nuestras raíces, grupos, motoqueros).
     Las fotos de El lugar y de la Carta solo hacen zoom leve y no se abren. */
  const fotosClientes = () =>
    [1, 2, 3, 4, 5, 6].map((n) => ({ src: `assets/img/fotos/clientes-${n}.jpg`, alt: t(`cliente.${n}`) }));
  const galeria = $("#galeria");
  const cajasAbribles = [];
  if (galeria && typeof galeria.showModal === "function") {
    const gImg = $("#galeria-img");
    const gPie = $("#galeria-pie");
    const navs = galeria.querySelectorAll(".galeria__nav");
    let lista = [];
    let actual = 0;
    const mostrar = (i) => {
      actual = (i + lista.length) % lista.length;
      const { src, alt } = lista[actual];
      gImg.src = src;
      gImg.alt = alt;
      gPie.textContent = lista.length > 1 ? `${alt} · ${actual + 1} ${t("galeria.de")} ${lista.length}` : alt;
    };
    const abrir = (fotos, i) => {
      lista = fotos;
      navs.forEach((n) => (n.hidden = fotos.length < 2));
      mostrar(i);
      galeria.showModal();
    };

    // Fotos de clientes (botones con data-foto)
    document.querySelectorAll("#atencion [data-foto]").forEach((b) =>
      b.addEventListener("click", () => abrir(fotosClientes(), Number(b.dataset.foto)))
    );

    // Grupos de fotos con data-galeria: cada foto se puede tocar o abrir con Enter.
    // El texto de cada foto se lee al abrir, así sale en el idioma actual.
    document.querySelectorAll("[data-galeria]").forEach((grupo) => {
      const imgs = [...grupo.querySelectorAll("img")];
      const fotos = () => imgs.map((img) => ({ src: img.getAttribute("src"), alt: img.alt }));
      imgs.forEach((img, i) => {
        const caja = img.parentElement;
        caja.classList.add("foto-abrible");
        caja.tabIndex = 0;
        caja.setAttribute("role", "button");
        cajasAbribles.push(caja);
        caja.addEventListener("click", () => abrir(fotos(), i));
        caja.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(fotos(), i); }
        });
      });
    });

    $(".galeria__cerrar").addEventListener("click", () => galeria.close());
    $(".galeria__nav--prev").addEventListener("click", () => mostrar(actual - 1));
    $(".galeria__nav--next").addEventListener("click", () => mostrar(actual + 1));
    galeria.addEventListener("click", (e) => { if (e.target === galeria || e.target.classList.contains("galeria__fig")) galeria.close(); });
    galeria.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") mostrar(actual - 1);
      if (e.key === "ArrowRight") mostrar(actual + 1);
    });
    let x0 = null;
    galeria.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    galeria.addEventListener("touchend", (e) => {
      if (x0 === null || lista.length < 2) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) mostrar(actual + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }
  const etiquetarFotos = () =>
    cajasAbribles.forEach((caja) => caja.setAttribute("aria-label", `${t("galeria.ampliar")} ${caja.querySelector("img").alt}`));

  /* ---------- Navegación ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 60);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const toggle = $(".nav__toggle");
  const menu = $("#menu-principal");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? t("nav.cerrar") : t("nav.abrir"));
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("no-scroll", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Aplicar idioma ---------- */
  const aplicarIdioma = (nuevo, recordar) => {
    lang = nuevo;
    if (recordar) {
      guardar(lang);
      const url = new URL(location.href);
      if (lang === "es") url.searchParams.delete("lang"); else url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    }
    traducirFijos();
    pintarContacto();
    pintarMapa();
    pintarInfo();
    pintarCarta();
    pintarPacks();
    actualizar(true);
    etiquetarFotos();
    toggle.setAttribute("aria-label", toggle.getAttribute("aria-expanded") === "true" ? t("nav.cerrar") : t("nav.abrir"));
  };
  document.querySelectorAll("#idiomas [data-lang]").forEach((b) =>
    b.addEventListener("click", () => { if (b.dataset.lang !== lang) aplicarIdioma(b.dataset.lang, true); })
  );
  aplicarIdioma(lang, Boolean(deUrl));
})();
