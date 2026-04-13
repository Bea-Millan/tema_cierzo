(function (Drupal) {
  Drupal.behaviors.heroSwiper = {
    attach(context) {
      document.querySelectorAll('[data-swiper]:not(.is-init)', context).forEach((el) => {
        el.classList.add('is-init');
        new Swiper(el, {
          loop: true,
          autoplay: { delay: 5000, disableOnInteraction: false },
          pagination: { el: '.swiper-pagination', clickable: true },
          navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
      });
    },
  };
})(Drupal);

