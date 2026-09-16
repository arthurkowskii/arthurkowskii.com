#!/usr/bin/env python3
"""
Génère le CV d'Arthur depuis cv/cv.yaml.

Sorties (dans cv/out/ par défaut) :
  - CV_Arthur_Kowskii_Croquebois_Technical_Sound_Designer.pdf  (ATS : une colonne, texte réel)
  - CV_Arthur_Kowskii_Croquebois_Technical_Sound_Designer.txt  (pour les formulaires web)
  - CV_Arthur_Kowskii_Croquebois_Technical_Sound_Designer.docx (pour les portails qui refusent le PDF)

Usage :
    python3 scripts/build-cv.py              # rend dans cv/out/
    python3 scripts/build-cv.py --publish    # + copie le PDF dans public/ pour le site
    python3 scripts/build-cv.py --check      # rend puis vérifie la couche texte (pdftotext)
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape

ROOT = Path(__file__).resolve().parent.parent
CV_DIR = ROOT / "cv"
OUT_DIR = CV_DIR / "out"
YAML_PATH = CV_DIR / "cv.yaml"
TEMPLATE = "cv.html.jinja"

BASENAME = "CV_Arthur_Kowskii_Croquebois_Technical_Sound_Designer"
PUBLISH_NAME = "CV_Arthur_Kowskii_Croquebois_Technical_Sound_Designer.pdf"

CHROME_CANDIDATES = [
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
]


def find_chrome() -> str:
    for c in CHROME_CANDIDATES:
        if Path(c).exists():
            return c
    found = shutil.which("google-chrome") or shutil.which("chromium")
    if not found:
        sys.exit("Chrome/Chromium introuvable : impossible de rendre le PDF.")
    return found


def load(path: Path) -> dict:
    if not path.exists():
        sys.exit(f"Source introuvable : {path}")
    with path.open(encoding="utf-8") as fh:
        data = yaml.safe_load(fh)
    data.setdefault("baseline", {})
    for key in ("education", "skills", "experience", "projects", "languages", "hobbies"):
        data.setdefault(key, [])
    return data


def render_html(data: dict, font_size: float = 10.2) -> str:
    env = Environment(
        loader=FileSystemLoader(str(CV_DIR)),
        autoescape=select_autoescape(["html"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    return env.get_template(TEMPLATE).render(b=data["baseline"], fs=font_size, **data)


def page_count(pdf_path: Path) -> int:
    """Nombre de pages du PDF — le CV doit tenir sur une seule."""
    try:
        from pypdf import PdfReader
    except ImportError:
        return 0
    return len(PdfReader(str(pdf_path)).pages)


def html_to_pdf(html: str, pdf_path: Path) -> None:
    tmp_html = OUT_DIR / f"{BASENAME}.html"
    tmp_html.write_text(html, encoding="utf-8")
    cmd = [
        find_chrome(),
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--allow-file-access-from-files",
        "--no-pdf-header-footer",
        "--virtual-time-budget=4000",
        f"--print-to-pdf={pdf_path}",
        tmp_html.as_uri(),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    if not pdf_path.exists():
        sys.exit(f"Échec du rendu PDF.\n{res.stdout}\n{res.stderr}")


def todos(data: dict, src: Path) -> list[str]:
    """Liste les champs non remplis, pour ne pas publier un CV à trous."""
    raw = src.read_text(encoding="utf-8")
    return [ln.strip() for ln in raw.splitlines() if "TODO" in ln and not ln.strip().startswith("#")]


def build_txt(data: dict) -> str:
    b = data["baseline"]
    out: list[str] = []
    out.append(b["name"])
    out.append(b["title"])
    contact = [b.get("location", ""), b.get("email", "")]
    if b.get("phone") and b["phone"] != "TODO":
        contact.append(b["phone"])
    for l in b.get("links", []):
        if l.get("url") != "TODO":
            contact.append(f"{l['label']} ({l['url']})")
    out.append(" | ".join(x for x in contact if x))
    out.append("")

    def section(title: str) -> None:
        out.append(title.upper())
        out.append("-" * len(title))

    if data["education"]:
        section("Education")
        for e in data["education"]:
            line = e["title"]
            if e.get("role"):
                line += f" — {e['role']}"
            if e.get("dates"):
                line += f" ({e['dates']})"
            out.append(line)
            if e.get("detail") and e["detail"] != "TODO":
                out.append(e["detail"])
        out.append("")

    section("Skills")
    for s in data["skills"]:
        out.append(f"{s['label']}: {s['value']}")
    out.append("")

    section("Professional Experience")
    for x in data["experience"]:
        head = x["title"]
        if x.get("role"):
            head += f" — {x['role']}"
        if x.get("dates"):
            head += f" ({x['dates']})"
        out.append(head)
        if x.get("detail"):
            out.append(x["detail"])
        out.append("")

    section("Projects")
    for g in data["projects"]:
        out.append(g["group"])
        for it in g["items"]:
            out.append(f"{it['name']}: {it['detail']}")
        out.append("")

    if data["languages"]:
        section("Languages")
        for l in data["languages"]:
            out.append(l)
        out.append("")

    if data["hobbies"] and data["hobbies"][0] != "TODO":
        section("Interests")
        for h in data["hobbies"]:
            out.append(h)
        out.append("")

    return "\n".join(out).rstrip() + "\n"


def build_docx(data: dict, path: Path) -> None:
    try:
        from docx import Document
        from docx.shared import Pt
    except ImportError:
        print("python-docx absent : DOCX non généré.")
        return

    b = data["baseline"]
    doc = Document()
    style = doc.styles["Normal"]
    style.font.name = "Arial"
    style.font.size = Pt(10)

    doc.add_heading(b["name"], level=0)
    doc.add_paragraph(b["title"])
    contact = [b.get("location", ""), b.get("email", "")]
    if b.get("phone") and b["phone"] != "TODO":
        contact.append(b["phone"])
    for l in b.get("links", []):
        if l.get("url") != "TODO":
            contact.append(f"{l['label']}: {l['url']}")
    doc.add_paragraph(" | ".join(x for x in contact if x))

    if data["education"]:
        doc.add_heading("Education", level=1)
        for e in data["education"]:
            p = doc.add_paragraph()
            if e.get("dates"):
                p.add_run(f"{e['dates']}  ").bold = True
            p.add_run(e["title"]).bold = True
            if e.get("role"):
                p.add_run(f" — {e['role']}")
            if e.get("detail") and e["detail"] != "TODO":
                doc.add_paragraph(e["detail"])

    doc.add_heading("Skills", level=1)
    for s in data["skills"]:
        p = doc.add_paragraph()
        p.add_run(f"{s['label']}: ").bold = True
        p.add_run(s["value"])

    doc.add_heading("Professional Experience", level=1)
    for x in data["experience"]:
        p = doc.add_paragraph()
        if x.get("dates"):
            p.add_run(f"{x['dates']}  ").bold = True
        p.add_run(x["title"]).bold = True
        if x.get("role"):
            p.add_run(f" — {x['role']}")
        if x.get("detail"):
            doc.add_paragraph(x["detail"])

    doc.add_heading("Projects", level=1)
    for g in data["projects"]:
        doc.add_paragraph(g["group"]).runs[0].bold = True
        for it in g["items"]:
            p = doc.add_paragraph()
            p.add_run(f"{it['name']}: ").bold = True
            p.add_run(it["detail"])

    if data["languages"]:
        doc.add_heading("Languages", level=1)
        for l in data["languages"]:
            doc.add_paragraph(l)

    if data["hobbies"] and data["hobbies"][0] != "TODO":
        doc.add_heading("Interests", level=1)
        for h in data["hobbies"]:
            doc.add_paragraph(h)

    doc.save(str(path))


def verify_text_layer(pdf_path: Path) -> None:
    """Vérifie que le PDF contient du texte extractible, dans le bon ordre (test ATS)."""
    if not shutil.which("pdftotext"):
        print("pdftotext absent : vérification sautée.")
        return
    res = subprocess.run(
        ["pdftotext", "-layout", str(pdf_path), "-"],
        capture_output=True, text=True, timeout=60,
    )
    text = res.stdout
    checks = [
        ("Nom", "Arthur Kowskii Croquebois"),
        ("Titre", "Technical Sound"),
        ("Email", "contact@kowskii.com"),
        ("Section Skills", "SKILLS"),
        ("Section Experience", "PROFESSIONAL EXPERIENCE"),
        ("Section Projects", "PROJECTS"),
        ("Middleware", "FMOD"),
        ("Moteur id Tech", "id Tech 4"),
        ("Moteur Unreal", "Unreal Engine"),
        ("Projet Quake 4", "Quake 4"),
    ]
    pages = page_count(pdf_path)
    print(f"\n--- Pages : {pages} {'(OK, une page)' if pages == 1 else '(!! doit tenir sur une page)'} ---")
    print(f"\n--- Couche texte : {len(text)} caractères, {len(text.splitlines())} lignes ---")
    ok = True
    for label, needle in checks:
        hit = needle.lower() in text.lower()
        ok = ok and hit
        print(f"  [{'OK ' if hit else 'MANQUE'}] {label}: {needle!r}")
    print("--- Ordre de lecture (12 premières lignes) ---")
    for ln in [l for l in text.splitlines() if l.strip()][:12]:
        print(f"  {ln.rstrip()}")
    first_page_chars = len(text)
    if first_page_chars == 0:
        print("!! PDF sans couche texte : illisible pour un ATS.")
    extra = subprocess.run(["pdfinfo", str(pdf_path)], capture_output=True, text=True)
    if extra.returncode == 0:
        for ln in extra.stdout.splitlines():
            if ln.startswith(("Pages", "Page size", "File size")):
                print(f"  {ln}")
    print(f"\nRésultat ATS : {'PASS' if ok else 'À CORRIGER'}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--publish", action="store_true", help="copie le PDF dans public/")
    ap.add_argument("--check", action="store_true", help="vérifie la couche texte")
    ap.add_argument("--src", default=str(YAML_PATH), help="chemin du fichier YAML source")
    ap.add_argument("--font-size", type=float, default=None,
                    help="force une taille de police (sinon ajustement auto pour tenir sur 1 page)")
    args = ap.parse_args()

    src = Path(args.src).resolve()

    data = load(src)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    pending = todos(data, src)
    if pending:
        print(f"{len(pending)} champ(s) non rempli(s) dans {src.name} :")
        for t in pending:
            print(f"  - {t}")
        print()

    pdf_path = OUT_DIR / f"{BASENAME}.pdf"
    sizes = [args.font_size] if args.font_size else [10.6, 10.4, 10.2, 10.0, 9.8, 9.6, 9.4, 9.2, 9.0]
    chosen = None
    for size in sizes:
        html_to_pdf(render_html(data, size), pdf_path)
        pages = page_count(pdf_path)
        print(f"  {size:>5} pt -> {pages} page(s)")
        if pages <= 1:
            chosen = size
            break
    if chosen is None:
        chosen = sizes[-1]
        print(f"  !! ne tient pas sur une page même à {chosen} pt : couper du contenu.")

    txt_path = OUT_DIR / f"{BASENAME}.txt"
    txt_path.write_text(build_txt(data), encoding="utf-8")

    docx_path = OUT_DIR / f"{BASENAME}.docx"
    build_docx(data, docx_path)

    for p in (pdf_path, txt_path, docx_path):
        if p.exists():
            print(f"  {p.relative_to(ROOT)}  ({p.stat().st_size / 1024:.0f} Ko)")

    if args.publish:
        target = ROOT / "public" / PUBLISH_NAME
        shutil.copy2(pdf_path, target)
        print(f"\nPublié : public/{PUBLISH_NAME}")

    if args.check:
        verify_text_layer(pdf_path)


if __name__ == "__main__":
    main()
