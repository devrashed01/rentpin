// A quiet video player: nothing on screen while playing, controls when paused or on hover.
// Without JavaScript the video keeps the browser's own controls.
const player = document.querySelector('.player');
const video = player?.querySelector('video');

if (player && video) {
  const toggle = player.querySelector('.player-toggle');
  const sound = player.querySelector('.player-sound');
  const fullscreen = player.querySelector('.player-fullscreen');
  const watchButton = document.querySelector('[data-play-demo]');

  video.controls = false;
  player.classList.add('is-enhanced');
  toggle.hidden = false;
  sound.hidden = false;
  fullscreen.hidden = false;

  const play = () => video.play().catch(() => {
    // Some browsers refuse sound without a clear gesture. Muted still works, and the video has captions.
    video.muted = true;
    video.play().catch(() => {});
  });

  const update = () => {
    player.classList.toggle('is-playing', !video.paused && !video.ended);
    player.classList.toggle('is-muted', video.muted);
    toggle.setAttribute('aria-label', video.paused ? (video.ended ? 'Replay the video' : 'Play the video') : 'Pause the video');
    sound.setAttribute('aria-label', video.muted ? 'Turn sound on' : 'Turn sound off');
  };

  toggle.addEventListener('click', () => (video.paused ? play() : video.pause()));
  sound.addEventListener('click', () => { video.muted = !video.muted; });
  fullscreen.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (player.requestFullscreen) player.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iPhone
  });

  ['play', 'pause', 'ended', 'volumechange'].forEach((name) => video.addEventListener(name, update));
  video.addEventListener('waiting', () => player.classList.add('is-loading'));
  video.addEventListener('play', () => player.classList.add('is-loading'));
  ['playing', 'pause', 'ended', 'error'].forEach((name) => video.addEventListener(name, () => player.classList.remove('is-loading')));
  update();

  // "Watch the video" scrolls to the video and starts it with sound.
  watchButton?.addEventListener('click', (event) => {
    event.preventDefault();
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    player.scrollIntoView({behavior: calm ? 'auto' : 'smooth', block: 'center'});
    history.replaceState(null, '', '#demo');
    play();
  });
}
