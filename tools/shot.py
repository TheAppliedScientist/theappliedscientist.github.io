#!/usr/bin/env python3
"""Screenshot helper — real scrolling so in-view animations fire."""
import sys
from playwright.sync_api import sync_playwright

url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3111/"
out = sys.argv[2] if len(sys.argv) > 2 else "/tmp/shot.png"
width = int(sys.argv[3]) if len(sys.argv) > 3 else 1440
full = len(sys.argv) > 4 and sys.argv[4] == "full"

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": width, "height": 1000})
    page.goto(url, wait_until="networkidle")
    # scroll through the page slowly so every whileInView fires
    page.evaluate(
        """async () => {
            const h = document.body.scrollHeight;
            for (let y = 0; y <= h; y += 200) {
                window.scrollTo(0, y);
                await new Promise(r => setTimeout(r, 150));
            }
            window.scrollTo(0, 0);
            await new Promise(r => setTimeout(r, 800));
        }"""
    )
    page.wait_for_timeout(1500)
    page.screenshot(path=out, full_page=full)
    b.close()
print(out)
