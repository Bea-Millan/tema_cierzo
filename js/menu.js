(function (Drupal, once) {
  Drupal.behaviors.menuToggle = {
    attach: function (context) {
      const menuIcon = once('menu-icon', '.menu-icon', context);
      const menu = document.querySelector('.main-menu');

      menuIcon.forEach((icon) => {
        if (icon && menu) {
          icon.addEventListener('click', function () {
            const expanded = icon.getAttribute('aria-expanded') === 'true';
            const header = icon.closest('header');
            icon.classList.toggle('open');
            menu.classList.toggle('open');
            if (header) {
              header.classList.toggle('menu-open');
            }
            icon.setAttribute('aria-expanded', !expanded);
            icon.setAttribute(
              'aria-label',
              !expanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
            );
          });
        }
      });

      once('menu-link-close', '.main-menu a', context).forEach((link) => {
        link.addEventListener('click', () => {
          menu.classList.remove('open');
          const icon = document.querySelector('.menu-icon');
          const header = document.querySelector('header.site-header');
          if (icon) {
            icon.classList.remove('open');
            icon.setAttribute('aria-expanded', 'false');
            icon.setAttribute('aria-label', 'Abrir menú de navegación');
          }
          if (header) {
            header.classList.remove('menu-open');
          }
        });
      });
    }
  };
})(Drupal, once);


(function (Drupal, once) {
  Drupal.behaviors.masonryInfinite = {
    attach: function (context, settings) {

      const items = once('masonry-animate', '.masonry-item', context);
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0 });

items.forEach(el => observer.observe(el));

}
};
})(Drupal, once);





