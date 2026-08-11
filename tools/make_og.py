#!/usr/bin/env python3
"""Render the OG share card (1200x630) from HTML — v2: white gallery,
Space Grotesk, red pen. Art: tools/img_src/og_v2.png."""
import base64
import os
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
art = base64.b64encode(open(os.path.join(ROOT, "tools/img_src/og_v2.png"), "rb").read()).decode()
sg = base64.b64encode(open(os.path.join(ROOT, "public/fonts/spacegrotesk-latin.woff2"), "rb").read()).decode()
inter = base64.b64encode(open(os.path.join(ROOT, "public/fonts/inter-latin.woff2"), "rb").read()).decode()
mono = base64.b64encode(open(os.path.join(ROOT, "public/fonts/jetbrainsmono-latin.woff2"), "rb").read()).decode()

html = f"""<!doctype html><html><head><style>
@font-face {{ font-family: Space Grotesk; src: url(data:font/woff2;base64,{sg}); }}
@font-face {{ font-family: Inter; src: url(data:font/woff2;base64,{inter}); }}
@font-face {{ font-family: JetBrains Mono; src: url(data:font/woff2;base64,{mono}); }}
* {{ margin: 0; box-sizing: border-box; }}
body {{ width: 1200px; height: 630px; background: #fff; display: flex;
  font-family: Inter; overflow: hidden; }}
.left {{ flex: 1; padding: 64px 24px 56px 64px; display: flex; flex-direction: column; }}
.kicker {{ font-family: JetBrains Mono; font-size: 14px; letter-spacing: .14em;
  text-transform: uppercase; color: #E0362C; margin-bottom: 24px;
  display: flex; align-items: center; gap: 12px; }}
.kicker::before {{ content: ""; width: 26px; height: 2px; background: #E0362C; }}
h1 {{ font-family: Space Grotesk; font-size: 92px; font-weight: 560;
  letter-spacing: -0.035em; color: #0B0B0C; line-height: 0.98; }}
h1 .strike {{ position: relative; color: #9B9BA0; }}
h1 .strike::after {{ content: ""; position: absolute; left: -2px; right: -2px;
  top: 52%; height: 7px; background: #E0362C; border-radius: 4px; }}
h1 .red {{ color: #E0362C; }}
p {{ margin-top: 24px; font-size: 19px; line-height: 1.5; color: #5A5A5E; max-width: 560px; }}
.stats {{ margin-top: auto; display: flex; gap: 48px; }}
.stat .v {{ font-family: Space Grotesk; font-size: 38px; font-weight: 560;
  letter-spacing: -0.02em; color: #0B0B0C; }}
.stat .l {{ font-family: JetBrains Mono; font-size: 11.5px; color: #9B9BA0; margin-top: 6px; }}
.right {{ width: 440px; background: center/cover no-repeat url(data:image/png;base64,{art}); }}
</style></head><body>
<div class="left">
  <div class="kicker">AAAI 2027</div>
  <h1><span class="strike">Rejected.</span><br><span class="red">Revised.</span></h1>
  <p>AppliedScientist — an autonomous scientist and a memoryless AI reviewer,
     revising 30 rejected ICLR papers in a closed loop.</p>
  <div class="stats">
    <div class="stat"><div class="v">30</div><div class="l">ICLR papers</div></div>
    <div class="stat"><div class="v">+1.16</div><div class="l">mean score gain</div></div>
    <div class="stat"><div class="v">85.3%</div><div class="l">exec. weaknesses fixed</div></div>
  </div>
</div>
<div class="right"></div>
</body></html>"""

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1200, "height": 630})
    page.set_content(html, wait_until="networkidle")
    page.wait_for_timeout(700)
    tmp = os.path.join(ROOT, "tools/img_src/og-card-v2.png")
    page.screenshot(path=tmp)
    b.close()

from PIL import Image
im = Image.open(tmp).convert("RGB")
out = os.path.join(ROOT, "public/img/og-card.jpg")
im.save(out, quality=88, optimize=True)
print(out, os.path.getsize(out))
