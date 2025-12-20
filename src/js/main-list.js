import simpleParallax from 'simple-parallax-js/vanilla';

const images = document.querySelectorAll('.parallax-img');

new simpleParallax(images, {
  scale: 1.2,
  delay: 0.6,
  overflow: true,
});
