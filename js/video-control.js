// js/video-control.js
(function (Drupal) {
  'use strict';

  Drupal.behaviors.localVideoControls = {
    attach: function (context, settings) {
      // Usamos 'once' para que solo se ejecute una vez por elemento
       const paragraphs = context.querySelectorAll('.paragraph--full-width-video:not(.local-video-processed)');
      paragraphs.forEach(function (paragraph) {
        paragraph.classList.add('local-video-processed');

        const video = paragraph.querySelector('video.custom-video-player');
        const button = paragraph.querySelector('.video-control-button');

        if (video && button) {
          // Lógica del clic en el botón
          button.addEventListener('click', function () {
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          });

          // Escuchamos los eventos del vídeo para cambiar el botón
          video.addEventListener('play', function () {
            button.classList.add('is-playing');
            button.setAttribute('aria-label', 'Pausar vídeo');
          });

          video.addEventListener('pause', function () {
            button.classList.remove('is-playing');
            button.setAttribute('aria-label', 'Reproducir vídeo');
          });
        }
      });
    }
  };
})(Drupal);
