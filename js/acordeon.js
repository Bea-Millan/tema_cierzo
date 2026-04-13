(function ($, Drupal, once) {
  // Define un nuevo "comportamiento" de Drupal.
  Drupal.behaviors.myAccordion = {
    attach: function (context, settings) {
      // Usa 'once' para asegurar que el código solo se ejecuta una vez por elemento.
      const accordionContainers = once('accordion', '.accordion-container', context);

      // Iteramos sobre cada contenedor de acordeón encontrado.
      accordionContainers.forEach(function (container) {
        const items = container.querySelectorAll('.accordion-item');
        const buttons = container.querySelectorAll('.accordion-button');

        buttons.forEach(function (button) {
          button.addEventListener('click', function () {
            const clickedItem = this.closest('.accordion-item');
            const isAlreadyActive = clickedItem.classList.contains('active');

            // 1. Cerrar todos los elementos.
            items.forEach(function (item) {
              item.classList.remove('active');
              item.querySelector('.accordion-button').setAttribute('aria-expanded', 'false');
            });

            // 2. Si el que se clickó no estaba activo, abrirlo.
            if (!isAlreadyActive) {
              clickedItem.classList.add('active');
              this.setAttribute('aria-expanded', 'true');
            }
          });
        });
      });
    }
  };
})(jQuery, Drupal, once);
