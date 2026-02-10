// cursor-glow.js
// Adds a smooth, subtle radial glow that follows the cursor.
(function(){
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let posX = mouseX;
  let posY = mouseY;

  const ease = 0.12;

  function onMove(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function onTouch(e){
    if(e.touches && e.touches[0]){
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }

  window.addEventListener('pointermove', onMove, {passive:true});
  window.addEventListener('touchmove', onTouch, {passive:true});

  // Subtle gradient using both cyan and violet
  glow.style.background = 'radial-gradient(circle at 30% 30%, rgba(46,230,242,0.18), rgba(138,107,255,0.12) 40%, rgba(46,230,242,0.02) 70%, transparent 75%)';

  function raf(){
    const dx = mouseX - posX;
    const dy = mouseY - posY;
    posX += dx * ease;
    posY += dy * ease;

    // position the glow center
    glow.style.left = posX + 'px';
    glow.style.top = posY + 'px';

    // subtle scaling based on speed
    const speed = Math.min(1, Math.sqrt(dx*dx + dy*dy) / 80);
    const scale = 1 + speed * 0.18;
    glow.style.transform = `translate(-50%, -50%) scale(${scale})`;
    glow.style.opacity = 0.95 - Math.min(0.45, speed * 0.6);

    requestAnimationFrame(raf);
  }

  // Ensure the glow doesn't intercept pointer events
  glow.style.pointerEvents = 'none';
  glow.style.position = 'fixed';
  glow.style.width = '260px';
  glow.style.height = '260px';
  glow.style.borderRadius = '50%';
  glow.style.zIndex = '9997';
  glow.style.mixBlendMode = 'screen';
  glow.style.filter = 'blur(36px) saturate(120%)';

  requestAnimationFrame(raf);

  // Respect reduced motion preference
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) {
    glow.style.display = 'none';
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('touchmove', onTouch);
  }

})();
