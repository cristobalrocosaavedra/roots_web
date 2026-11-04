(function () {
  "use strict";
  const R = window.ROOTS;
  const $ = (s, el = document) => el.querySelector(s);
  const clp = (n) => "$" + n.toLocaleString("es-CL");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Contacto y redes ---------- */
  const igUrl = `https://www.instagram.com/${R.contacto.instagram}/`;
  const hasWa = /^\d{8,15}$/.test(R.contacto.whatsapp || "");
  const waUrl = (text) => `https://wa.me/${R.contacto.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;
  const chatUrl = hasWa ? waUrl("¡Hola Roots Salinas! Quiero hacer una consulta") : `https://ig.me/m/${R.contacto.instagram}`;

  $("#footer-ig").href = igUrl;
  $("#ig-card").href = igUrl;
  const waVisible = hasWa ? R.contacto.whatsapp.replace(/^56(9)(\d{4})(\d{4})$/, "+56 $1 $2 $3") : "";
  if (hasWa) {
    $("#footer-wa").href = waUrl();
    $("#footer-wa").textContent = "WhatsApp " + waVisible;
    $("#contacto-wa").innerHTML = `¿Dudas para llegar? Escríbenos al <a href="${waUrl("¡Hola Roots Salinas! Tengo una consulta para llegar")}" target="_blank" rel="noopener">WhatsApp ${waVisible}</a>`;
  } else {
    $("#footer-wa-li").remove();
    $("#contacto-wa").remove();
  }

  /* ---------- Publicaciones de Instagram (embed oficial) ---------- */
  const posts = (R.contacto.instagramPosts || []).filter((u) => /^https:\/\/www\.instagram\.com\/(p|reel)\/[\w-]+\/?/.test(u));
  if (posts.length) {
    const box = $("#ig-posts");
    box.innerHTML = posts
      .map((u) => `<blockquote class="instagram-media" data-instgrm-permalink="${esc(u)}" data-instgrm-version="14"><a href="${esc(u)}" target="_blank" rel="noopener">Ver en Instagram</a></blockquote>`)
      .join("");
    box.hidden = false;
    const sc = document.createElement("script");
    sc.async = true;
    sc.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(sc);
  }
  $("#fab").href = chatUrl;
  $("#year").textContent = new Date().getFullYear();

  document.querySelectorAll("[data-bind]").forEach((el) => (el.textContent = R.contacto[el.dataset.bind] || ""));

  /* ---------- Mapa ---------- */
  const { lat, lng, googleMaps } = R.contacto.mapa;
  $("#mapa").src = `https://maps.google.com/maps?q=${lat},${lng}+(Roots+Salinas)&z=16&hl=es&output=embed`;
  $("#link-mapa").href = googleMaps;
  $("#link-waze").href = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  /* ---------- Horarios y preguntas frecuentes ---------- */
  $("#horarios").innerHTML = R.horarios.map((h) => `<div><dt>${esc(h.dias)}</dt><dd>${esc(h.horas)}</dd></div>`).join("");
  $("#faq-list").innerHTML = R.faq.map((f) => `<details><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`).join("");

  /* ---------- Carta ---------- */
  $("#carta-grid").innerHTML = R.carta
    .map(
      (cat) => `<section class="carta__cat">
        <h3>${esc(cat.titulo)}</h3>
        <ul>${cat.items
          .map(
            (it) => `<li>
              <span class="carta__name">${esc(it.nombre)}${it.destacado ? ' <em class="carta__fav">favorito</em>' : ""}</span>
              ${R.mostrarPrecios && it.precio ? `<span class="carta__price">${clp(it.precio)}</span>` : ""}
              ${it.detalle ? `<small>${esc(it.detalle)}</small>` : ""}
            </li>`
          )
          .join("")}</ul>
      </section>`
    )
    .join("");
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
  $("#packs-grid").innerHTML = R.packs
    .map(
      (p) => `<article class="pack">
        <div class="pack__icon">${icono(p.icono)}</div>
        <h3>${esc(p.nombre)}</h3>
        <p class="pack__for">${esc(p.para)}</p>
        <p class="pack__min">Desde ${p.minimo} personas</p>
        <ul>${p.incluye.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        <p class="pack__price">${
          R.mostrarValoresBase && p.valorBase
            ? `Desde <strong>${clp(p.valorBase)}</strong> por persona`
            : "Precio a consultar"
        }</p>
        <a href="#reservar" class="btn btn--ghost btn--sm btn--block" data-pack="${p.id}">Cotizar este pack</a>
      </article>`
    )
    .join("");
  const selPack = $("#select-pack");
  R.packs.forEach((p) => selPack.insertAdjacentHTML("beforeend", `<option value="${p.id}">${esc(p.nombre)}</option>`));
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-pack]");
    if (a) selPack.value = a.dataset.pack;
  });

  /* ---------- Comanda (formulario de reserva) ---------- */
  const form = $("#form-reserva");
  const msg = $("#form-msg");
  form.fecha.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("is-touched");
      msg.textContent = "Faltan datos: completa organizador, tipo de grupo, personas y fecha.";
      form.querySelector(":invalid").focus();
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    const pack = R.packs.find((p) => p.id === d.pack);
    const fecha = new Date(d.fecha + "T12:00").toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const texto = [
      "¡Hola Roots Salinas! Quiero cotizar una visita grupal:",
      `• Organizador: ${d.organizador}`,
      `• Tipo de grupo: ${d.tipo}`,
      `• Pack: ${pack ? pack.nombre : "Todavía no sé"}`,
      `• Personas: ${d.personas}`,
      `• Fecha: ${fecha}${d.hora ? " a las " + d.hora : ""}`,
      d.comentarios ? `• Comentarios: ${d.comentarios}` : "",
    ].filter(Boolean).join("\n");

    if (hasWa) {
      window.open(waUrl(texto), "_blank", "noopener");
      msg.textContent = "Se abrió WhatsApp con tu solicitud. Solo falta presionar enviar.";
    } else {
      try { await navigator.clipboard.writeText(texto); } catch (_) {}
      window.open(`https://ig.me/m/${R.contacto.instagram}`, "_blank", "noopener");
      msg.textContent = "Copiamos tu solicitud. Pégala en el chat de Instagram que se abrió y envíala.";
    }
  });

  /* ---------- Compartir con el grupo ---------- */
  $("#compartir").addEventListener("click", async () => {
    const data = { title: "Roots Salinas", text: "Mira este lugar para nuestra salida de grupo en Playa Las Salinas:", url: location.href.split("#")[0] };
    if (navigator.share) {
      try { await navigator.share(data); } catch (_) {}
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(`${data.text} ${data.url}`), "_blank", "noopener");
    }
  });

  /* ---------- Galería emergente de clientes ---------- */
  const fotosClientes = [
    ["clientes-1.jpg", "Terraza llena: familias y amigos compartiendo bajo la malla de sombra"],
    ["clientes-2.jpg", "Un día de temporada en la terraza de Roots Salinas"],
    ["clientes-3.jpg", "Clientes disfrutando churrascos y jugos naturales"],
    ["clientes-4.jpg", "Una familia que vuelve: ¡todos con el pulgar arriba!"],
    ["clientes-5.jpg", "Almuerzo con vista al humedal de Pullally"],
    ["clientes-6.jpg", "Familia, amigos y mascotas frente a la playa"],
  ];
  const galeria = $("#galeria");
  if (galeria && typeof galeria.showModal === "function") {
    const gImg = $("#galeria-img");
    const gPie = $("#galeria-pie");
    let actual = 0;
    const mostrar = (i) => {
      actual = (i + fotosClientes.length) % fotosClientes.length;
      const [archivo, texto] = fotosClientes[actual];
      gImg.src = "assets/img/fotos/" + archivo;
      gImg.alt = texto;
      gPie.textContent = `${texto} · ${actual + 1} de ${fotosClientes.length}`;
    };
    document.querySelectorAll("#atencion [data-foto]").forEach((b) =>
      b.addEventListener("click", () => { mostrar(Number(b.dataset.foto)); galeria.showModal(); })
    );
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
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) mostrar(actual + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------- Navegación ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 60);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const toggle = $(".nav__toggle");
  const menu = $("#menu-principal");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("no-scroll", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
})();
