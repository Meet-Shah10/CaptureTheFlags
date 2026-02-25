"""
CTF Flag 5 — EXIF Metadata Embedder (Harder Version v2)
Embeds:
  - Red herring in ImageDescription (misleads beginners)
  - Hex-encoded flag in UserComment (harder than Base64 — no padding clue)

Requirements:
    pip install piexif Pillow
Usage:
    python embed_exif.py
"""

import piexif
from PIL import Image

IMAGE_IN = "landmark.jpg"  # source landmark image
IMAGE_OUT = "challenge.jpg"  # output image given to participants
FLAG = "ARTIMAS{deeper_than_you_think}"


def embed_flag(src: str, dst: str, flag: str) -> None:
    img = Image.open(src)

    # Hex-encode the flag for the UserComment field
    flag_hex = flag.encode("utf-8").hex()

    # UserComment requires an 8-byte charset prefix
    user_comment = b"ASCII\x00\x00\x00" + flag_hex.encode("ascii")

    # Build EXIF dict
    exif_dict = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}}

    # Red herring in ImageDescription — looks like real metadata
    exif_dict["0th"][
        piexif.ImageIFD.ImageDescription
    ] = b"2026 IEEE Conference -- Dubai"

    # Additional red herring in Artist field
    exif_dict["0th"][piexif.ImageIFD.Artist] = b"ctf_admin@artimas.org"

    # Real flag hidden in UserComment as hex (less obvious than Base64)
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
    print(f"[+] Artist           : ctf_admin@artimas.org  (red herring)")
    print(f"[+] UserComment      : {flag_hex}  (hex-encoded flag)")
    print(f"[+] Decoded flag     : {flag}")


if __name__ == "__main__":
    embed_flag(IMAGE_IN, IMAGE_OUT, FLAG)
