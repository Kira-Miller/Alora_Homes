// ==========================================================================
// Контроллер страницы о компании и контактах (about.html)
// ==========================================================================

import {showToast} from './components.js';
import {initLayout} from './layout.js';
import {getState} from './state.js';

initLayout('about');

const contactForm = document.getElementById('about-contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const {lang} = getState();
  const name = document.getElementById('contact-name').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  if (name.length < 2 || phone.length < 7) {
    showToast(lang === 'ru' ? 'Укажите имя и телефон' : 'Please enter name and phone');
    return;
  }
  contactForm.reset();
  showToast(
    lang === 'ru'
      ? 'Сообщение отправлено. Специалист Alora Homes свяжется с вами!'
      : 'Message sent. An Alora Homes specialist will contact you!',
    'success'
  );
});
