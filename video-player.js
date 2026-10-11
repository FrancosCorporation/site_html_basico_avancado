const fileInput = document.getElementById('video-file');
const player = document.getElementById('player');
const status = document.getElementById('video-status');
let activeObjectUrl;

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  if (file.type && !file.type.startsWith('video/')) {
    fileInput.value = '';
    status.textContent = 'Escolha um arquivo de vídeo compatível.';
    return;
  }

  player.pause();
  if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
  activeObjectUrl = URL.createObjectURL(file);
  player.src = activeObjectUrl;
  player.load();
  status.textContent = `Vídeo carregado: ${file.name}`;
});

player.addEventListener('error', () => {
  if (player.currentSrc) {
    status.textContent = 'Este formato não pôde ser reproduzido neste navegador.';
  }
});

window.addEventListener('pagehide', (event) => {
  if (event.persisted || !activeObjectUrl) return;
  URL.revokeObjectURL(activeObjectUrl);
  activeObjectUrl = undefined;
});
