#!/usr/bin/env python3
"""Turn a transparent, single-colour logo master into a clean SVG path."""

from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


def contours_to_path(mask: np.ndarray, offset_x: int, offset_y: int) -> str:
    contours, _ = cv2.findContours(mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_TC89_KCOS)
    paths: list[str] = []
    for contour in contours:
        if abs(cv2.contourArea(contour)) < 7:
            continue
        perimeter = cv2.arcLength(contour, True)
        simplified = cv2.approxPolyDP(contour, max(0.45, perimeter * 0.00038), True)
        points = simplified.reshape(-1, 2)
        if len(points) < 3:
            continue
        commands = [f"M{points[0][0] + offset_x} {points[0][1] + offset_y}"]
        commands.extend(f"L{x + offset_x} {y + offset_y}" for x, y in points[1:])
        commands.append("Z")
        paths.append(" ".join(commands))
    return " ".join(paths)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--fill", default="#173f33")
    parser.add_argument("--crop", help="x,y,width,height")
    parser.add_argument(
        "--min-component-area",
        type=int,
        default=0,
        help="Discard disconnected marks smaller than this area (useful for the compact wordmark)",
    )
    parser.add_argument("--title", default="La Rampa")
    args = parser.parse_args()

    rgba = np.array(Image.open(args.input).convert("RGBA"))
    alpha = rgba[:, :, 3]
    mask = np.where(alpha > 72, 255, 0).astype(np.uint8)

    if args.min_component_area:
        count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
        filtered = np.zeros_like(mask)
        for component in range(1, count):
            if stats[component, cv2.CC_STAT_AREA] >= args.min_component_area:
                filtered[labels == component] = 255
        mask = filtered

    if args.crop:
        x, y, width, height = (int(value) for value in args.crop.split(","))
        mask = mask[y:y + height, x:x + width]
        offset_x, offset_y = x, y
        view_box = f"{x} {y} {width} {height}"
    else:
        ys, xs = np.where(mask > 0)
        margin = 18
        x0 = max(0, int(xs.min()) - margin)
        y0 = max(0, int(ys.min()) - margin)
        x1 = min(mask.shape[1], int(xs.max()) + margin)
        y1 = min(mask.shape[0], int(ys.max()) + margin)
        mask = mask[y0:y1, x0:x1]
        offset_x, offset_y = x0, y0
        view_box = f"{x0} {y0} {x1 - x0} {y1 - y0}"

    path_data = contours_to_path(mask, offset_x, offset_y)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" role="img" aria-labelledby="title desc">
  <title id="title">{args.title}</title>
  <desc id="desc">Logotipo vectorial de Cafetería Coffee Shop La Rampa</desc>
  <path fill="{args.fill}" fill-rule="evenodd" d="{path_data}"/>
</svg>\n'''
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    main()
