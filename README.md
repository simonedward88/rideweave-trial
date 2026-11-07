# RideWeave — Adaptive Cycling Coaching (trial v0.4)

Public browser-based evaluation build: https://simonedward88.github.io/rideweave-trial/

## What's new in v0.4

- Progressive, variable 16-week training calendar rather than identical workouts each week.
- Foundation, build, specific, taper and transition phases, with every fourth week reduced for recovery.
- Starter programming for athletes without imported rides, based on stated typical training and available time.
- Activity-informed baseline for athletes with imported rides; explicit **partial versus complete** training history setting.
- Imported rides shown as **Recorded** in the training calendar instead of being counted twice.
- Event dates and priorities affect the plan, recovery and taper; proximity warnings include Bamburgh six days ahead of Dirty Reiver.
- Browse individual weeks through the 16-week overview, see reasons for changes, and update an activity's RPE.
- Existing Wahoo / Zwift FIT, TCX and timed GPX file import remains supported.

The **index.html is self-contained** and contains the importer and training planner JavaScript, so GitHub Pages needs no build step or external JS files.

## Publishing via GitHub Pages

Settings → Pages → Deploy from a branch → **main** / **(root)** → Save.
When the deployment completes open: https://simonedward88.github.io/rideweave-trial/

## Data & modelling limitations

The app has **no account login or cloud database**; your athlete profile, GPX routes, ride summaries and progress stay in the same browser's local storage. Updating the web app does not automatically erase them. Export a JSON backup before significant changes and **do not place athlete backups or private activity files in this public repository**.

The coach is an **evaluation prototype**, not medical clearance or a validated predictor. Training volume is estimated from the user's stated baseline and available data. Missing imports are not interpreted as confirmed rest. FTP-based targets are provisional when no recent test confirms them; power-based TSS cannot be reliably inferred from summaries without current FTP and normalized power.

The current Zwift .zwo exporter provides an approximate structured workout; its exact interval pattern may not always match the on-screen session description. Inspect it before training.

Wahoo and Zwift **automatic** API syncing are not provided. Imports are manual local files. There is no cloud/device synchronization.
