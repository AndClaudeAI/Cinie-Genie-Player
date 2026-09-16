const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const enrollForm = document.getElementById('enrollForm');
const formNote = document.getElementById('formNote');

if (enrollForm) {
  enrollForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const studentName = enrollForm.elements['student'].value.trim() || 'your student';
    formNote.textContent = `Thanks! ${studentName}'s seat (and daily 40 balls of akara) is on hold — we'll be in touch within 48 hours.`;
    enrollForm.reset();
  });
}
