/* ============================================================
   main.js — de spellus en alle schermen
   Ontworpen tegen faalangst:
   - geen fout, geen timer, geen score
   - een mis-tik = zacht duwtje + hulp; de knop verdwijnt zodat het lukt
   - de edelsteen kleurt pas als het juist is; vooruitgang gaat alleen vooruit
   Elke speler (Lea/Mama/Papa) houdt een eigen verzameling bij.
   ============================================================ */

(function () {
  const cfg = RB.config;
  let state = RB.storage.load();
  let player = state.players[state.currentPlayer]; // verwijzing naar de actieve speler

  // huidige oefening + hoe vaak er al mis-getikt is (niet zichtbaar voor het kind)
  let current = null;
  let wrongTries = 0;   // foute tikken op de huidige vraag (voor hulp/uitfaden)
  let roundWrong = 0;   // totaal fouten in deze regenboog-ronde
  let locked = false; // even blokkeren tijdens de fonkel-animatie
  let focusedReward = null; // welk cadeautje in de tracker getoond wordt (null = volgende)

  const $ = (id) => document.getElementById(id);

  // opslaan: altijd lokaal (snel/offline) + na een korte pauze naar de cloud
  let cloudTimer = null;
  function save() {
    RB.storage.save(state);
    if (RB.cloud.user) {
      clearTimeout(cloudTimer);
      cloudTimer = setTimeout(() => RB.cloud.save(state).catch(() => {}), 1200);
    }
  }
  function flushCloud() {
    if (RB.cloud.user) RB.cloud.save(state).catch(() => {});
  }
  // totaal aantal diamanten over alle spelers (voor de "rijkste wint"-samenvoeging)
  function grandTotal(s) {
    let n = 0;
    for (const name of cfg.PLAYERS) {
      if (!s.players[name]) continue;
      const g = s.players[name].gems;
      n += g[1] + g[2] + g[3] + g[4] + g[5] + (g[6] || 0);
    }
    return n;
  }

  const screens = {
    login: $("login-screen"),
    start: $("start-screen"),
    game: $("game-screen"),
    celebrate: $("celebrate-screen"),
    treasure: $("treasure-screen"),
    settings: $("settings-screen"),
  };

  function show(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function setPlayer(name) {
    state.currentPlayer = name;
    player = state.players[name];
    save();
  }

  // Vult alle vaste illustraties in (iconen, mascottes, kist-lagen, achtergrond)
  function initArt() {
    document.querySelectorAll("[data-icon]").forEach((el) => {
      el.innerHTML = RB.art.icon(el.getAttribute("data-icon"));
    });
    $("mascot-start").innerHTML = RB.art.mascot("peek");
    $("login-mascot").innerHTML = RB.art.mascot("peek");
    $("reward-mascot").innerHTML = RB.art.mascot("happy");
    $("chest-mini").innerHTML = RB.art.chestClosed();
    document.querySelectorAll(".chest-back").forEach((e) => (e.innerHTML = RB.art.chestBack()));
    document.querySelectorAll(".chest-front").forEach((e) => (e.innerHTML = RB.art.chestFront()));
    document.querySelectorAll(".chest-lid").forEach((e) => (e.innerHTML = RB.art.chestLid()));
    document.querySelector(".blobs").innerHTML = RB.art.blobs();
  }

  // Totaal aantal diamanten van een speler (alle niveaus samen)
  function total(p) {
    const g = p.gems;
    return g[1] + g[2] + g[3] + g[4] + g[5] + (g[6] || 0);
  }

  // Punten: elke diamant telt als 1 (niet gewogen per niveau)
  function points(p) {
    return total(p);
  }

  // Hoeveel diamanten van kleur c al opgebruikt zijn door eerdere cadeautjes
  function consumedBefore(index, c) {
    let s = 0;
    for (let j = 0; j < index; j++) {
      const n = cfg.REWARDS[j].need;
      if (n && n[c]) s += n[c];
    }
    return s;
  }

  // Beschikbare diamanten van kleur c voor het cadeautje op deze plek (na eerder verbruik)
  function availFor(index, c, p) {
    return Math.max(0, (p.gems[c] || 0) - consumedBefore(index, c));
  }

  // Is aan de eis van een cadeautje voldaan? (diamanten per kleur, in volgorde verbruikt)
  function rewardMet(r, p) {
    const i = cfg.REWARDS.indexOf(r);
    if (r.points && points(p) < r.points) return false;
    if (r.need) for (const c of Object.keys(r.need)) if (availFor(i, c, p) < r.need[c]) return false;
    return true;
  }

  // Hoeveel cadeautjes al behaald zijn (in volgorde: frietjes eerst)
  function rewardsReached(p) {
    let n = 0;
    for (const r of cfg.REWARDS) {
      if (rewardMet(r, p)) n++;
      else break;
    }
    return n;
  }

  // Het eerstvolgende (nog niet behaalde) cadeautje
  function nextReward(p) {
    return cfg.REWARDS[rewardsReached(p)] || null;
  }

  // Voortgang als duidelijke regels: "6/10 blauwe diamanten" (voor score board + detail)
  function rewardProgressHTML(r) {
    const line = (color, have, target, labelText) => {
      const pct = Math.max(0, Math.min(100, (have / target) * 100));
      return `
        <div class="need-line">
          <span class="need-gem lr3">${RB.gems.svg(color, false)}</span>
          <div class="need-info">
            <div class="need-top"><b>${Math.min(have, target)}/${target}</b> ${labelText}</div>
            <div class="tracker-bar"><span class="tracker-fill" style="width:${pct}%;background:${color}"></span></div>
          </div>
        </div>`;
    };
    if (r.need) {
      const i = cfg.REWARDS.indexOf(r);
      return Object.keys(r.need)
        .map((l) => line(cfg.LEVEL_GEM[l].color, availFor(i, l, player), r.need[l], `${cfg.LEVEL_GEM[l].label} diamanten`))
        .join("");
    }
    return line("#F3C233", points(player), r.points, "punten");
  }

  // Compacte samenvatting voor de lijst (bv. "blauwe 6/10 · groene 3/10")
  function summaryText(r) {
    if (r.need) {
      const i = cfg.REWARDS.indexOf(r);
      return Object.keys(r.need)
        .map((l) => `${cfg.LEVEL_GEM[l].label} ${Math.min(availFor(i, l, player), r.need[l])}/${r.need[l]}`)
        .join(" · ");
    }
    return `${Math.min(points(player), r.points)}/${r.points} punten`;
  }

  // Voortgang van een cadeautje in het score board (klik op een cadeautje → wisselt hier)
  function renderTracker(el) {
    const r = focusedReward || nextReward(player);
    if (!r) {
      el.innerHTML = `<div class="tracker-done">Alle cadeautjes gehaald! <span class="tracker-treat">${RB.art.treat("gift")}</span></div>`;
      return;
    }
    const met = rewardMet(r, player);
    el.innerHTML = `
      <div class="tracker-head"><span class="tracker-treat">${RB.art.treat(r.art)}</span><b>${r.name}</b></div>
      ${met ? `<p class="tracker-met">Dit heb je al behaald!</p>` : ""}
      ${rewardProgressHTML(r)}`;
  }

  function refreshRewards() {
    renderTracker($("treasure-tracker"));
    renderRewardsList($("treasure-rewards"));
  }

  // Stapel diamanten in een kist; grootte/kleur/glans per niveau (gedeeld door schatkist + feest)
  function renderPile(el, gems) {
    let html = "", n = 0;
    for (const lvl of [1, 2, 3, 4, 5, 6]) {
      const lg = cfg.LEVEL_GEM[lvl];
      for (let i = 0; i < (gems[lvl] || 0) && n < 36; i++, n++) {
        html += `<span class="mini-gem g${lvl}${lg.shiny ? " shiny" : ""}">${RB.gems.svg(lg.color, false)}</span>`;
      }
    }
    el.innerHTML = html;
  }

  // Deksel dicht → even wachten → open met animatie + geluidje
  function openLid(id, delay) {
    const lid = $(id);
    if (!lid) return;
    lid.classList.remove("open");
    void lid.offsetWidth;
    setTimeout(() => {
      lid.classList.add("open");
      RB.audio.open();
    }, delay);
  }

  // ---------- START SCHERM ----------
  function renderStart() {
    renderPlayers();
    renderStartLevels();
    $("hello-line").textContent = "Kies je spel:";
    const t = total(player);
    $("chest-count-label").textContent =
      t > 0 ? `${t} ${t === 1 ? "diamant" : "diamanten"}` : "Nog geen diamanten";
  }

  // Wie speelt er? (Lea / Mama / Papa) met eigen resultaten
  function renderPlayers() {
    const row = $("player-row");
    row.innerHTML = "";
    cfg.PLAYERS.forEach((name) => {
      const b = document.createElement("button");
      b.className = "player-chip" + (name === state.currentPlayer ? " selected" : "");
      b.innerHTML = `<span class="avatar">${RB.art.avatar(name)}</span><span class="player-name">${name}</span>`;
      b.addEventListener("click", () => {
        setPlayer(name);
        RB.audio.unlock();
        RB.audio.setEnabled(state.soundOn);
        RB.audio.speak(name);
        renderStart();
      });
      row.appendChild(b);
    });
  }

  // De 4 niveaus als tekeningetjes; tikken = voorlezen + starten
  function renderStartLevels() {
    const list = $("start-levels");
    list.innerHTML = "";
    // kinderen zien enkel hun eigen niveaus; ouders (niet in de lijst) zien alles
    const allowed = cfg.PLAYER_LEVELS[state.currentPlayer] || cfg.LEVELS.map((l) => l.id);
    if (!allowed.includes(player.level)) {
      player.level = allowed[0];
      save();
    }
    cfg.LEVELS.filter((lv) => allowed.includes(lv.id)).forEach((lv) => {
      const b = document.createElement("button");
      b.className = "level-card" + (lv.id === player.level ? " selected" : "");
      const lg = cfg.LEVEL_GEM[lv.id];
      b.innerHTML = `<span class="level-pic">${RB.art.levelPic(lv.id)}</span>
        <span class="level-text"><b>${lv.name}</b><small>${lv.desc}</small></span>
        <span class="level-reward" title="Je verdient ${lg.label} diamanten (niveau ${lv.id})">
          <span class="lr-gem lr${lv.id}">${RB.gems.svg(lg.color, false)}</span>
          <small>niveau ${lv.id}</small>
        </span>`;
      b.addEventListener("click", () => chooseLevel(lv));
      list.appendChild(b);
    });
  }

  function chooseLevel(lv) {
    player.level = lv.id;
    save();
    RB.audio.unlock();
    RB.audio.setEnabled(state.soundOn);
    RB.audio.speak(lv.name); // Lea hoort wat ze koos (ze leest nog niet)
    renderStartLevels();
    setTimeout(startGame, 700); // even de naam laten horen, dan starten
  }

  // ---------- SPEL ----------
  function startGame() {
    // een nieuwe oefenreeks begint altijd met een lege regenboog
    player.collected = 0;
    roundWrong = 0;
    save();
    show("game");
    RB.rainbow.render($("rainbow"), 0);
    nextExercise();
  }

  function nextExercise() {
    locked = false;
    wrongTries = 0;
    current = RB.exercises.generate(player.level);

    $("instruction").textContent = current.instruction;
    $("question-main").innerHTML = current.mainHTML;
    $("help-area").innerHTML = "";
    $("help-area").classList.remove("show");
    $("encourage").textContent = "";
    $("encourage").className = "encourage";

    renderOptions(current.options);
    setTimeout(() => RB.audio.speak(current.speakText), 250);
  }

  function renderOptions(options) {
    const box = $("options");
    box.innerHTML = "";
    options.forEach((val) => {
      const btn = document.createElement("button");
      btn.className = "opt";
      btn.textContent = val;
      btn.addEventListener("click", () => onAnswer(val, btn));
      box.appendChild(btn);
    });
  }

  function onAnswer(val, btn) {
    if (locked) return;
    if (val === current.answer) handleCorrect(btn);
    else handleWrong(btn);
  }

  function handleWrong(btn) {
    wrongTries++;
    roundWrong++;
    RB.audio.soft();

    // knop wiebelt zachtjes en gaat dan rustig 'uit'
    btn.classList.add("wiggle-wrong");
    setTimeout(() => {
      btn.classList.remove("wiggle-wrong");
      btn.classList.add("faded");
      btn.disabled = true;
    }, 400);

    // meer dan 2 fouten in de hele ronde → de regenboog begint opnieuw (schatkist blijft)
    if (roundWrong >= cfg.MAX_WRONG) {
      loseRainbow();
      return;
    }

    const nudge = cfg.NUDGE[Math.floor(Math.random() * cfg.NUDGE.length)];
    const enc = $("encourage");
    enc.textContent = nudge;
    enc.className = "encourage nudge";
    showHelp();
  }

  // Regenboog verloren: zacht bericht, alleen de huidige regenboog reset
  function loseRainbow() {
    locked = true;
    const enc = $("encourage");
    enc.textContent = "Oei! Deze regenboog begint opnieuw. Jij kan het!";
    enc.className = "encourage nudge";
    setTimeout(() => RB.audio.speak("Oei! We beginnen deze regenboog opnieuw. Jij kan het!"), 250);

    player.collected = 0;
    roundWrong = 0;
    save();
    $("rainbow").classList.add("lost");
    setTimeout(() => {
      $("rainbow").classList.remove("lost");
      RB.rainbow.render($("rainbow"), 0);
      nextExercise();
    }, 1900);
  }

  function showHelp() {
    const help = $("help-area");
    let html = "";
    if (current.help) html += RB.exercises.helpHTML(current.help);
    if (current.helpText) html += `<p class="help-text">${current.helpText}</p>`;
    help.innerHTML = html;
    help.classList.add("show");
    if (current.repeatText) setTimeout(() => RB.audio.speak(current.repeatText), 200);
  }

  function handleCorrect(btn) {
    locked = true;
    btn.classList.add("chosen-right");
    RB.audio.correct(); // vrolijk deuntje

    const praise = cfg.PRAISE[Math.floor(Math.random() * cfg.PRAISE.length)];
    const enc = $("encourage");
    enc.textContent = praise;
    enc.className = "encourage praise";
    setTimeout(() => RB.audio.speak(praise), 260); // na het deuntje

    // kleur de volgende regenboogboog erbij
    const index = player.collected;
    player.collected++;
    save();
    RB.rainbow.fill($("rainbow"), index);

    setTimeout(() => {
      if (player.collected >= cfg.DIAMONDS.length) celebrate();
      else nextExercise();
    }, 1300);
  }

  // ---------- FEEST ----------
  function celebrate() {
    const lvl = player.level;
    const lg = cfg.LEVEL_GEM[lvl];

    RB.rainbow.render($("celebrate-rainbow"), cfg.DIAMONDS.length);

    // de kist toont eerst de diamanten van vóór deze beloning
    renderPile($("reward-pile"), player.gems);

    // verdien de niveau-diamant (groter/blinkender bij een moeilijker niveau)
    player.gems[lvl]++;
    player.collected = 0;
    save();
    flushCloud(); // een verdiende diamant meteen naar de cloud

    const fly = $("reward-fly");
    fly.innerHTML = RB.gems.svg(lg.color, false);
    fly.style.width = Math.round(40 * lg.size) + "px";
    fly.style.height = Math.round(44 * lg.size) + "px";
    fly.classList.toggle("shiny", !!lg.shiny);

    const t = total(player);
    $("treasure-total").textContent = `Nu heb je ${t} ${t === 1 ? "diamant" : "diamanten"} in je schatkist.`;

    // animatieklassen resetten
    fly.classList.remove("fly");
    $("reward-mascot").classList.remove("give");
    $("reward-chest").classList.remove("bounce");

    show("celebrate");
    RB.audio.fanfare();
    setTimeout(() => RB.audio.speak("Je regenboog is af! Kijk, je krijgt een diamant voor je schatkist."), 500);
    dropConfetti();

    // 1) kist gaat open  2) figuurtje geeft  3) diamant vliegt erin  4) blijft liggen
    openLid("reward-lid", 200);
    void $("reward-fly").offsetWidth;
    requestAnimationFrame(() => {
      setTimeout(() => $("reward-mascot").classList.add("give"), 900);
      setTimeout(() => $("reward-fly").classList.add("fly"), 1250);
      setTimeout(() => {
        renderPile($("reward-pile"), player.gems); // nu mét de nieuwe diamant
        $("reward-chest").classList.add("bounce");
        maybeShowPrize(); // heeft ze net genoeg punten voor een cadeautje?
      }, 2050);
    });
  }

  // Toont het cadeautje-feest als er een puntendrempel gehaald is
  function maybeShowPrize() {
    const reached = rewardsReached(player);
    if (reached <= player.seenRewards) return;
    const prize = cfg.REWARDS[player.seenRewards];
    player.seenRewards++;
    save();

    $("prize-art").innerHTML = RB.art.treat(prize.art);
    $("prize-name").textContent = prize.name;
    $("prize-pop").classList.add("show");
    setTimeout(() => RB.audio.speak("Hoera! Je hebt een cadeautje verdiend: " + prize.name), 300);
  }

  // ---------- SCHATKIST ----------
  function showTreasure() {
    renderTreasure();
    show("treasure");
    openLid("treasure-lid", 400); // dicht → gaat vanzelf open → diamanten zichtbaar
  }

  function renderTreasure() {
    focusedReward = null; // begin bij het eerstvolgende cadeautje
    $("treasure-title").textContent = "Schatkist van " + state.currentPlayer;
    renderPile($("gem-pile"), player.gems);
    const t = total(player);
    $("treasure-count").textContent =
      t > 0
        ? `${t} ${t === 1 ? "diamant" : "diamanten"}`
        : "Maak een regenboog af om je eerste diamant te verdienen.";
    renderTracker($("treasure-tracker"));
    renderRewardsList($("treasure-rewards"));
  }

  // De cadeautjes-ladder (wat je al hebt en nog kan verdienen)
  function renderRewardsList(el) {
    const earnedCount = rewardsReached(player);
    const focusIdx = focusedReward ? cfg.REWARDS.indexOf(focusedReward) : earnedCount;
    el.innerHTML = "";
    cfg.REWARDS.forEach((r, i) => {
      const isEarned = i < earnedCount;
      const isNext = i === earnedCount;
      const row = document.createElement("div");
      row.className =
        "reward-row" + (isEarned ? " earned" : isNext ? " next" : " locked") + (i === focusIdx ? " focused" : "");
      const small = isEarned ? "Behaald!" : summaryText(r);
      row.innerHTML = `
        <span class="reward-row-icon">${RB.art.treat(r.art)}</span>
        <span class="reward-row-text"><b>${r.name}</b><small>${small}</small></span>
        <span class="reward-row-state">${isEarned ? RB.art.icon("check") : ""}</span>`;
      row.addEventListener("click", () => {
        focusedReward = r;
        refreshRewards();
        $("treasure-tracker").scrollIntoView({ block: "nearest" });
      });
      el.appendChild(row);
    });
  }

  function dropConfetti() {
    const box = $("confetti");
    box.innerHTML = "";
    const colors = RB.config.DIAMONDS;
    for (let i = 0; i < 40; i++) {
      const c = document.createElement("span");
      c.className = "confetti-bit";
      const useGem = Math.random() < 0.5;
      const col = colors[Math.floor(Math.random() * colors.length)].color;
      c.innerHTML = useGem ? RB.gems.mini(col) : RB.art.sparkle(Math.random() < 0.5 ? "#FFD36A" : col);
      c.style.left = Math.random() * 100 + "%";
      c.style.animationDelay = Math.random() * 0.8 + "s";
      c.style.animationDuration = 1.8 + Math.random() * 1.4 + "s";
      const size = 16 + Math.random() * 20;
      c.style.width = size + "px";
      c.style.height = size + "px";
      box.appendChild(c);
    }
  }

  // ---------- INSTELLINGEN (mama & papa) ----------
  function renderSettings() {
    $("sound-toggle").checked = state.soundOn;
    $("reset-player-name").textContent = state.currentPlayer;
  }

  // ---------- LOGIN / CLOUD ----------
  function showLogin() {
    show("login");
    setTimeout(() => $("login-email").focus(), 100);
  }

  function showLoginError(msg) {
    $("login-error").textContent = msg;
    const card = document.querySelector(".login-card");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
  }

  async function tryLogin() {
    const email = $("login-email").value.trim();
    const password = $("login-password").value;
    if (!email || !password) return showLoginError("Vul je e-mail en wachtwoord in.");
    const btn = $("login-btn");
    btn.disabled = true;
    $("login-error").textContent = "Bezig met inloggen…";
    const res = await RB.cloud.signIn(email, password);
    btn.disabled = false;
    if (res.ok) {
      $("login-password").value = "";
      $("login-error").textContent = "";
      await enterApp();
    } else {
      showLoginError("Inloggen niet gelukt. Controleer je e-mail en wachtwoord.");
    }
  }

  // beginscore toepassen: waardeert op tot minstens de seed-waarden (nooit minder)
  function applySeed(s, seed) {
    for (const name of Object.keys(seed)) {
      if (!s.players[name]) continue;
      const sp = seed[name];
      if (sp.gems) for (const k of [1, 2, 3, 4, 5]) s.players[name].gems[k] = Math.max(s.players[name].gems[k] || 0, sp.gems[k] || 0);
    }
  }

  // markeer reeds behaalde cadeautjes als "gezien" (geen oude pop-ups)
  function reconcileSeen() {
    for (const name of cfg.PLAYERS) {
      const p = state.players[name];
      p.seenRewards = Math.max(p.seenRewards || 0, rewardsReached(p));
    }
  }

  // na het inloggen: laad uit de cloud (rijkste wint, tegen verlies), seed indien nodig, start
  async function enterApp() {
    let remote = null;
    try {
      remote = await RB.cloud.load();
    } catch (e) {}

    if (remote) {
      const remoteState = RB.storage.normalize(remote);
      if (grandTotal(remoteState) >= grandTotal(state)) state = remoteState;
    }

    // eenmalige seed (per SEED_VERSION): waardeert Lea op tot minstens 10/10/10
    if (cfg.SEED && (state.seedVersion || 0) < cfg.SEED_VERSION) {
      applySeed(state, cfg.SEED);
      state.seedVersion = cfg.SEED_VERSION;
    }

    if (!state.players[state.currentPlayer]) state.currentPlayer = "Lea";
    player = state.players[state.currentPlayer];
    reconcileSeen();
    RB.storage.save(state);
    try {
      await RB.cloud.save(state); // de (ge-seede) stand meteen naar de cloud
    } catch (e) {}
    renderStart();
    show("start");
  }

  // ---------- KNOPPEN AAN ELKAAR KOPPELEN ----------
  function goHome() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    renderStart();
    show("start");
  }

  function wire() {
    $("login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      tryLogin();
    });

    // het huisje staat op elke pagina
    document.querySelectorAll(".home-btn").forEach((b) => b.addEventListener("click", goHome));

    $("repeat-sound").addEventListener("click", () => {
      if (current) RB.audio.speak(current.repeatText || current.speakText);
    });

    $("again-btn").addEventListener("click", () => startGame());
    $("celebrate-treasure").addEventListener("click", () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
      showTreasure();
    });

    $("open-treasure").addEventListener("click", () => {
      RB.audio.unlock();
      RB.audio.setEnabled(state.soundOn);
      showTreasure();
    });
    $("treasure-play").addEventListener("click", () => {
      RB.audio.unlock();
      RB.audio.setEnabled(state.soundOn);
      startGame();
    });

    $("prize-ok").addEventListener("click", () => {
      $("prize-pop").classList.remove("show");
    });

    $("open-settings").addEventListener("click", () => {
      renderSettings();
      show("settings");
    });
    $("close-settings").addEventListener("click", () => {
      renderStart();
      show("start");
    });

    $("sound-toggle").addEventListener("change", (e) => {
      state.soundOn = e.target.checked;
      RB.audio.setEnabled(state.soundOn);
      save();
    });

    $("reset-player").addEventListener("click", () => {
      if (confirm(`De verzameling van ${state.currentPlayer} wissen?`)) {
        state.players[state.currentPlayer] = RB.storage._player();
        player = state.players[state.currentPlayer];
        save();
        renderSettings();
      }
    });

    $("reset-all").addEventListener("click", () => {
      if (confirm("Alle verzamelingen van iedereen wissen?")) {
        const keepSound = state.soundOn;
        state = RB.storage._default();
        state.soundOn = keepSound;
        setPlayer(state.currentPlayer);
        save();
        renderSettings();
      }
    });

    $("logout-btn").addEventListener("click", async () => {
      if (confirm("Uitloggen?")) {
        flushCloud();
        await RB.cloud.signOut();
        showLogin();
      }
    });

    // bij het sluiten/wegklikken: laatste stand nog naar de cloud
    window.addEventListener("pagehide", flushCloud);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushCloud();
    });
  }

  // ---------- START ----------
  async function boot() {
    RB.cloud.init();
    initArt();
    wire();
    const user = RB.cloud.available() ? await RB.cloud.currentUser() : null;
    if (user) await enterApp();
    else showLogin();
  }
  boot();
})();
