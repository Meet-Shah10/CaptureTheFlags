# 📝 Flag 10 — Password in Plain Sight: Setup Guide

## Overview
Participants receive a text file that looks like personal notes and must find the flag hidden within the list of reminders.

**Flag:** `ARTIMAS{password_found_in_file}`  
**Difficulty:** Beginner  
**Category:** General / Investigation

---

## Step-by-Step Setup

### 1. Files in this folder
```
flag10/
├── notes.txt        ← contains the flag (distribute this)
├── index.html       ← web challenge page
└── SETUP.md         ← this file
```

### 2. How to create/edit the Notes file
Simply create a text file named `notes.txt` and include the flag anywhere inside. 
This challenge tests a participant's ability to read and scan documents for patterns (like the `ARTIMAS{...}` format).

---

## CTFd Challenge Description

> **Title:** In Plain Sight
>
> **Category:** General | **Points:** 25
>
> **Description:**
>
> ---
> We recovered some notes from a target's workstation. 
> There's probably nothing important in there... or is there?
>
> 📄 **Download:** `notes.txt`
>
> **Flag format:** `ARTIMAS{...}`
> ---

---

## How Participants Solve It

| Method | Steps |
|---|---|
| **Manual Reading** | Open `notes.txt` and read through the lines. |
| **Search (Ctrl+F)** | Open `notes.txt` and search for "ARTIMAS". |
| **Grep** | Run `grep "ARTIMAS" notes.txt`. |

```
Step 1 → Download notes.txt
Step 2 → Open and search for the flag pattern
Step 3 → Find → ARTIMAS{password_found_in_file} 🏁
```
