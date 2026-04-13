(function ($, Drupal) {
  Drupal.behaviors.initAos = {
    attach: function (context, settings) {
      // Evita que se inicialice varias veces
      if (typeof AOS !== 'undefined') {
        AOS.init({
          offset: 120, // Distancia antes de disparar
          duration: 800, // Duración en ms
          once: true, // Si quieres que solo se anime la primera vez
        });
      }
    }
  };
})(jQuery, Drupal);
