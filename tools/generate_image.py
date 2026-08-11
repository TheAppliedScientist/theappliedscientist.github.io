#!/usr/bin/env python3
"""
Generate the site's few art-directed images with gpt-image-2.

Usage:
  export OPENAI_API_KEY=...          # or put it in website/.env
  python3 tools/generate_image.py <name>

Names: og, hero

Images are written to website/public/img/. The API key is read from the
environment or website/.env and is never written into the site.
"""
import base64
import os
import sys

from openai import OpenAI

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "img")
os.makedirs(OUT, exist_ok=True)

env_path = os.path.join(ROOT, ".env")
if os.path.exists(env_path):
    for line in open(env_path):
        if "=" in line and not line.startswith("#"):
            k, v = line.strip().split("=", 1)
            os.environ.setdefault(k, v)

STYLE = """
Premium studio-render aesthetic for a frontier AI research lab website.
Pure white background, soft even studio light, subtle soft shadows.
Sculptural, physical, confident. One bold accent of red (#E0362C).
No text, no letters, no people, no clutter. Lots of negative space.
The image should feel like a still from a DeepMind project page.
"""

PROMPTS = {
    "og": (
        "A tall sculptural stack of white paper sheets on a white studio "
        "background, the top sheet torn slightly, one thick stroke of red "
        "ink crossing it horizontally like a proofreader's strikethrough. "
        "Soft shadows, physical paper texture, minimal, bold. " + STYLE
    ),
    "hero": (
        "An oversized red proofreader's caret mark and a single long red "
        "strikethrough stroke rendered as physical red acrylic objects "
        "resting on a neat stack of white manuscript pages, white studio "
        "background, soft shadows, minimal sculptural composition, "
        "slightly elevated camera angle. " + STYLE
    ),
}

SIZES = {"og": "1536x1024", "hero": "2048x1152"}


def main():
    name = sys.argv[1]
    client = OpenAI()
    result = client.images.generate(
        model="gpt-image-2",
        prompt=PROMPTS[name],
        size=SIZES[name],
        quality="high",
    )
    img = base64.b64decode(result.data[0].b64_json)
    path = os.path.join(OUT, f"{name}.png")
    with open(path, "wb") as f:
        f.write(img)
    print(path, len(img))


if __name__ == "__main__":
    main()
