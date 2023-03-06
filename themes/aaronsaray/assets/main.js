import Collapse from './themes/aaronsaray/node_modules/bootstrap/js/dist/collapse.js'; // eslint-disable-line
import Dropdown from './themes/aaronsaray/node_modules/bootstrap/js/dist/dropdown.js'; // eslint-disable-line

const navbar = document.querySelector('.navbar');

if (navbar.classList.contains('home')) {
  window.addEventListener('scroll', () => {
    if (window.scrollY === 0) {
      navbar.classList.add('top-position');
    } else {
      navbar.classList.remove('top-position');
    }
  });
}

document.getElementById('search-form').addEventListener('submit', (f) => {
  f.preventDefault();
  // eslint-disable-next-line
  f.target.querySelector('input').value += ' site:aaronsaray.com';
  f.target.submit();
});
