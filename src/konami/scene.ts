import css from "./scene.css?inline";
import sky from "./sky.svg?raw";
import far from "./far.svg?raw";
import mid from "./mid.svg?raw";
import near from "./near.svg?raw";
import puffArt from "./puff.svg?raw";
import runnerUrl from "./runner.gif?url";

// Pixels per second per unit of sprite scale. The gallop cycle is 11
// frames at 60 ms; slower than this the feet skate, faster they slip.
const RUN_SPEED = 150;
// Fraction of the stage width, from the left, where the sprite stops.
const STOP = 0.15;
const HOLD_MS = 3000;
// Mirrors the min-width at which scene.css doubles .konami-sprite.
const WIDE = "(min-width: 48rem)";

const ENDS = [
  "animationend",
  "animationcancel",
  "transitionend",
  "transitioncancel",
];

export async function play(stage: HTMLElement): Promise<void> {
  const ctrl = new AbortController();
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") ctrl.abort();
  };
  document.addEventListener("keydown", onKey);
  try {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await still(stage, ctrl.signal);
    } else {
      await run(stage, ctrl.signal);
    }
  } finally {
    document.removeEventListener("keydown", onKey);
  }
}

function flat(name: string, art: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = `konami-flat konami-flat--${name}`;
  el.innerHTML = art;
  return el;
}

// DOM order is paint order: the near flat passes in front of the sprite
// and the puff, and the floor, when there is one, is the stage lip.
function build(stage: HTMLElement) {
  const style = document.createElement("style");
  style.textContent = css;
  const skyFlat = flat("sky", sky);
  const nearFlat = flat("near", near);
  const puff = document.createElement("div");
  puff.className = "konami-puff";
  puff.innerHTML = puffArt;
  const floor = stage.querySelector<HTMLElement>(".konami-floor");
  stage.replaceChildren(
    style,
    skyFlat,
    flat("far", far),
    flat("mid", mid),
    puff,
    nearFlat,
    ...(floor ? [floor] : []),
  );
  return { skyFlat, nearFlat, puff, floor };
}

// animation: none (the reduced-motion block, a user stylesheet) fires
// no end event, so an element with nothing running resolves at once.
function settled(el: Element, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted || el.getAnimations().length === 0) {
      resolve();
      return;
    }
    function finish() {
      for (const type of ENDS) el.removeEventListener(type, onEnd);
      signal?.removeEventListener("abort", finish);
      resolve();
    }
    function onEnd(e: Event) {
      if (e.target === el) finish();
    }
    for (const type of ENDS) el.addEventListener(type, onEnd);
    signal?.addEventListener("abort", finish);
  });
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

async function run(stage: HTMLElement, signal: AbortSignal): Promise<void> {
  const { skyFlat, nearFlat, puff, floor } = build(stage);
  const sprite = document.createElement("img");
  sprite.className = "konami-sprite";
  sprite.alt = "";
  sprite.src = runnerUrl;
  puff.before(sprite);
  const loaded = sprite.decode().then(
    () => true,
    () => false,
  );

  const scale = matchMedia(WIDE).matches ? 2 : 1;
  const travel = stage.clientWidth * (1 - STOP);
  stage.style.setProperty("--konami-travel", `${travel}px`);
  stage.style.setProperty(
    "--konami-run",
    `${Math.round((travel / (RUN_SPEED * scale)) * 1000)}ms`,
  );

  // The floor's draw began in Konami.astro before this module existed,
  // so its finished promise, not an end event, is what can be awaited.
  await Promise.all(
    (floor?.getAnimations() ?? []).map((a) =>
      a.finished.catch(() => undefined),
    ),
  );

  if (!signal.aborted) {
    stage.classList.add("is-in");
    await settled(nearFlat, signal);
  }
  if (!signal.aborted && (await loaded)) {
    stage.classList.add("is-run");
    await settled(sprite, signal);
  }
  if (stage.classList.contains("is-run")) {
    const r = sprite.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    puff.style.left = `${r.left - s.left + r.width / 2}px`;
    puff.style.top = `${r.top - s.top + r.height / 2}px`;
    puff.style.width = `${r.height}px`;
    sprite.remove();
    stage.classList.add("is-puff");
    await settled(puff);
  } else {
    sprite.remove();
  }

  stage.classList.add("is-out");
  const leaving = [settled(skyFlat)];
  if (floor) {
    floor.style.transformOrigin = "right";
    const wipe = floor.animate(
      [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
      { duration: 600, delay: 1200, easing: "ease-in", fill: "forwards" },
    );
    leaving.push(
      wipe.finished.then(
        () => undefined,
        () => undefined,
      ),
    );
  }
  await Promise.all(leaving);
}

async function still(stage: HTMLElement, signal: AbortSignal): Promise<void> {
  const { puff } = build(stage);
  const img = new Image();
  img.src = runnerUrl;
  const loaded = await img.decode().then(
    () => true,
    () => false,
  );
  if (loaded) {
    // Canvas draws an animated image's first frame and nothing after.
    const canvas = document.createElement("canvas");
    canvas.className = "konami-sprite";
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")?.drawImage(img, 0, 0);
    canvas.style.left = `${STOP * 100}%`;
    puff.before(canvas);
  }
  // A transition needs a computed style from before the class flips,
  // and nothing else forces one between the stage's insertion and here.
  stage.getBoundingClientRect();
  stage.classList.add("is-on");
  await settled(stage);
  await wait(HOLD_MS, signal);
  stage.classList.remove("is-on");
  await settled(stage);
}
