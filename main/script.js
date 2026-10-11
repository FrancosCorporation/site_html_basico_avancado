const selector = document.getElementById('select');
const content = document.getElementById('content');

if (selector && content) {
  selector.addEventListener('change', () => {
    const selectedPanel = Array.from(content.querySelectorAll('.data'))
      .find((panel) => panel.id === selector.value);
    const isPanel = Boolean(selectedPanel);

    content.querySelectorAll('.data').forEach((panel) => {
      panel.hidden = true;
    });
    content.hidden = !isPanel;

    if (isPanel) {
      selectedPanel.hidden = false;
    }
  });
}

window.setSrc = (src, captionSrc) => {
  const player = document.getElementById('player');
  if (!player || !src) return;

  const status = document.getElementById('player-status');
  if (status) {
    player.onerror = () => {
      status.textContent = 'Não foi possível carregar este vídeo. Verifique a conexão e o endereço da mídia.';
    };
  }

  player.src = new URL(src, document.baseURI).href;
  player.load();

  const captionTrack = document.getElementById('legenda');
  if (captionTrack) {
    if (captionSrc) {
      captionTrack.src = new URL(captionSrc, document.baseURI).href;
      captionTrack.default = true;
    } else {
      captionTrack.removeAttribute('src');
      captionTrack.default = false;
    }
  }

  if (status) {
    status.textContent = 'Título selecionado. Use os controles do vídeo para reproduzir.';
  }
};
