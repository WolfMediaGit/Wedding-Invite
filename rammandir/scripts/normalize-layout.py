#!/usr/bin/env python3
"""Turn the raw measurements in data/raw/*.json into the artboard files the app renders.

The Framer site serves a separate fixed-width artboard per breakpoint. Each raw file is
one artboard measured on rammandir.framer.website at its reference viewport, with all
entrance-animation start states removed. Two raw formats exist:
  * legacy  (mobile.json, desktop.json): {x, y, w, h, items:[{tx, ff, fs, lh, ...}]}
  * compact (the others):                {b:[x, y, w, h], i:[[tx, ff, fs, lh, color, ls, centred]]}

This script:
  * shifts x so 0 is the artboard's left edge (artboards are centred in the viewport),
  * makes every box a *visual* box; images and text bake in any static scale `k`,
    components keep `k` (their inner layout is drawn at w/k x h/k and scaled),
  * turns the six arch images into `card` layers (their text is drawn by the app),
  * fills in hero stacking order for the legacy mobile file,
  * gives every element a stable id.

Usage:  python3 scripts/normalize-layout.py
"""
import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
OUT = ROOT / "data"

# id: (raw file, design width, style, card base, viewport range [min, max])
ARTBOARDS = {
    "mobile":      ("mobile",      398,  "mobile",  "small",   (0, 429)),
    "mobile-wide": ("mobile-wide", 435,  "mobile",  "small",   (430, 767)),
    "tablet":      ("tablet",      846,  "mobile",  "tablet",  (768, 959)),
    "tablet-wide": ("tablet-wide", 975,  "mobile",  "tablet",  (960, 1279)),
    "laptop":      ("laptop",      1282, "desktop", "desktop", (1280, 1348)),
    "desktop":     ("desktop",     1515, "desktop", "desktop", (1349, 100000)),
}

GALLERY = {
    "mobile": {"width": 402, "height": 340, "view": 280, "wheel": 400, "wheelTop": 80, "card": 80},
    "desktop": {"width": 1515, "height": 760, "view": 660, "wheel": 1000, "wheelTop": 160, "card": 160},
}

HERO_Z = {
    "Sky Background": -1, "Sun": 6, "Flocking Birds": 2, "Mountain": 5, "Cloud": 6,
    "Temple": 9, "Corner Decoration": 9, "Waving Flag": 9, "Bells Frame": 9,
    "Hero Title — Akash": 7, "Hero Title — and": 7, "Hero Title — Drashti": 7,
    "Hanging Bell 1": 10, "Hanging Bell 2": 10, "Hanging Bell 3": 10, "Hanging Bell 4": 10,
}
INVITATION = re.compile(r"Ganpati|Shri Line|Parents|Label —|Invitation Line|Groom Name|Ampersand|Bride Name|Scroll Arrow")
RENAME = {"dont check my spelling": "Almost Time Heading", "In process / dont check my spelling": "Almost Time Heading"}
CARD_SRC = "TUkRvFIUDwblbb4eewkBlJzZwJw.png"


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def r1(v: float) -> float:
    return round(v * 10) / 10


def text_items(e, k):
    if "items" in e:  # legacy
        out = []
        for it in e["items"]:
            it = dict(it)
            it["tx"] = it["tx"].strip()
            out.append(it)
        return out
    out = []
    for tx, ff, fs, lh, c, ls, centred in e["i"]:
        it = {"tx": tx.strip(), "ff": ff, "fs": r1(fs * k), "lh": f"{r1(lh * k)}px" if isinstance(lh, (int, float)) else lh, "c": c}
        if ls:
            it["ls"] = f"{round(ls * k, 2)}px"
        if centred:
            it["ta"] = "center"
        out.append(it)
    return out


def build(aid):
    raw_name, width, style, card, vp = ARTBOARDS[aid]
    raw = json.loads((RAW / f"{raw_name}.json").read_text())
    left = (raw["vw"] - width) / 2
    out = {
        "id": aid, "style": style, "card": card, "width": width, "height": raw["H"],
        "refViewport": raw["vw"], "minViewport": vp[0], "maxViewport": vp[1],
        "gallery": raw.get("gallery") or GALLERY[style], "sections": [],
    }
    secs = sorted(raw["secs"], key=lambda s: s["n"])
    for s in secs:
        sid = slug(s["n"].split("—", 1)[1])
        sy, sh = (s["b"][1], s["b"][3]) if "b" in s else (s["y"], s["h"])
        sec = {"id": sid, "name": s["n"], "z": s["z"], "top": sy, "height": sh,
               "clip": s.get("clip", False), "bg": s.get("bg") or ("rgb(247, 232, 212)" if sid == "hero-invitation" else None),
               "elements": []}
        seen = {}
        for e in s["el"]:
            x, y, w, h = e["b"] if "b" in e else (e["x"], e["y"], e["w"], e["h"])
            k = e.get("k", 1)
            name = RENAME.get(e["n"] or "", e["n"] or "")
            t = e["t"]
            if aid == "mobile" and "k" in e:
                # legacy mobile file kept unscaled boxes for statically scaled layers
                cx, cy = x + w / 2, y + h / 2
                w, h = w * k, h * k
                x, y = cx - w / 2, cy - h / 2
            el = {"t": t, "n": name, "x": r1(x - left), "y": r1(y), "w": r1(w), "h": r1(h)}
            if t == "i" and e.get("src") == CARD_SRC and re.fullmatch(r"\d", name):
                el["t"] = "card"
            if e.get("src"):
                el["src"] = e["src"]
            fit = e.get("fit") or e.get("f")
            if fit and el["t"] in ("i", "card"):
                el["fit"] = fit
            if e.get("bg"):
                el["bg"] = e["bg"]
            if e.get("r"):
                el["r"] = e["r"]
            if t == "c" and k != 1:
                el["k"] = k
            if t == "t":
                items = text_items(e, k if "i" in e else 1)
                el["items"] = items
                lh = float(str(items[0]["lh"]).replace("px", "") or 0)
                if e.get("wrap") or (lh and len(items) * lh < h * 0.75):
                    el["wrap"] = True
            if "z" in e:
                el["z"] = e["z"]
            elif s["n"].startswith("1"):
                el["z"] = HERO_Z.get(name, 10 if INVITATION.search(name) else 0)
            else:
                el["z"] = 0
            base = slug(name) or el["t"]
            seen[base] = seen.get(base, 0) + 1
            el["id"] = base if seen[base] == 1 else f"{base}-{seen[base]}"
            sec["elements"].append(el)
        out["sections"].append(sec)
    return out


if __name__ == "__main__":
    index = []
    for aid in ARTBOARDS:
        data = build(aid)
        (OUT / f"{aid}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
        count = sum(len(s["elements"]) for s in data["sections"])
        index.append(aid)
        print(f"{aid:12s} {data['width']:>5}x{data['height']:<6} {data['minViewport']}-{data['maxViewport']}  {count} layers")
