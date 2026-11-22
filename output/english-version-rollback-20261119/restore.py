"""Restore exactly the files touched by the English task; preserve unrelated work.

Run without arguments to verify the snapshot. Run with --apply to restore it.
Stops before making changes if any task file has been edited since handoff.
"""
import hashlib
import json
from pathlib import Path
import shutil
import sys

snapshot = Path(__file__).resolve().parent
root = snapshot.parent.parent
manifest = json.loads((snapshot / 'manifest.json').read_text())
sha256 = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()
for name, expected in manifest['original_sha256'].items():
    if sha256(snapshot / 'originals' / name) != expected:
        raise SystemExit(f'Original snapshot has changed: {name}')
for name, override in manifest.get('rollback_overrides', {}).items():
    if sha256(snapshot / override['source']) != override['sha256']:
        raise SystemExit(f'Reviewed rollback target changed: {name}')
for name, expected in manifest['english_state_sha256'].items():
    file = root / name
    if not file.is_file() or sha256(file) != expected:
        raise SystemExit(f'Task file changed after snapshot: {name}. Review it before restoring.')
print('Snapshot verified. Original files and English additions match the recorded state.')
if sys.argv[1:] != ['--apply']:
    print('No files changed. Use --apply only when you want to reverse the English work.')
    raise SystemExit(0)
for name in manifest['original_files']:
    source = manifest.get('rollback_overrides', {}).get(name, {}).get('source')
    shutil.copyfile(snapshot / source if source else snapshot / 'originals' / name, root / name)
for name in manifest['english_added_files']:
    (root / name).unlink()
for name in ['images/icons/video-vines', 'en/js', 'en/css', 'en', 'translations', 'images/font-preview']:
    directory = root / name
    if directory.is_dir() and not any(directory.iterdir()):
        directory.rmdir()
print('Restored all original task files and removed only the listed English additions.')
print('Unrelated files and this rollback snapshot were preserved.')
