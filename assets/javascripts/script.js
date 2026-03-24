function runWhenDomReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

runWhenDomReady(function () {
  var siteHeader = document.querySelector("body > header");
  if (!siteHeader) {
    return;
  }
  var scrollThresholdPx = 16;
  function syncNavScrollBackground() {
    siteHeader.classList.toggle(
      "is-scrolled",
      window.scrollY > scrollThresholdPx
    );
  }
  syncNavScrollBackground();
  window.addEventListener("scroll", syncNavScrollBackground, { passive: true });
});

runWhenDomReady(function () {
  if (typeof TimelineMax === "undefined" || !document.querySelector("#header .name")) {
    return;
  }

  window.requestAnimationFrame(function () {
    var tl = new TimelineMax();
    // <header> = fixed nav bar; #header = home hero block (different elements).
    tl.from("header", 0.6, { top: -60, autoAlpha: 0, ease: Power1.easeInOut });
    tl.from(".name", 0.6, { top: -60, autoAlpha: 0, ease: Power1.easeInOut });
    tl.from(".tag", 0.6, { autoAlpha: 0, ease: Power1.easeInOut }, "-=.3");
    tl.from(
      ".mainpic",
      0.6,
      { x: 100, autoAlpha: 0, ease: Power1.easeInOut },
      "-=.8"
    );
  });
});

if (typeof anime !== "undefined") {
  if (document.querySelector(".web")) {
    anime({
      targets: ".web",
      d: [
        {
          value:
            "M821.255,1307.734c33.767,123.526-138.126-15.708-138.126,79.633s36.352,234.652,96.367,135.2,93.947-39.059,150.845-39.059-83.694-79.52-8.935-156.308S821.255,1307.734,821.255,1307.734Z",
        },
        {
          value:
            "M821.255,1307.734c-56.624,75.02-138.126-15.708-138.126,79.633s39.435,195.3,138.126,166.079-4.34-136.861,52.558-136.861,116.87-19.991,67.662-92.266S821.255,1307.734,821.255,1307.734Z",
        },
      ],
      easing: "easeOutQuad",
      duration: 4000,
      loop: true,
    });
  }
  if (document.querySelector(".photo")) {
    anime({
      targets: ".photo",
      d: [
        {
          value:
            "M1198.454,3221.1s16.512,62.088,73.457,17.154,79.984-93.162,112.339-17.154-66.862,57.488-36.808,100.55-202.243,129.628-148.987,26.789c-17.4-74.89-154.275-46.707-97.33-101S1198.454,3221.1,1198.454,3221.1Z",
        },
        {
          value:
            "M1176.849,3180.007s.184,86.028,57.129,41.094,199.307-54.3,150.271,0-126.544,44.934-96.49,88-96.49,161.014-134.453,65.529c-17.4-74.89-112.308-99.23-55.363-153.525S1176.849,3180.007,1176.849,3180.007Z",
        },
      ],
      easing: "easeOutQuad",
      duration: 2000,
      loop: true,
    });
  }
}

(function () {
  var navToggle = document.querySelector(".menu-toggle");
  var navBox = document.querySelector("header .box");
  if (!navToggle || !navBox) {
    return;
  }
  var hamburger = {
    navToggle: navToggle,
    nav: navBox,
    doToggle: function () {
      this.navToggle.classList.toggle("active");
      this.nav.classList.toggle("active");
    },
  };
  navToggle.addEventListener("click", function (e) {
    hamburger.doToggle(e);
  });
  navBox.addEventListener("click", function (e) {
    hamburger.doToggle(e);
  });
})();

(function () {
  var container = document.querySelector(".hover-container");
  var inner = document.querySelector(".profile");
  if (!container || !inner) {
    return;
  }

  var mouse = {
    _x: 0,
    _y: 0,
    x: 0,
    y: 0,
    updatePosition: function (event) {
      var e = event || window.event;
      this.x = e.clientX - this._x;
      this.y = (e.clientY - this._y) * -1;
    },
    setOrigin: function (e) {
      this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
      this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
    },
  };

  mouse.setOrigin(container);

  var counter = 0;
  var refreshRate = 10;
  var isTimeToUpdate = function () {
    return counter++ % refreshRate === 0;
  };

  var updateTransformStyle = function (x, y) {
    var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
    inner.style.transform = style;
    inner.style.webkitTransform = style;
    inner.style.mozTranform = style;
    inner.style.msTransform = style;
    inner.style.oTransform = style;
  };

  var update = function (event) {
    mouse.updatePosition(event);
    updateTransformStyle(
      (mouse.y / inner.offsetHeight / 2).toFixed(2),
      (mouse.x / inner.offsetWidth / 2).toFixed(2)
    );
  };

  container.onmousemove = function (event) {
    if (isTimeToUpdate()) {
      update(event);
    }
  };
  container.onmouseleave = function () {
    inner.style = "";
  };
  container.onmouseenter = function (event) {
    update(event);
  };
})();
