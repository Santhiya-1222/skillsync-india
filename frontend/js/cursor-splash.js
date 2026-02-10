(function(){
  try {
    console.log('cursor-splash: init');
    // runtime feature-detection: disable on low-power or data-saver devices
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
    const lowPower = (connection && (connection.saveData === true || ['slow-2g','2g'].includes(connection.effectiveType))) || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (lowPower) {
      console.log('cursor-splash: disabled on low-power or reduced-motion device');
      return;
    }

    // Cursor splash painter - paints soft radial splashes that fade
    const canvas = document.createElement('canvas');
    canvas.id = 'cursorSplashCanvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.warn('cursor-splash: 2D context unavailable');
      return;
    }

    let DPR = window.devicePixelRatio || 1;
    function resize(){
      DPR = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * DPR);
      canvas.height = Math.round(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);


  const particles = [];
  // softer, lower-alpha colors for a more natural wash
  const colors = ['rgba(0,183,209,0.12)','rgba(255,58,122,0.10)','rgba(38,212,143,0.09)','rgba(126,87,255,0.11)'];

  function rgbaWithAlpha(rgba, alpha){
    // expect rgba(r,g,b,a) or rgb(r,g,b)
    const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
    if (!m) return rgba;
    const r = m[1], g = m[2], b = m[3];
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function addSplash(x,y){
    // only enable on larger screens for performance
    if (window.innerWidth < 720) return;
    // larger painterly splashes
    const r = Math.random()*80 + 40;
    // painterly smear: include angle and skew values
    particles.push({ x, y, r, life: 1.0, decay: 0.008 + Math.random()*0.015, color: colors[Math.floor(Math.random()*colors.length)], vx: (Math.random()-0.5)*2.4, vy: (Math.random()-0.5)*2.4, ang: Math.random()*Math.PI*2, sx: 0.5 + Math.random()*1.6 });
    if (particles.length>120) particles.splice(0, particles.length-120);
  }

  let lastMove = 0;
  window.addEventListener('mousemove', (e)=>{
    const now = Date.now();
    // throttle more aggressively for larger splashes
    if (now - lastMove < 30) return;
    lastMove = now;
    addSplash(e.clientX, e.clientY);
  });
  window.addEventListener('touchmove', (e)=>{
    const t = e.touches[0];
    if (t) addSplash(t.clientX, t.clientY);
  }, {passive:true});

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.life -= p.decay;
      if (p.life <= 0){ particles.splice(i,1); continue; }
      p.x += p.vx; p.y += p.vy; p.ang += 0.01;
      const alpha = Math.max(0, p.life);
      // painterly ellipse with blur
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.ang);
      ctx.scale(p.sx, 1);
      // use soft blur for painterly smear
      ctx.filter = 'blur(8px)';
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r*2);
      grad.addColorStop(0, rgbaWithAlpha(p.color, Math.min(1, alpha*0.9)));
      grad.addColorStop(0.6, rgbaWithAlpha(p.color, Math.min(0.35, alpha*0.35)));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r*2, p.r, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
      ctx.filter = 'none';
    }
    requestAnimationFrame(draw);
  }

  // Start animation loop
  requestAnimationFrame(draw);
})();
