"""
CTF Flag 5 — EXIF Metadata Embedder
Embeds the flag into the ImageDescription EXIF field of a JPEG image.

Requirements:
    pip install piexif Pillow
Usage:
    python embed_exif.py
"""

import piexif
from PIL import Image

IMAGE_IN  = "landmark.jpg"   # source landmark image
IMAGE_OUT = "challenge.jpg"  # output image given to participants
FLAG      = "ARTIMAS{location_identified_correctly}"

def embed_flag(src: str, dst: str, flag: str) -> None:
    img = Image.open(src)

    # Build a fresh EXIF dict and inject flag into ImageDescription (tag 0x010E)
    exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}}
    exif_dict["0th"][piexif.ImageIFD.ImageDescription] = flag.encode("utf-8")

    # Preserve any existing EXIF and merge
    try:
        existing = piexif.load(img.info.get("exif", b""))
        for ifd in ("0th", "Exif", "GPS", "1st"):
            existing[ifd].update(exif_dict.get(ifd, {}))
        exif_dict = existing
    except Exception:
        pass  # No existing EXIF — use the fresh dict

    exif_bytes = piexif.dump(exif_dict)
    img.save(dst, "jpeg", exif=exif_bytes, quality=95)
    print(f"[+] Flag embedded successfully -> {dst}")
    print(f"[+] Field : ImageDescription (EXIF tag 0x010E)")
    print(f"[+] Value : {flag}")


if __name__ == "__main__":
    embed_flag(IMAGE_IN, IMAGE_OUT, FLAG)
