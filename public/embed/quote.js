/*!
 * Instant Quote by M Studio (mlinx.studio) - v1.0.0
 *
 * A quote calculator that drops into any website: WordPress, Wix,
 * Squarespace, Shopify, Webflow or plain HTML. Visitors pick a service, set
 * the size, see a price range, and send their details. The business gets
 * the lead.
 *
 * Install:
 *
 *   <div data-mstudio-quote>
 *     <script type="application/json">
 *       {
 *         "business": "Ledgeview Lawn & Garden",
 *         "color": "#1d4ed8",
 *         "email": "you@yourbusiness.com",
 *         "services": [
 *           { "name": "Spring cleanup", "base": 150, "perUnit": 60, "unit": "quarter acre", "min": 1, "max": 12, "start": 2 }
 *         ],
 *         "extras": [ { "name": "Haul away debris", "price": 40 } ]
 *       }
 *     </script>
 *   </div>
 *   <script src="https://mlinx.studio/embed/quote.js" async></script>
 *
 * Where the lead goes, first match wins:
 *   "site":     a key M Studio set up for you. Leads are emailed by
 *               mlinx.studio to the address on file. Nothing about the
 *               address is in the page.
 *   "endpoint": your own form handler (Formspree, Basin, Zapier webhook,
 *               your server). Receives a JSON POST.
 *   "email":    opens the visitor's email app with the quote filled in.
 *   "demo":     true shows the confirmation without sending anything.
 *
 * Optional: "range": [0.9, 1.15] (low/high multipliers), "currency": "$",
 * "title", "button", "note" (shown under the price).
 */
(function () {
  "use strict";

  var VERSION = "1.0.0";
  var RELAY = "https://mlinx.studio/api/widget-lead";

  function money(n, cur) {
    return (cur || "$") + Math.round(n).toLocaleString("en-US");
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function validColor(c) {
    return typeof c === "string" && /^#[0-9a-f]{3,8}$/i.test(c) ? c : "#1d4ed8";
  }

  function num(v, d) {
    var n = Number(v);
    return isFinite(n) ? n : d;
  }

  function readConfig(host) {
    var tag = host.querySelector('script[type="application/json"]');
    var cfg = {};
    if (tag) {
      try { cfg = JSON.parse(tag.textContent || "{}"); } catch (e) {
        console.error("[Instant Quote] The settings block is not valid JSON.", e);
      }
    }
    // Simple settings may also be data attributes on the container.
    ["business", "email", "endpoint", "site", "color", "title", "button", "currency"].forEach(function (k) {
      var v = host.getAttribute("data-" + k);
      if (v && cfg[k] == null) cfg[k] = v;
    });
    if (host.getAttribute("data-demo") === "true") cfg.demo = true;

    var services = Array.isArray(cfg.services) ? cfg.services : [];
    cfg.services = services
      .filter(function (s) { return s && s.name; })
      .map(function (s) {
        var min = Math.max(0, num(s.min, 1));
        var max = Math.max(min, num(s.max, 10));
        return {
          name: String(s.name),
          base: Math.max(0, num(s.base, 0)),
          perUnit: Math.max(0, num(s.perUnit, 0)),
          unit: s.unit ? String(s.unit) : "",
          min: min,
          max: max,
          step: Math.max(0.01, num(s.step, 1)),
          start: Math.min(max, Math.max(min, num(s.start, min))),
        };
      });
    cfg.extras = (Array.isArray(cfg.extras) ? cfg.extras : [])
      .filter(function (x) { return x && x.name; })
      .map(function (x) { return { name: String(x.name), price: Math.max(0, num(x.price, 0)) }; });
    var r = Array.isArray(cfg.range) ? cfg.range : [0.9, 1.15];
    cfg.range = [num(r[0], 0.9), num(r[1], 1.15)];
    cfg.color = validColor(cfg.color);
    return cfg;
  }

  var CSS = [
    ":host{all:initial;display:block;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#111827;--c:#1d4ed8}",
    "*{box-sizing:border-box}",
    ".w{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px;max-width:520px;box-shadow:0 1px 2px rgba(0,0,0,.04)}",
    "h3{margin:0 0 14px;font-size:18px;line-height:1.3;font-weight:650}",
    ".lbl{display:block;font-size:13px;font-weight:600;margin:14px 0 6px;color:#374151}",
    ".svc{display:flex;flex-wrap:wrap;gap:8px}",
    ".svc button{font:inherit;font-size:14px;min-height:38px;padding:0 14px;border-radius:999px;border:1px solid #d1d5db;background:#fff;color:#111827;cursor:pointer}",
    ".svc button[aria-pressed=true]{background:var(--c);border-color:var(--c);color:#fff}",
    ".row{display:flex;align-items:center;gap:12px}",
    "input[type=range]{flex:1;accent-color:var(--c);min-height:32px}",
    ".sz{min-width:96px;text-align:right;font-size:14px;font-variant-numeric:tabular-nums}",
    ".ex{display:grid;gap:6px}",
    ".ex label{display:flex;align-items:center;gap:8px;font-size:14px;min-height:32px;cursor:pointer}",
    ".ex input{width:18px;height:18px;accent-color:var(--c)}",
    ".ex span.p{margin-left:auto;color:#6b7280;font-variant-numeric:tabular-nums}",
    ".est{margin-top:16px;padding:14px 16px;border-radius:10px;background:#f3f4f6}",
    ".est .k{font-size:12.5px;color:#4b5563}",
    ".est .v{font-size:26px;font-weight:700;letter-spacing:-.01em;font-variant-numeric:tabular-nums;margin-top:2px}",
    ".est .n{font-size:12.5px;color:#4b5563;margin-top:4px}",
    ".f{display:grid;gap:10px;margin-top:16px}",
    ".f input,.f textarea{font:inherit;font-size:15px;width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:#111827}",
    ".f textarea{min-height:72px;resize:vertical}",
    ".go{font:inherit;font-size:15px;font-weight:650;min-height:44px;border:0;border-radius:10px;background:var(--c);color:#fff;cursor:pointer}",
    ".go[disabled]{opacity:.6;cursor:default}",
    "button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid var(--c);outline-offset:2px}",
    ".err{color:#b91c1c;font-size:13.5px;margin:0}",
    ".ok{padding:6px 0}",
    ".ok b{display:block;font-size:17px;margin-bottom:6px}",
    ".ok p{margin:0;font-size:14.5px;color:#374151;line-height:1.5}",
    ".by{margin-top:12px;font-size:11.5px;color:#9ca3af}",
    ".by a{color:inherit}",
    ".hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}",
    ".sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}",
  ].join("");

  function mount(host) {
    if (host.__mstudioQuote) return;
    host.__mstudioQuote = true;
    var cfg = readConfig(host);
    var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
    if (!cfg.services.length) {
      root.innerHTML = "<style>" + CSS + "</style><div class='w'><p class='err'>Instant Quote: add at least one service in the settings.</p></div>";
      return;
    }

    var state = { i: 0, size: cfg.services[0].start, extras: {}, sent: false };
    var uid = "mq" + Math.random().toString(36).slice(2, 8);

    function quote() {
      var s = cfg.services[state.i];
      var core = s.base + s.perUnit * state.size;
      var extras = cfg.extras.reduce(function (t, x, j) { return t + (state.extras[j] ? x.price : 0); }, 0);
      return { low: core * cfg.range[0] + extras, high: core * cfg.range[1] + extras };
    }

    function sizeText(s, n) {
      if (!s.unit) return String(n);
      return n + " " + s.unit + (n === 1 ? "" : "s");
    }

    function render() {
      var s = cfg.services[state.i];
      var q = quote();
      var html = "<style>" + CSS + "</style><div class='w' style='--c:" + cfg.color + "'>";
      if (state.sent) {
        html += "<div class='ok' role='status'><b>" + esc(state.sent) + "</b><p>" +
          esc(cfg.demo ? "This is a demo, so nothing was sent. On your site, this lead lands in your inbox with the service, size and price range." :
            (cfg.business || "We") + " will get back to you soon.") + "</p></div>";
      } else {
        html += "<h3>" + esc(cfg.title || "Get an instant estimate") + "</h3>";
        html += "<span class='lbl' id='" + uid + "s'>Service</span><div class='svc' role='group' aria-labelledby='" + uid + "s'>";
        cfg.services.forEach(function (x, j) {
          html += "<button type='button' data-svc='" + j + "' aria-pressed='" + (j === state.i) + "'>" + esc(x.name) + "</button>";
        });
        html += "</div>";
        if (s.perUnit > 0) {
          html += "<label class='lbl' for='" + uid + "r'>How much" + (s.unit ? " (" + esc(s.unit) + "s)" : "") + "</label>" +
            "<div class='row'><input id='" + uid + "r' type='range' min='" + s.min + "' max='" + s.max + "' step='" + s.step + "' value='" + state.size + "'>" +
            "<span class='sz' aria-hidden='true'>" + esc(sizeText(s, state.size)) + "</span></div>";
        }
        if (cfg.extras.length) {
          html += "<span class='lbl'>Add-ons</span><div class='ex'>";
          cfg.extras.forEach(function (x, j) {
            html += "<label><input type='checkbox' data-ex='" + j + "'" + (state.extras[j] ? " checked" : "") + ">" + esc(x.name) +
              "<span class='p'>+" + money(x.price, cfg.currency) + "</span></label>";
          });
          html += "</div>";
        }
        html += "<div class='est' aria-live='polite'><div class='k'>Estimated price</div><div class='v'>" +
          money(q.low, cfg.currency) + " \u2013 " + money(q.high, cfg.currency) + "</div>" +
          "<div class='n'>" + esc(cfg.note || "A guide, not a final price. Confirmed after a quick look.") + "</div></div>";
        html += "<form class='f' novalidate>" +
          "<label class='sr' for='" + uid + "n'>Your name</label><input id='" + uid + "n' name='name' autocomplete='name' placeholder='Your name' required>" +
          "<label class='sr' for='" + uid + "c'>Email or phone</label><input id='" + uid + "c' name='contact' autocomplete='email' placeholder='Email or phone' required>" +
          "<label class='sr' for='" + uid + "m'>Anything we should know</label><textarea id='" + uid + "m' name='message' placeholder='Address, timing, anything we should know (optional)'></textarea>" +
          "<div class='hp' aria-hidden='true'><input name='company_website' tabindex='-1' autocomplete='off'></div>" +
          "<p class='err' role='alert' hidden></p>" +
          "<button class='go' type='submit'>" + esc(cfg.button || "Send me this quote") + "</button></form>";
      }
      html += "<div class='by'>Instant Quote by <a href='https://mlinx.studio/plugins' target='_blank' rel='noopener'>M Studio</a></div></div>";
      root.innerHTML = html;
      wire();
    }

    function update() {
      // Light refresh so the slider keeps focus while dragging.
      var s = cfg.services[state.i];
      var q = quote();
      var v = root.querySelector(".est .v");
      if (v) v.textContent = money(q.low, cfg.currency) + " \u2013 " + money(q.high, cfg.currency);
      var sz = root.querySelector(".sz");
      if (sz) sz.textContent = sizeText(s, state.size);
      var r = root.querySelector("input[type=range]");
      if (r) r.setAttribute("aria-valuetext", sizeText(s, state.size));
    }

    function payload(form) {
      var s = cfg.services[state.i];
      var q = quote();
      return {
        widget: "instant-quote",
        version: VERSION,
        site: cfg.site || undefined,
        business: cfg.business || "",
        page: location.href,
        service: s.name,
        size: s.perUnit > 0 ? sizeText(s, state.size) : "",
        extras: cfg.extras.filter(function (_, j) { return state.extras[j]; }).map(function (x) { return x.name; }),
        estimate: money(q.low, cfg.currency) + " \u2013 " + money(q.high, cfg.currency),
        name: form.name.value.trim(),
        contact: form.contact.value.trim(),
        message: form.message.value.trim(),
        company_website: form.company_website.value,
      };
    }

    function summary(p) {
      return [
        "Instant quote request",
        "",
        "Service: " + p.service,
        p.size ? "Size: " + p.size : "",
        p.extras.length ? "Add-ons: " + p.extras.join(", ") : "",
        "Estimate: " + p.estimate,
        "",
        "Name: " + p.name,
        "Contact: " + p.contact,
        p.message ? "Notes: " + p.message : "",
        "",
        "Sent from " + p.page,
      ].filter(function (l, i, a) { return l !== "" || (a[i - 1] !== ""); }).join("\n");
    }

    function send(form) {
      var err = root.querySelector(".err");
      var btn = root.querySelector(".go");
      var p = payload(form);
      if (!p.name || !p.contact) {
        err.textContent = "Add your name and an email or phone number so we can reach you.";
        err.hidden = false;
        (p.name ? form.contact : form.name).focus();
        return;
      }
      err.hidden = true;

      if (cfg.demo) { state.sent = "Got it, " + p.name.split(" ")[0] + "."; render(); return; }

      var url = cfg.site ? RELAY : cfg.endpoint;
      if (!url) {
        if (cfg.email) {
          var subject = "Quote request: " + p.service + " (" + p.estimate + ")";
          location.href = "mailto:" + encodeURIComponent(cfg.email) + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(summary(p));
          state.sent = "Your email app should open with the quote filled in.";
          render();
        } else {
          err.textContent = "This form is not connected yet. Please call or email instead.";
          err.hidden = false;
        }
        return;
      }

      btn.disabled = true;
      btn.textContent = "Sending\u2026";
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.assign({ summary: summary(p) }, p)),
      })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          state.sent = "Thanks, " + p.name.split(" ")[0] + ". Your quote request is in.";
          render();
          host.dispatchEvent(new CustomEvent("mstudio:quote-sent", { bubbles: true, detail: { service: p.service, estimate: p.estimate } }));
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = cfg.button || "Send me this quote";
          err.textContent = "That did not go through. Please try again, or call or email instead.";
          err.hidden = false;
        });
    }

    function wire() {
      Array.prototype.forEach.call(root.querySelectorAll("[data-svc]"), function (b) {
        b.addEventListener("click", function () {
          state.i = Number(b.getAttribute("data-svc"));
          state.size = cfg.services[state.i].start;
          render();
          var again = root.querySelector("[data-svc='" + state.i + "']");
          if (again) again.focus();
        });
      });
      var r = root.querySelector("input[type=range]");
      if (r) r.addEventListener("input", function () { state.size = Number(r.value); update(); });
      Array.prototype.forEach.call(root.querySelectorAll("[data-ex]"), function (c) {
        c.addEventListener("change", function () { state.extras[c.getAttribute("data-ex")] = c.checked; update(); });
      });
      var f = root.querySelector("form");
      if (f) f.addEventListener("submit", function (e) { e.preventDefault(); send(f); });
      update();
    }

    render();
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-mstudio-quote]"), mount);
  }

  window.MStudioQuote = { version: VERSION, mount: mount, init: init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
