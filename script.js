const certificateDialog = document.querySelector('.certificate-dialog');
if (certificateDialog) {
  const certificateImage = certificateDialog.querySelector('img');
  const certificateTitle = certificateDialog.querySelector('.dialog-title');
  const closeButton = certificateDialog.querySelector('.dialog-close');
  let loadToken = 0;

  const revealImage = (token) => {
    if (token === loadToken) {
      certificateImage.classList.remove('is-loading');
    }
  };

  document.querySelectorAll('[data-certificate]').forEach((button) => {
    button.addEventListener('click', () => {
      const token = ++loadToken;
      certificateImage.classList.add('is-loading');
      certificateImage.onload = () => revealImage(token);
      certificateImage.onerror = () => revealImage(token);
      certificateImage.src = button.dataset.certificate;
      certificateImage.alt = button.dataset.title || '';
      certificateTitle.textContent = button.dataset.title || '';
      if (certificateImage.complete && certificateImage.naturalWidth > 0) {
        revealImage(token);
      }
      certificateDialog.showModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => certificateDialog.close());
  }

  certificateDialog.addEventListener('click', (event) => {
    if (event.target === certificateDialog) certificateDialog.close();
  });

  certificateDialog.addEventListener('close', () => {
    loadToken += 1;
    certificateImage.onload = null;
    certificateImage.onerror = null;
    certificateImage.classList.remove('is-loading');
    certificateImage.removeAttribute('src');
    certificateImage.alt = '';
  });
}

const honorsMore = document.querySelector('.honors-more');
const honorsToggle = document.querySelector('.honors-toggle');
if (honorsMore && honorsToggle) {
  const label = honorsToggle.querySelector('.honors-toggle-label');
  const closedText = label ? label.textContent : '';
  honorsMore.hidden = true;
  honorsToggle.hidden = false;
  honorsToggle.addEventListener('click', () => {
    const willOpen = honorsMore.hidden;
    honorsMore.hidden = !willOpen;
    honorsToggle.setAttribute('aria-expanded', String(willOpen));
    if (label) {
      label.textContent = willOpen ? '收起' : closedText;
    }
  });
}

const copyStatus = document.getElementById('copy-status');

async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for file:// or restricted contexts
    }
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  textarea.remove();
  return ok;
}

document.querySelectorAll('[data-copy-email]').forEach((button) => {
  const defaultLabel = button.textContent.trim();
  let resetTimer = null;

  button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    if (!email) return;
    const copied = await copyText(email);
    if (!copied) return;
    if (resetTimer) clearTimeout(resetTimer);
    button.textContent = '已复制 ✓';
    button.classList.add('is-copied');
    if (copyStatus) {
      copyStatus.textContent = `已复制邮箱 ${email}`;
    }
    resetTimer = window.setTimeout(() => {
      button.textContent = defaultLabel;
      button.classList.remove('is-copied');
      resetTimer = null;
    }, 2000);
  });
});

const navLinks = Array.from(document.querySelectorAll('.site-header nav a[href^="#"]'));
const sections = navLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    return target ? { link, target } : null;
  })
  .filter(Boolean);

if (sections.length) {
  const setActiveLink = (activeLink) => {
    sections.forEach(({ link }) => {
      const isMatch = link === activeLink;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const visibleSections = new Map();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        if (window.scrollY < 160) {
          setActiveLink(null);
          return;
        }
        let best = null;
        let bestRatio = 0;
        sections.forEach((item) => {
          const ratio = visibleSections.get(item.target) || 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = item.link;
          }
        });
        if (best) {
          setActiveLink(best);
        }
      },
      { rootMargin: '-22% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.6] }
    );
    sections.forEach(({ target }) => observer.observe(target));
  }

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY < 160) {
        setActiveLink(null);
      } else if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48) {
        setActiveLink(sections[sections.length - 1].link);
      }
    },
    { passive: true }
  );
}
