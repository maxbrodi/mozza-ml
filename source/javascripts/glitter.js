/*
 * Particles Manager
 */
(function() {

  "use strict";

  var request = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(cb) {
    return setTimeout(cb, 30);
  };

  /* Convert hex to rgba */
  var toRGBA = function(hex, opacity) {
    var res = hex.replace("#", "");
    var bigint = parseInt(res, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    var a = opacity || 1;
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  };

  /* Returns a random number between min (inclusive) and max (exclusive) */
  var getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
  };

  /* Load other background image
  var image = new Image();
  image.src = 'http://media.blizzard.com/wow/media/fanart/fanart-1371-full.jpg';
  image.onload = function() {
    document.getElementsByTagName("CANVAS")[0].style.backgroundImage = 'url('+ this.src +')';
  };
  */

  var Particles = function(options) {
    var settings = {
      canvas: {
        id: "particles",
        fullscreen: true,
        width: window.innerWidth,
        height: window.innerHeight,
        opacity: false
      },
      particle: {
        color: {
          start: "#DDDDDD",/* toRGBA("#FF0000", '1.0'), */
          stop: false /* toRGBA("#FF6161", '1.0') */
        },
        count: 35,
        speed: {
          random: true,
          min: 1,
          /* used as default if random is false */
          max: 5
        },
        radius: {
          random: true,
          min: 1,
          /* used as default if random is false */
          max: 4
        }
      }
    };

    /* Over-write settings with options */
    if (typeof(options) === 'object') {
      if (typeof(options.fullscreen) !== 'undefined') {
        settings.canvas.fullscreen = options.fullscreen;
      }

      if (!settings.canvas.fullscreen) {
        settings.canvas.width = document.getElementById(settings.canvas.id).clientWidth;
        settings.canvas.height = document.getElementById(settings.canvas.id).clientHeight;
      }

      if (options.width !== undefined) {
        settings.canvas.fullscreen = false;
        settings.canvas.width = options.width;
      }

      if (options.height !== undefined) {
        settings.canvas.fullscreen = false;
        settings.canvas.height = options.height;
      }

      if (options.opacity !== undefined) {
        settings.canvas.opacity = options.opacity;
      }
    }

    /* Init canvas */
    var canvas = document.getElementById(settings.canvas.id);
    var ctx = canvas.getContext("2d");

    /* Set canvas settings (width, height, opacity...) */
    if (settings.canvas.width) {
      canvas.width = settings.canvas.width;
      canvas.style.width = settings.canvas.width + "px";
    }
    if (settings.canvas.height) {
      canvas.height = settings.canvas.height;
      canvas.style.height = settings.canvas.height + "px";
    }
    if (settings.canvas.opacity) {
      canvas.style.opacity = settings.canvas.opacity;
    }

    /* Lets create a function which will help us to create multiple particles */
    var create_particle = function() {
      /* Random position on the canvas */
      this.x = Math.random() * settings.canvas.width;
      this.y = Math.random() * settings.canvas.height;

      /* Lets add random velocity to each particle */
      if (settings.particle.speed.random) {
        this.vx = getRandomArbitrary(settings.particle.speed.min, settings.particle.speed.max);
        this.vy = getRandomArbitrary(settings.particle.speed.min, settings.particle.speed.max);
      } else {
        this.vx = settings.particle.speed.min;
        this.vy = settings.particle.speed.min;
      }

      /* Random color
      var r = Math.random()*255>>0;
      var g = Math.random()*255>>0;
      var b = Math.random()*255>>0;
      this.colorStart = "rgba("+r+", "+g+", "+b+", 0.5)";
      */

      /* Color */
      this.colorStart = settings.particle.color.start;
      this.colorStop = settings.particle.color.stop || settings.particle.color.start;

      /* Size */
      if (settings.particle.radius.random) {
        this.radius = getRandomArbitrary(settings.particle.radius.min, settings.particle.radius.max);
      } else {
        this.radius = settings.particle.radius.min;
      }
    };

    /* Lets animate the particle */
    var draw = function() {
      /* Clean-up */
      ctx.clearRect(0, 0, settings.canvas.width, settings.canvas.height);

      /* Set background image */
      /*if (typeof(imageBG) !== 'undefined') {
        ctx.drawImage(imageBG, 0, 0);
        ctx.rect(0, 0, settings.canvas.width, settings.canvas.height);
      }*/

      /* Lets draw particles from the array now */
      for (var t = 0; t < particles.length; t++) {
        var p = particles[t];

        ctx.beginPath();

        /* Particle colors */
        var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.colorStart);
        gradient.addColorStop(1, p.colorStop);

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, Math.PI * 2, false);
        ctx.fill();

        /* Lets use the velocity now */
        p.x += p.vx;
        p.y += p.vy;

        /* Prevent the particles from moving out of the canvas */
        if (p.x < -50) p.x = settings.canvas.width + 50;
        if (p.y < -50) p.y = settings.canvas.height + 50;
        if (p.x > settings.canvas.width + 50) p.x = -50;
        if (p.y > settings.canvas.height + 50) p.y = -50;
      }

      request(draw);
    };

    /* Lets create an array of particles */
    var particles = [];
    for (var i = 0; i < settings.particle.count; i++) {
      /* This will add <num> particles to the array with random positions */
      particles.push(new create_particle);
    }

    draw();
  };

  var resizeTimeout;

  function resizeThrottler() {
    /* ignore resize events as long as an actualResizeHandler execution is in the queue */
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        particlesHandler(); /* The actual resize handler */
      }, 66);
    }
  }

  function particlesHandler() {
    /*Particles({
      fullscreen: false,
      opacity: 0.4,
      width: 800,
      height: 500
    });*/
    Particles();
  }

  /* Load when DOM is ready */
  //window.addEventListener('load', actualResizeHandler, false)
  document.addEventListener("DOMContentLoaded", particlesHandler, false);

  /* Reload when window size changes */
  window.addEventListener('resize', resizeThrottler, false);

})();
