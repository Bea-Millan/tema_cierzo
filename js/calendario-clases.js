/**
 * calendario-clases.js
 *
 * En vez de mostrar el detalle de la clase en el popup flotante de
 * "jsframe" (la librería que usa fullcalendar_view), lo redirigimos a
 * un panel fijo debajo del calendario — como un lector de documentos:
 * el calendario arriba, el contenido de la clase seleccionada abajo.
 *
 * CÓMO FUNCIONA (sin tocar el módulo ni reconstruir el mapeo clic→evento
 * a mano, que sería frágil):
 *   1. Dejamos que fullcalendar_view abra su popup jsframe normal al
 *      clicar una clase — es quien ya sabe emparejar el clic con el
 *      evento correcto.
 *   2. En cuanto se inserta ese popup en el DOM, lo ocultamos
 *      inmediatamente (nadie llega a verlo).
 *   3. Leemos el HTML que trae dentro (el mismo que `des` en
 *      extendedProps) y buscamos, entre `calendar.getEvents()`, cuál
 *      es el evento cuyo `extendedProps.des` coincide — así sabemos la
 *      FECHA exacta de la clase clicada sin tocar el DOM del calendario.
 *   4. Pintamos fecha + contenido en el panel fijo de abajo.
 *   5. Eliminamos el popup oculto del DOM (limpieza).
 */
(function (Drupal, once) {
  'use strict';

  var CALENDAR_SELECTOR = '.js-drupal-fullcalendar, .fullcalendar-view-calendar, [data-fullcalendar]';
  var WINDOW_MANAGER_SELECTOR = '[id^="windowManager_"]';
  var PANEL_ID = 'visor-clase';

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  Drupal.behaviors.visorClase = {
    attach: function (context) {
      once('visor-clase', CALENDAR_SELECTOR, context).forEach(function (calendarEl) {
        var panel = crearPanel(calendarEl);
        vigilarPopups(panel);
      });
    }
  };

  function crearPanel(calendarEl) {
    var existente = document.getElementById(PANEL_ID);
    if (existente) {
      return existente;
    }

    // Envolvemos el bloque del calendario y el panel en un contenedor
    // propio para poder ponerlos en dos columnas con flexbox, sin
    // afectar al resto de bloques de la región (que quedan fuera de
    // este wrapper).
    var contenedorCalendario = calendarEl.closest('.views-element-container') || calendarEl;

    var wrapper = document.createElement('div');
    wrapper.className = 'visor-clase-layout';
    contenedorCalendario.parentNode.insertBefore(wrapper, contenedorCalendario);
    wrapper.appendChild(contenedorCalendario);

    var panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.className = 'visor-clase visor-clase--vacio';
    panel.innerHTML =
      '<div class="visor-clase__cabecera">Selecciona un día en el calendario</div>' +
      '<div class="visor-clase__cuerpo">' +
      '<p class="visor-clase__aviso">Aquí aparecerá el contenido de la clase que elijas arriba.</p>' +
      '</div>';

    wrapper.appendChild(panel);

    return panel;
  }

  function vigilarPopups(panel) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (nodo) {
          if (nodo.nodeType !== 1) {
            return;
          }
          var manager = nodo.matches && nodo.matches(WINDOW_MANAGER_SELECTOR)
            ? nodo
            : (nodo.querySelector ? nodo.querySelector(WINDOW_MANAGER_SELECTOR) : null);
          if (manager) {
            ocultarInmediatamente(manager);
            procesarPopup(manager, panel);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function ocultarInmediatamente(managerEl) {
    // Lo sacamos de la vista al instante, antes de que se pueda ver el
    // flash del popup flotante.
    managerEl.style.setProperty('visibility', 'hidden', 'important');
    managerEl.style.setProperty('pointer-events', 'none', 'important');
    managerEl.style.setProperty('position', 'fixed', 'important');
    managerEl.style.setProperty('left', '-99999px', 'important');
    managerEl.style.setProperty('top', '-99999px', 'important');
  }

  function procesarPopup(managerEl, panel) {
    // El contenido tarda un instante en pintarse dentro del popup;
    // reintentamos unas cuantas veces por si al primer intento aún
    // está vacío.
    var intentos = 0;
    var maxIntentos = 20; // ~1s en total (20 x 50ms)

    function intentar() {
      intentos++;
      var contenido = managerEl.querySelector('[id$="_canvas"] div[style*="visibility: visible"]')
        || managerEl.querySelector('[id$="_canvas"] div');

      var html = contenido ? contenido.innerHTML.trim() : '';

      if (!html && intentos < maxIntentos) {
        setTimeout(intentar, 50);
        return;
      }

      if (html) {
        pintarEnPanel(html, panel);
      }

      // Limpieza: quitamos el popup oculto del DOM, ya no hace falta.
      managerEl.remove();
    }

    intentar();
  }

  function pintarEnPanel(htmlPopup, panel) {
    var calendarApi = obtenerCalendarApi();
    var fecha = null;

    if (calendarApi) {
      var eventos = calendarApi.getEvents();
      for (var i = 0; i < eventos.length; i++) {
        var des = (eventos[i].extendedProps && eventos[i].extendedProps.des || '').trim();
        if (des && des === htmlPopup) {
          fecha = eventos[i].start;
          break;
        }
      }
    }

    panel.classList.remove('visor-clase--vacio');
    panel.querySelector('.visor-clase__cabecera').textContent = fecha
      ? formatearFecha(fecha)
      : 'Clase';
    panel.querySelector('.visor-clase__cuerpo').innerHTML = htmlPopup;

    // Llevamos el scroll al panel para que se note el cambio, sobre
    // todo en móvil donde el panel puede quedar fuera de la pantalla.
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function obtenerCalendarApi() {
    if (window.drupalSettings && Array.isArray(window.drupalSettings.calendar) && window.drupalSettings.calendar.length) {
      return window.drupalSettings.calendar[0];
    }
    return null;
  }

  function formatearFecha(fecha) {
    var d = (fecha instanceof Date) ? fecha : new Date(fecha);
    return d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
  }
})(Drupal, once);
