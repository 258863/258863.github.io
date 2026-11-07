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
