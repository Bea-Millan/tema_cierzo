(function (Drupal) {
  'use strict';

  // Definimos un nuevo "comportamiento" de Drupal.
  // Esto asegura que nuestro código se ejecuta en el momento adecuado.
  Drupal.behaviors.forceVideoHeight = {
    attach: function (context, settings) {

      // Buscamos nuestro párrafo de vídeo en la página.
      // El , context una vez asegura que solo se ejecuta una vez por elemento.
      const videoParagraph = context.querySelector('.paragraph-video--full-width');

      // Si encontramos el párrafo...
      if (videoParagraph) {
        // ...buscamos el iframe que está dentro de él.
        const iframe = videoParagraph.querySelector('iframe');

        // Si encontramos el iframe...
        if (iframe) {
          // Medimos la altura REAL del contenedor del párrafo (que incluye el padding).
          const containerHeight = videoParagraph.offsetHeight;

          // Y le aplicamos esa altura directamente al iframe como un estilo en línea.
          // Esto sobreescribe CUALQUIER otra regla de CSS o script.
          iframe.style.height = containerHeight + 'px';
        }
      }
    }
  };

})(Drupal);
