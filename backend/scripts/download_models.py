from __future__ import annotations

import sys
from pathlib import Path
import requests
from tqdm import tqdm

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

CANDIDATE_SOURCES = [
    {
        "name": "wav2lip_gan.pth (community mirror: rippertnt/wav2lip)",
        "url": "https://huggingface.co/rippertnt/wav2lip/resolve/main/checkpoints/wav2lip_gan.pth",
        "dest": MODELS_DIR / "wav2lip_gan.pth",
        "min_size_mb": 100,
    },
    {
        "name": "wav2lip.pth (community mirror: camenduru/Wav2Lip)",
        "url": "https://huggingface.co/camenduru/Wav2Lip/resolve/main/checkpoints/wav2lip.pth",
        "dest": MODELS_DIR / "wav2lip.pth",
        "min_size_mb": 100,
    },
]

def _download_with_progress(url: str, dest: Path, min_size_mb: float, timeout: int = 30) -> bool:
    try:
        with requests.get(url, stream=True, timeout=timeout, allow_redirects=True) as resp:
            resp.raise_for_status()
            content_type = resp.headers.get("Content-Type", "")
            if "text/html" in content_type:
                print(f"  [SKIP] {url} returned HTML (likely auth wall or expired link).")
                return False

            total = int(resp.headers.get("Content-Length", 0))
            dest.parent.mkdir(parents=True, exist_ok=True)
            tmp_dest = dest.with_suffix(dest.suffix + ".part")

            with open(tmp_dest, "wb") as f, tqdm(
                total=total, unit="B", unit_scale=True, desc=dest.name, disable=total == 0
            ) as bar:
                for chunk in resp.iter_content(chunk_size=1024 * 1024):
                    if chunk:
                        f.write(chunk)
                        bar.update(len(chunk))

        size_mb = tmp_dest.stat().st_size / (1024 * 1024)
        if size_mb < min_size_mb:
            print(f"  [SKIP] Downloaded file is only {size_mb:.1f}MB (expected >= {min_size_mb}MB).")
            tmp_dest.unlink(missing_ok=True)
            return False

        tmp_dest.rename(dest)
        print(f"  [OK] Saved {dest} ({size_mb:.1f}MB)")
        return True

    except requests.exceptions.RequestException as exc:
        print(f"  [FAIL] {url} -- {exc}")
        return False

def main() -> int:
    print(f"Model directory: {MODELS_DIR.resolve()}")
    print("Attempting to fetch community-mirrored checkpoints...\n")

    any_success = False
    for source in CANDIDATE_SOURCES:
        if source["dest"].exists():
            print(f"[SKIP] {source['dest'].name} already present.")
            any_success = True
            continue
        print(f"Trying: {source['name']}")
        if _download_with_progress(source["url"], source["dest"], source["min_size_mb"]):
            any_success = True

    print()
    if any_success:
        print("At least one checkpoint is present in models/.")
    else:
        print("No weights could be downloaded. Running in MockSyncNet fallback mode.")

    return 0

if __name__ == "__main__":
    sys.exit(main())
