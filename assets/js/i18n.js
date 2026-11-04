/* =========================================================================
   ROOTS SALINAS · IDIOMAS
   -------------------------------------------------------------------------
   - El ESPAÑOL es el texto original: vive en index.html y config.js.
   - Cada traducción está en assets/js/idiomas/<código>.js, con:
     "ui":     textos de la página, por clave (la misma clave que el atributo
               data-i18n="..." en index.html).
     "frases": traducción de los textos de config.js (carta, packs, horarios,
               preguntas). La llave es el texto EXACTO en español. Si cambias
               un texto en config.js, cambia también su llave en cada idioma;
               si falta, ese texto se muestra en español.
   ========================================================================= */

window.ROOTS_I18N = {
  // Idiomas disponibles, en el orden del menú. Cada uno (salvo el español) tiene su
  // archivo en assets/js/idiomas/ y su <script> en index.html.
  // "mapa": código de idioma para el mapa de Google.
  idiomas: {
    es: { corto: "ES", nombre: "Español", locale: "es-CL", mapa: "es" },
    en: { corto: "EN", nombre: "English", locale: "en-US", mapa: "en" },
    pt: { corto: "PT", nombre: "Português", locale: "pt-BR", mapa: "pt-BR" },
    it: { corto: "IT", nombre: "Italiano", locale: "it-IT", mapa: "it" },
    fr: { corto: "FR", nombre: "Français", locale: "fr-FR", mapa: "fr" },
    de: { corto: "DE", nombre: "Deutsch", locale: "de-DE", mapa: "de" },
    zh: { corto: "中文", nombre: "中文（简体）", locale: "zh-CN", mapa: "zh-CN" },
  },

  /* Textos que arma main.js (el resto del español está en index.html) */
  es: {
    ui: {
      "meta.title": "Roots Salinas | Comida rica frente al mar en Playa Las Salinas de Pullally, Papudo",
      "meta.desc": "Roots Salinas: churrascos, completos, empanadas, churros y helados en Playa Las Salinas de Pullally, Papudo, junto al Santuario de la Naturaleza. Packs para colegios, clubes de adulto mayor, centros de madres y clubes deportivos.",
      "idioma.aria": "Idioma",
      "nav.abrir": "Abrir menú",
      "nav.cerrar": "Cerrar menú",
      "carta.opcion": "opción",
      "carta.opciones": "opciones",
      "carta.favorito": "favorito",
      "packs.minimo": "Desde {n} personas",
      "packs.precioDesde": "Desde <strong>{p}</strong> por persona",
      "packs.consultar": "Precio a consultar",
      "packs.cotizarEste": "Cotizar este pack",
      "carrusel.irA": "Ir al pack {n}",
      "contacto.dudas": "¿Dudas para llegar? Escríbenos al",
      "wa.consulta": "¡Hola Roots Salinas! Quiero hacer una consulta",
      "wa.llegar": "¡Hola Roots Salinas! Tengo una consulta para llegar",
      "form.faltan": "Faltan datos: completa organizador, tipo de grupo, personas y fecha.",
      "form.waOk": "Se abrió WhatsApp con tu solicitud. Solo falta presionar enviar.",
      "form.igOk": "Copiamos tu solicitud. Pégala en el chat de Instagram que se abrió y envíala.",
      "msg.hola": "¡Hola Roots Salinas! Quiero cotizar una visita grupal:",
      "msg.organizador": "Organizador",
      "msg.tipo": "Tipo de grupo",
      "msg.pack": "Pack",
      "msg.noSe": "Todavía no sé",
      "msg.personas": "Personas",
      "msg.fecha": "Fecha",
      "msg.aLas": "a las",
      "msg.comentarios": "Comentarios",
      "msg.idioma": "",
      "share.texto": "Mira este lugar para nuestra salida de grupo en Playa Las Salinas:",
      "galeria.ampliar": "Ampliar foto:",
      "galeria.de": "de",
      "ig.ver": "Ver en Instagram",
      "cliente.1": "Terraza llena: familias y amigos compartiendo bajo la malla de sombra",
      "cliente.2": "Un día de temporada en la terraza de Roots Salinas",
      "cliente.3": "Clientes disfrutando churrascos y jugos naturales",
      "cliente.4": "Una familia que vuelve: ¡todos con el pulgar arriba!",
      "cliente.5": "Almuerzo con vista al humedal de Pullally",
      "cliente.6": "Familia, amigos y mascotas frente a la playa",
    },
  },
};
