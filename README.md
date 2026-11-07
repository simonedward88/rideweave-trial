# RideWeave v0.5 — Training zones & coach-led event preparation

Browser-based cycling coaching trial: https://simonedward88.github.io/rideweave-trial/

## New in v0.5

### Workouts
- Each planned workout card includes a colour-coded interval power/FTP-zone profile and a provisional stress estimate.
- **Details** opens a larger timed workout graph, minutes in each power zone and an estimated intensity factor.
- **Download matching .zwo** now uses exactly the same modelled segments as the graph, rather than a disconnected approximate exporter.
- The weekly plan shows the sum of **planned-workout stress points**; it intentionally **excludes unknown actual ride load and events**.
- Stress is calculated using a modelled 30-second rolling-normalised-power profile and conventional TSS scaling. The result is labelled *provisional* whenever FTP is historical/unverified; even with recent FTP it is an estimate, not observed stress.
- Long rides include guided, progressive carbohydrate practice. Training does not escalate beyond 55 g/h until the athlete logs at least two comfortable long rides. A recent report of GI symptoms reduces the suggested target.

### Event strategy
- **No longer requires manual input of expected hours, carb g/h or fluid ml/h.** The coach suggests these from the course, activity history, event duration and nutrition guidance.
- The range around expected pace visibly reflects sparse/uncertain ride data. Outdoor-labelled ELEMNT recordings are preferred to anonymous FIT/indoor rides.
- Fuel estimates use a conservative initial target (typically 60 g/h for events longer than 2.5 hours) until the athlete documents comfortable higher intakes.
- Hydration starts from an indicative 400–800 ml/h range and changes with actual forecast temperature when available. It is not a sweat-rate measurement or a requirement to drink a certain volume. Optional sodium guidance is not a personalised prescription.
- **Weather** is retrieved client-side from [Open-Meteo](https://open-meteo.com/en/docs) only when an event is within 15 calendar days **and** has a usable GPX start point. The event-start coordinate is transmitted to the weather provider. Forecasts are never invented months ahead. The event start time can be recorded in **Edit event** (09:00 assumed otherwise).
- Forecast rain, high wind and heat trigger a modest, explicitly heuristic lower-pace scenario; these adjustments are not scientifically validated for a specific course.
- Route legs and confirmed aid-station distances remain user-entered factual checkpoints; the coach works out the estimated time, carbs and fluid between them.
- Ride diary includes **Log fuel** for total carbs, drinks and gut comfort to improve future coaching evidence.

## Scientific references informing conservative defaults

- [Australian Institute of Sport: sports drinks and in-activity carbohydrate ranges](https://www.ausport.gov.au/ais/nutrition/supplements/group_a/sports-foods2/sports-drink)
- [Better Health Channel: sports hydration, 400–800 mL/hour starting range and overhydration considerations](https://www.betterhealth.vic.gov.au/health/healthyliving/sporting-performance-and-food)
- [UCI Sports Nutrition Project: race nutrition for road cycling (2026)](https://doi.org/10.1123/ijsnem.2025-0239)
- [Open-Meteo forecast endpoint and forecast horizon](https://open-meteo.com/en/docs)

## Data and compatibility

**No cloud database or account sync.** All athlete details, events, ride summaries and optional fuelling feedback remain in browser `localStorage` under `rideweave_trial_v1`. Updating the site's code does not intentionally reset those records. Export a JSON backup before major testing or editing.

The website is public, **but no athlete data is committed to this repository**. Do not publish JSON backups, personal ride recordings or health notes in public GitHub commits. No Strava API integration is included.

An FTP value marked as recently verified is still a user-provided input; the app does not perform a validated FTP test. A forecast is a third-party model, not a guarantee. The pace model is a heuristic research prototype; physiology, fueling tolerance, sweat rate, terrain classification and event-specific timing are not validated.

Open-Meteo's free access is intended for non-commercial use; a commercial deployment needs an appropriate licence or alternative provider.

## Testing performed
- JavaScript syntax checks for each module and the inline application
- Browser smoke tests on desktop and mobile viewport with zero imported activities
- 12-ride synthetic dataset matching summary metrics in the available test backup (not committed)
- Verified workout graph and exported `.zwo` have identical total duration and segments
- Verified fuelling feedback form and race-strategy recomputation after test activity upload
- Verified far-future events do not display imaginary forecasts

This is an evaluation build and should not be used as a sole source of health, exercise or hydration advice.