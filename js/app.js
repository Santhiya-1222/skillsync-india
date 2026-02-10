<<<<<<< HEAD
// app.js — MINIMAL SPARK EFFECT TEST
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  function init() {
    const canvas = document.getElementById('sparkCanvas');
    if (!canvas) {
      // spark canvas removed — skip particle effect silently
      return;
    }
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Particles
    const particles = [];
    
    function Particle(x, y) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.x = x;
      this.y = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 1;
      this.life = 1;
      this.size = 3 + Math.random() * 5;
    }
    
    Particle.prototype.update = function() {
      this.vx *= 0.9;
      this.vy *= 0.9;
      this.vy += 0.15;
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 0.025;
    };
    
    Particle.prototype.draw = function(ctx) {
      if (this.life <= 0) return;
      ctx.globalAlpha = Math.max(0, this.life);
      // Dim/soft colors - pastel palette
      const colors = ['#a8d8f0', '#d4b5e8', '#f0c9d8', '#e8d7a0', '#d4f1d4'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Animation
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) particles.splice(i, 1);
      }
      
      requestAnimationFrame(animate);
    }
    animate();
    
    // Events
    document.addEventListener('mousemove', function(e) {
      for (let i = 0; i < 12; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    });
    
    console.log('Spark effect initialized');
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ----------------------
// Load site stats (fetch /api/stats)
// ----------------------
(function(){
  async function formatNumber(n){
    if (n >= 1000) return (n/1000).toFixed(1).replace(/\.0$/, '') + 'K+';
    return String(n);
  }

  async function loadStats(){
    try{
      const resp = await fetch('/api/stats');
      if(!resp.ok) throw new Error('Failed to fetch stats');
      const json = await resp.json();
      const fEl = document.getElementById('freelancerCount');
      const pEl = document.getElementById('projectCount');
      const sEl = document.getElementById('satisfactionCount');
      if(fEl) fEl.innerText = await formatNumber(json.freelancers || 0);
      if(pEl) pEl.innerText = await formatNumber(json.projects || 0);
      if(sEl) sEl.innerText = (json.satisfaction != null) ? (json.satisfaction + '%') : 'N/A';
    }catch(e){
      console.error('loadStats error', e);
    }
  }

  // Call on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStats);
  } else {
    loadStats();
  }
})();

=======
// app.js — MINIMAL SPARK EFFECT TEST
(function() {
  'use strict';
  
  // Wait for DOM to be ready
  function init() {
    const canvas = document.getElementById('sparkCanvas');
    if (!canvas) {
      // spark canvas removed — skip particle effect silently
      return;
    }
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Particles
    const particles = [];
    
    function Particle(x, y) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.x = x;
      this.y = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 1;
      this.life = 1;
      this.size = 3 + Math.random() * 5;
    }
    
    Particle.prototype.update = function() {
      this.vx *= 0.9;
      this.vy *= 0.9;
      this.vy += 0.15;
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 0.025;
    };
    
    Particle.prototype.draw = function(ctx) {
      if (this.life <= 0) return;
      ctx.globalAlpha = Math.max(0, this.life);
      // Dim/soft colors - pastel palette
      const colors = ['#a8d8f0', '#d4b5e8', '#f0c9d8', '#e8d7a0', '#d4f1d4'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Animation
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) particles.splice(i, 1);
      }
      
      requestAnimationFrame(animate);
    }
    animate();
    
    // Events
    document.addEventListener('mousemove', function(e) {
      for (let i = 0; i < 12; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    });
    
    console.log('Spark effect initialized');
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ----------------------
// Load site stats (fetch /api/stats)
// ----------------------
(function(){
  async function formatNumber(n){
    if (n >= 1000) return (n/1000).toFixed(1).replace(/\.0$/, '') + 'K+';
    return String(n);
  }

  async function loadStats(){
    try{
      const resp = await fetch('/api/stats');
      if(!resp.ok) throw new Error('Failed to fetch stats');
      const json = await resp.json();
      const fEl = document.getElementById('freelancerCount');
      const pEl = document.getElementById('projectCount');
      const sEl = document.getElementById('satisfactionCount');
      if(fEl) fEl.innerText = await formatNumber(json.freelancers || 0);
      if(pEl) pEl.innerText = await formatNumber(json.projects || 0);
      if(sEl) sEl.innerText = (json.satisfaction != null) ? (json.satisfaction + '%') : 'N/A';
    }catch(e){
      console.error('loadStats error', e);
    }
  }

  // Call on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStats);
  } else {
    loadStats();
  }
})();

>>>>>>> 96e5cb886491b9db5c213b48882848bcf97d800d
