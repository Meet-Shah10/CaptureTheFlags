# 📄 Flag 9 — PDF Metadata Forensics: Setup Guide

## Overview
Participants receive a PDF file and must inspect its metadata properties (like Author) to find the hidden flag.

**Flag:** `ARTIMAS{metadata_tells_all}`  
**Difficulty:** Beginner  
**Category:** Forensics

---

## Step-by-Step Setup

### 1. Files in this folder
```
flag9/
├── challenge.pdf    ← contains the flag in metadata (distribute this)
├── index.html       ← web challenge page
└── SETUP.md         ← this file
```

### 2. How to create/edit the PDF using Free Online Tools

If you want to manually create or edit a PDF to include the flag:

**Option A: Using PDF24 (Recommended)**
1. Go to [PDF24 Metadata Editor](https://tools.pdf24.org/en/edit-pdf-metadata).
2. Upload your PDF.
3. In the **Author** field (or Title/Subject), paste: `ARTIMAS{metadata_tells_all}`.
4. Click **Set Metadata** and download the new file.
5. Save it as `challenge.pdf` in this folder.

**Option B: Using Sejda**
1. Go to [Sejda Metadata Editor](https://www.sejda.com/edit-pdf-metadata).
2. Upload your PDF.
3. Update the fields and click **Update PDF metadata**.

### 3. Verify the Metadata
Open the PDF in any viewer and check File -> Properties, or use:
```bash
exiftool challenge.pdf
# Look for Author field
```

---

## CTFd Challenge Description

> **Title:** Beyond the Text
>
> **Category:** Forensics | **Points:** 50
>
> **Description:**
>
> ---
> We recovered a corporate security briefing. The analyst who wrote it left something behind.
>
> It's not in the paragraphs. It's in the profile.
>
> 📥 **Download:** `challenge.pdf`
>
> **Flag format:** `ARTIMAS{...}`
> ---

---

## How Participants Solve It

| Method | Steps |
|---|---|
| **PDF Viewer** | Open PDF in Chrome/Adobe → **File** → **Properties** → Check **Author**. |
| **ExifTool** | Run `exiftool challenge.pdf` and look for the `Author` line. |
| **strings** | Run `strings challenge.pdf | grep ARTIMAS`. |
| **Windows Explorer**| Right-click `challenge.pdf` → **Properties** → **Details** tab. |

```
Step 1 → Download challenge.pdf
Step 2 → Check file properties/metadata
Step 3 → Find Author → ARTIMAS{metadata_tells_all} 🏁
```
