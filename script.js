const certificateDialog = document.querySelector('.certificate-dialog');
const certificateImage = certificateDialog.querySelector('img');
const certificateTitle = certificateDialog.querySelector('.dialog-title');

document.querySelectorAll('[data-certificate]').forEach((button) => {
  button.addEventListener('click', () => {
    certificateImage.src = button.dataset.certificate;
    certificateImage.alt = button.dataset.title;
    certificateTitle.textContent = button.dataset.title;
    certificateDialog.showModal();
  });
});

certificateDialog.querySelector('.dialog-close').addEventListener('click', () => certificateDialog.close());
certificateDialog.addEventListener('click', (event) => {
  if (event.target === certificateDialog) certificateDialog.close();
});

const honorsMore = document.querySelector('.honors-more');
const honorsToggle = document.querySelector('.honors-toggle');
if (honorsMore && honorsToggle) {
  const label = honorsToggle.querySelector('.honors-toggle-label');
  const closedText = label.textContent;
  honorsMore.hidden = true;
  honorsToggle.hidden = false;
  honorsToggle.addEventListener('click', () => {
    const willOpen = honorsMore.hidden;
    honorsMore.hidden = !willOpen;
    honorsToggle.setAttribute('aria-expanded', String(willOpen));
    label.textContent = willOpen ? '收起' : closedText;
  });
}
