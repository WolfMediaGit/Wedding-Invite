#!/usr/bin/env python3
"""Render an artboard JSON as a flat static HTML page (no animation, no JS widgets).

Used to check the measured layout against the live Framer site screenshot-for-screenshot.
Widgets are drawn as labelled outlines. Output: stdout.

Usage: python3 scripts/static-preview.py mobile|desktop > preview.html
"""
import json, sys, pathlib, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG = "https://framerusercontent.com/images/"
FONTS = {
    "Gotham Book": "4y04scLej0VIDnfiTUaHmR9kJ8", "Gotham Light": "tDHgE1HIlQZDKKTmmqw6GznA8AA",
    "Gotham Medium": "s9K7gd62GoiEFlvMdmFDczcSwA", "IvyOra Display Medium": "4Jgqn7NsDO77QsxaQyfnM0ICLY4",
    "IvyOra Display Bold": "VBd98BPo7gIkQI9U4PQ8dyWGdw", "IvyOra Display Regular": "SEQP8hnAhgJcZlHjxip9s3uuKg",
    "Miofarin Regular": "BMjg1YByjbhOVDynKUorFYRCk", "Brother Signature Regular": "WWjETWwBUpECorvxciFxrUEZg",
}


def main(name):
    d = json.loads((ROOT / "data" / f"{name}.json").read_text())
    W = d["width"]
    css = "".join(f"@font-face{{font-family:'{f}';src:url(https://framerusercontent.com/assets/{h}.woff2)}}" for f, h in FONTS.items())
    css += ("*{margin:0;box-sizing:border-box}body{overflow-x:hidden;background:#fff}"
            f"#ab{{position:relative;width:{W}px;height:{d['height']}px;left:50%;margin-left:-{W/2}px}}"
            ".s{position:absolute;left:0;width:100%}.e{position:absolute}.e img{width:100%;height:100%;display:block}"
            ".t p{white-space:nowrap;text-align:center}.w{outline:1px dashed red;color:red;font:10px sans-serif}")
    out = [f"<style>{css}</style><div id=ab>"]
    for s in d["sections"]:
        st = f"top:{s['top']}px;height:{s['height']}px;z-index:{s['z']};" + ("overflow:clip;" if s["clip"] else "") + (f"background:{s['bg']};" if s.get("bg") else "")
        out.append(f"<div class=s style='{st}'>")
        for e in s["elements"]:
            box = f"left:{e['x']}px;top:{e['y']-s['top']}px;width:{e['w']}px;height:{e['h']}px;z-index:{e['z']};"
            if e.get("r"):
                box += f"transform:rotate({e['r']}deg);"
            if e["t"] in ("i", "card"):
                out.append(f"<div class=e style='{box}'><img src='{IMG}{e['src']}' style='object-fit:{e.get('fit','cover')}'></div>")
            elif e["t"] == "t":
                ps = "".join(
                    f"<p style=\"font-family:'{i['ff']}';font-size:{i['fs']}px;line-height:{i['lh']};color:{i['c']};"
                    f"letter-spacing:{i.get('ls','normal')};{'white-space:normal;' if e.get('wrap') else ''}\">{html.escape(i['tx'])}</p>"
                    for i in e["items"])
                out.append(f"<div class='e t' style='{box}'>{ps}</div>")
            elif e["t"] == "b":
                out.append(f"<div class=e style='{box}background:{e.get('bg','transparent')}'></div>")
            else:
                src = f"<img src='{IMG}{e['src']}' style='object-fit:contain'>" if e.get("src") else ""
                out.append(f"<div class='e w' style='{box}'>{src}{html.escape(e['n'])}</div>")
        out.append("</div>")
    out.append("</div>")
    print("".join(out))


if __name__ == "__main__":
    main(sys.argv[1])
