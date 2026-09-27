const EVENT_DATE = new Date('2026-12-12T21:00:00-03:00');

const countdownParts = {
  days: document.querySelector('#days'),
  hours: document.querySelector('#hours'),
  minutes: document.querySelector('#minutes'),
  seconds: document.querySelector('#seconds')
};

function updateCountdown() {
  const distance = Math.max(0, EVENT_DATE.getTime() - Date.now());
  const day = 86_400_000;
  const hour = 3_600_000;
  const minute = 60_000;
  const values = {
    days: Math.floor(distance / day),
    hours: Math.floor((distance % day) / hour),
    minutes: Math.floor((distance % hour) / minute),
    seconds: Math.floor((distance % minute) / 1000)
  };

  Object.entries(values).forEach(([key, value]) => {
    countdownParts[key].textContent = String(value).padStart(2, '0');
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

const petalRain = document.querySelector('#petalRain');
if (petalRain) {
  const petalImages = ['assets/petalo-1.png', 'assets/petalo-2.png', 'assets/petalo-3.png'];
  const petalSettings = [
    [3, 38, 11, -2, 42, .78], [11, 28, 14, -8, -35, .66],
    [20, 46, 15, -12, 51, .74], [29, 33, 12, -5, -42, .7],
    [38, 40, 16, -14, 36, .64], [47, 26, 13, -9, -31, .72],
    [56, 44, 14, -1, 47, .7], [65, 32, 17, -13, -38, .62],
    [74, 41, 13, -6, 45, .76], [83, 29, 15, -10, -34, .68],
    [91, 37, 18, -16, 32, .7], [15, 25, 19, -18, 39, .58],
    [52, 31, 20, -20, -29, .64], [87, 24, 21, -21, 33, .56]
  ];

  petalSettings.forEach(([left, size, duration, delay, drift, opacity], index) => {
    const petal = document.createElement('img');
    petal.className = 'falling-petal';
    petal.src = petalImages[index % petalImages.length];
    petal.alt = '';
    petal.decoding = 'async';
    petal.style.cssText = `--left:${left}%;--size:${size}px;--duration:${duration}s;--delay:${delay}s;--drift:${drift}px;--drift-back:${Math.round(drift * -.55)}px;--opacity:${opacity}`;
    petalRain.appendChild(petal);
  });
}

const scratchCard = document.querySelector('#scratchCard');
const scratchCanvas = document.querySelector('#scratchCanvas');
const scratchCelebration = document.querySelector('#scratchCelebration');

if (scratchCard && scratchCanvas) {
  const scratchContext = scratchCanvas.getContext('2d', { willReadFrequently: true });
  let scratching = false;
  let completed = false;
  let movesSinceCheck = 0;

  function drawScratchSurface() {
    if (completed) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    scratchCanvas.width = Math.max(1, Math.round(rect.width * ratio));
    scratchCanvas.height = Math.max(1, Math.round(rect.height * ratio));
    scratchContext.setTransform(ratio, 0, 0, ratio, 0, 0);

    const gradient = scratchContext.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#b85d7a');
    gradient.addColorStop(.2, '#f3bfd0');
    gradient.addColorStop(.43, '#ce728f');
    gradient.addColorStop(.68, '#f9dbe3');
    gradient.addColorStop(.84, '#d985a0');
    gradient.addColorStop(1, '#a95070');
    scratchContext.fillStyle = gradient;
    scratchContext.fillRect(0, 0, rect.width, rect.height);

    const glow = scratchContext.createRadialGradient(rect.width * .68, rect.height * .28, 0, rect.width * .68, rect.height * .28, rect.width * .65);
    glow.addColorStop(0, 'rgba(255,244,247,.42)');
    glow.addColorStop(1, 'rgba(255,244,247,0)');
    scratchContext.fillStyle = glow;
    scratchContext.fillRect(0, 0, rect.width, rect.height);

    scratchContext.globalAlpha = .13;
    scratchContext.strokeStyle = '#fff5f8';
    scratchContext.lineWidth = 1;
    for (let x = -rect.height; x < rect.width + rect.height; x += 24) {
      scratchContext.beginPath();
      scratchContext.moveTo(x, 0);
      scratchContext.lineTo(x + rect.height, rect.height);
      scratchContext.stroke();
    }
    scratchContext.globalAlpha = 1;

    function paintPetal(x, y, width, height, rotation, alpha) {
      scratchContext.save();
      scratchContext.translate(x, y);
      scratchContext.rotate(rotation);
      const petalGradient = scratchContext.createLinearGradient(-width / 2, 0, width / 2, 0);
      petalGradient.addColorStop(0, `rgba(255,244,248,${alpha})`);
      petalGradient.addColorStop(.65, `rgba(255,218,229,${alpha * .72})`);
      petalGradient.addColorStop(1, `rgba(169,70,104,${alpha * .34})`);
      scratchContext.fillStyle = petalGradient;
      scratchContext.beginPath();
      scratchContext.moveTo(-width / 2, 0);
      scratchContext.bezierCurveTo(-width * .22, -height * .62, width * .34, -height * .54, width / 2, 0);
      scratchContext.bezierCurveTo(width * .24, height * .5, -width * .25, height * .58, -width / 2, 0);
      scratchContext.fill();
      scratchContext.restore();
    }

    paintPetal(rect.width * .1, rect.height * .14, rect.width * .24, rect.width * .13, -.55, .32);
    paintPetal(rect.width * .9, rect.height * .2, rect.width * .2, rect.width * .11, .7, .27);
    paintPetal(rect.width * .16, rect.height * .83, rect.width * .22, rect.width * .12, .35, .25);
    paintPetal(rect.width * .87, rect.height * .77, rect.width * .27, rect.width * .14, -.7, .3);

    scratchContext.strokeStyle = 'rgba(249,222,159,.82)';
    scratchContext.lineWidth = Math.max(1.5, rect.width * .005);
    scratchContext.strokeRect(10, 10, rect.width - 20, rect.height - 20);

    const titleSize = Math.max(15, Math.min(28, rect.width * .055));
    const smallSize = Math.max(10, Math.min(17, rect.width * .034));
    scratchContext.textAlign = 'center';
    scratchContext.textBaseline = 'middle';
    scratchContext.fillStyle = '#ffe7ae';
    scratchContext.shadowColor = 'rgba(99,34,58,.48)';
    scratchContext.shadowBlur = 5;
    scratchContext.font = `600 ${titleSize}px Montserrat, Arial, sans-serif`;
    scratchContext.fillText('DESLIZÁ EL DEDO', rect.width / 2, rect.height * .42);
    scratchContext.fillText('Y DESCUBRÍ LA FECHA', rect.width / 2, rect.height * .53);
    scratchContext.font = `400 ${smallSize}px Montserrat, Arial, sans-serif`;
    scratchContext.letterSpacing = '2px';
    scratchContext.fillStyle = '#fff8fa';
    scratchContext.fillText('RASPÁ AQUÍ', rect.width / 2, rect.height * .66);
    scratchContext.shadowBlur = 0;
  }

  function scratchAt(event) {
    const rect = scratchCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radius = Math.max(32, rect.width * .11);
    scratchContext.save();
    scratchContext.globalCompositeOperation = 'destination-out';
    const fade = scratchContext.createRadialGradient(x, y, radius * .35, x, y, radius);
    fade.addColorStop(0, 'rgba(0,0,0,1)');
    fade.addColorStop(.72, 'rgba(0,0,0,.96)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    scratchContext.fillStyle = fade;
    scratchContext.beginPath();
    scratchContext.arc(x, y, radius, 0, Math.PI * 2);
    scratchContext.fill();
    scratchContext.restore();

    movesSinceCheck += 1;
    if (movesSinceCheck >= 5) {
      movesSinceCheck = 0;
      checkScratchProgress();
    }
  }

  function checkScratchProgress() {
    const pixels = scratchContext.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
    const step = Math.max(4, Math.round((window.devicePixelRatio || 1) * 8));
    let clear = 0;
    let checked = 0;
    for (let y = 0; y < scratchCanvas.height; y += step) {
      for (let x = 0; x < scratchCanvas.width; x += step) {
        checked += 1;
        if (pixels[(y * scratchCanvas.width + x) * 4 + 3] < 50) clear += 1;
      }
    }
    if (clear / checked >= .16) completeScratch();
  }

  function completeScratch() {
    if (completed) return;
    completed = true;
    scratchCard.classList.add('is-complete');
    scratchCanvas.setAttribute('aria-label', 'Fecha descubierta: sábado 12 de diciembre de 2026 a las 21 horas');
    launchRevealCelebration();
    setTimeout(() => scratchCard.hidden = true, 850);
  }

  function launchRevealCelebration() {
    if (!scratchCelebration) return;
    const images = ['assets/petalo-1.png', 'assets/petalo-2.png', 'assets/petalo-3.png'];
    for (let index = 0; index < 14; index += 1) {
      const petal = document.createElement('img');
      petal.className = 'reveal-petal';
      petal.src = images[index % images.length];
      petal.alt = '';
      const drift = -110 + (index * 37) % 220;
      petal.style.cssText = `--left:${4 + (index * 7) % 90}%;--size:${25 + (index * 9) % 28}px;--duration:${2.7 + (index % 5) * .3}s;--delay:${(index % 7) * .08}s;--drift:${drift}px;--spin:${220 + (index * 47) % 300}deg`;
      scratchCelebration.appendChild(petal);
    }
    for (let index = 0; index < 12; index += 1) {
      const sparkle = document.createElement('span');
      sparkle.className = 'reveal-sparkle';
      sparkle.style.cssText = `--left:${9 + (index * 17) % 82}%;--top:${34 + (index * 13) % 44}%;--size:${8 + (index % 4) * 5}px;--delay:${(index % 6) * .11}s`;
      scratchCelebration.appendChild(sparkle);
    }
  }

  scratchCanvas.addEventListener('pointerdown', (event) => {
    scratching = true;
    scratchCanvas.setPointerCapture(event.pointerId);
    scratchAt(event);
  });
  scratchCanvas.addEventListener('pointermove', (event) => {
    if (!scratching) return;
    event.preventDefault();
    scratchAt(event);
  });
  scratchCanvas.addEventListener('pointerup', () => scratching = false);
  scratchCanvas.addEventListener('pointercancel', () => scratching = false);
  scratchCanvas.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      completeScratch();
    }
  });

  drawScratchSurface();
  new ResizeObserver(drawScratchSurface).observe(scratchCard);
}

document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => document.querySelector(`#${button.dataset.open}`).showModal());
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog').close());
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });
});

const galleryDialog = document.querySelector('#galleryDialog');
const galleryDialogImage = document.querySelector('#galleryDialogImage');
document.querySelectorAll('[data-gallery]').forEach((polaroid) => {
  polaroid.addEventListener('click', () => {
    const thumbnail = polaroid.querySelector('img');
    galleryDialogImage.src = polaroid.dataset.gallery;
    galleryDialogImage.alt = thumbnail.alt;
    galleryDialog.showModal();
  });
});

async function copyText(text, statusElement) {
  try {
    await navigator.clipboard.writeText(text);
    statusElement.textContent = 'Copiado ✓';
  } catch {
    statusElement.textContent = text;
  }
}

document.querySelector('#copyAddress').addEventListener('click', () => {
  copyText('Av. del Libertador 2450, Buenos Aires', document.querySelector('#copyStatus'));
});

document.querySelector('#copyGift').addEventListener('click', () => {
  copyText(document.querySelector('#giftAlias').textContent, document.querySelector('#giftStatus'));
});

document.querySelector('#calendarButton').addEventListener('click', () => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BloomDate//Mis XV Greta//ES',
    'BEGIN:VEVENT',
    'UID:greta-xv-20261212@bloomdate',
    'DTSTAMP:20260921T120000Z',
    'DTSTART:20261213T000000Z',
    'DTEND:20261213T060000Z',
    'SUMMARY:Mis XV Greta',
    'LOCATION:Espacio Magnolia\\, Av. del Libertador 2450\\, Buenos Aires',
    'DESCRIPTION:¡Te espero para celebrar mis XV!',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Mis-XV-Greta.ics';
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelector('#musicForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const suggestions = JSON.parse(localStorage.getItem('gretaMusicSuggestions') || '[]');
  suggestions.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem('gretaMusicSuggestions', JSON.stringify(suggestions));
  document.querySelector('#musicStatus').textContent = `¡Gracias, ${data.name}! Guardamos tu canción.`;
  event.currentTarget.reset();
});

document.querySelector('#rsvpForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  localStorage.setItem('gretaRsvp', JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
  document.querySelector('#rsvpStatus').textContent = `¡Gracias, ${data.name}! Tu respuesta quedó guardada en este dispositivo.`;
  event.currentTarget.reset();
});

const invitationAudio = document.querySelector('#invitationAudio');
const audioToggle = document.querySelector('#audioToggle');

if (invitationAudio && audioToggle) {
  const audioLabel = audioToggle.querySelector('small');

  const updateAudioButton = (isPlaying) => {
    audioToggle.setAttribute('aria-pressed', String(isPlaying));
    audioToggle.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Reproducir música');
    audioToggle.title = isPlaying ? 'Pausar música' : 'Reproducir música';
    audioToggle.classList.toggle('is-playing', isPlaying);
    audioLabel.textContent = isPlaying ? 'PAUSA' : 'MÚSICA';
  };

  audioToggle.addEventListener('click', async () => {
    if (invitationAudio.paused) {
      try {
        await invitationAudio.play();
        updateAudioButton(true);
      } catch {
        updateAudioButton(false);
      }
    } else {
      invitationAudio.pause();
    }
  });

  invitationAudio.addEventListener('pause', () => updateAudioButton(false));
  invitationAudio.addEventListener('play', () => updateAudioButton(true));
}
