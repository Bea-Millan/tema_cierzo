/**
 * @file
 * Inicializa GLightbox para las galerías (enlaces con clase .glightbox).
 * La librería se carga con async/defer, así que esperamos a que exista.
 */
(function (Drupal, once) {
  'use strict';

  let lightbox = null;

  function iniciar() {
    if (typeof window.GLightbox !== 'function') {
      return false;
    }
    if (lightbox) {
      lightbox.reload();
    }
    else {
      lightbox = window.GLightbox({ selector: '.glightbox', loop: true });
    }
    return true;
  }

  Drupal.behaviors.cierzoGlightbox = {
    attach: function (context) {
      if (!once('cierzo-glightbox', '.glightbox', context).length) {
        return;
      }
      if (!iniciar()) {
        window.addEventListener('load', iniciar, { once: true });
      }
    }
  };
})(Drupal, once);
