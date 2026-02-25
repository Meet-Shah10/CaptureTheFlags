"""
CTF Flag 5 — EXIF Metadata Embedder (Harder Version)
Embeds:
  - Red herring in ImageDescription (misleads beginners)
  - Base64-encoded flag in UserComment (the real clue)

Requirements:
    pip install piexif Pillow
Usage:
    python embed_exif.py
"""

import piexif
import base64
from PIL import Image

IMAGE_IN = "landmark.jpg"  # source landmark image
IMAGE_OUT = "challenge.jpg"  # output image given to participants
FLAG = "ARTIMAS{deeper_than_you_think}"


def embed_flag(src: str, dst: str, flag: str) -> None:
    img = Image.open(src)

    # Base64-encode the flag for the UserComment field
    flag_b64 = base64.b64encode(flag.encode("utf-8"))

    # UserComment requires an 8-byte charset prefix
    user_comment = b"ASCII\x00\x00\x00" + flag_b64

    # Build EXIF dict
    exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}}

    # Red herring in ImageDescription — looks like real metadata
    exif_dict["0th"][
        piexif.ImageIFD.ImageDescription
    ] = b"2026 IEEE Conference -- Dubai"

    # Real flag hidden in UserComment (less obvious field)
    exif_dict["Exif"][piexif.ExifIFD.UserComment] = user_comment

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

    print(f"[+] challenge.jpg written successfully")
    print(f"[+] ImageDescription : 2026 IEEE Conference -- Dubai  (red herring)")
    print(f"[+] UserComment      : {flag_b64.decode()}  (Base64-encoded flag)")
    print(f"[+] Decoded flag     : {flag}")


if __name__ == "__main__":
    embed_flag(IMAGE_IN, IMAGE_OUT, FLAG)
