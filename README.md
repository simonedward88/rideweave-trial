# RideWeave — Cycling Coach & Event Intelligence (trial v0.3)

This repository contains the browser-based RideWeave evaluation application.

## Launch with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main**, folder **/(root)**, then **Save**.
4. When GitHub reports deployment complete, open:
   https://simonedward88.github.io/rideweave-trial/

The site is not live until GitHub Pages has been enabled and deployed.

## What is included
- Athlete profile, training availability, events and A/B/C event priorities
- Rolling training plan with rule-based adaptation
- GPX import and course visualisation
- Event pacing and fuelling planning
- Recovery check-ins and conservative symptom screening
- Manual activity and CSV imports, plus browser-local FIT / FIT.GZ / TCX / timed GPX ride imports
- Zwift .zwo workout export
- JSON backup and restore

## Data handling and limitations
This is a **publicly hosted static trial**, with no login or cloud database. Athlete information entered in the app is stored **only in that browser's localStorage**. Data does not synchronise between devices. Use JSON backup to keep a portable copy and avoid entering sensitive health details on shared devices. Do not upload activity exports or personal GPX files to the public GitHub repository.

**No live Strava or Zwift account connection is included.** The injury and recovery logic is preliminary and must not be treated as a medical diagnosis or clearance to exercise.

## Version
v0.2 — November 2026. 

## Importing recent Wahoo and Zwift rides (v0.3)

**Wahoo app**: History → select completed ride → three-dot menu → Share activity → Download .fit activity → save the file to your phone. Then open RideWeave → Activity history → Import ride files and choose the file(s).

**Zwift**: Log in at zwift.com/feed on desktop, open an activity and use its gear menu → Download Fit File. Import the downloaded .fit in RideWeave using the same button.

FIT imports retain only a compact summary (date, duration, distance, ascent, average power, HR, cadence and any provided normalized power). Original recording samples and GPS coordinates are not retained. This is not a live API connection. The importer has been tested on a synthetic FIT file; real-world device FIT variants still need trial evaluation.

Recent training hours from imported activities feed the existing rule-based scheduling baseline. Power analysis, training stress and FTP estimation are not yet validated. Check your FTP date and mark it unverified if historical.

**Privacy**: Don't upload your personal FIT files or RideWeave backup into this public repository. Import within the browser instead. Keep your JSON backups privately; browser localStorage can be cleared.
