# Si Jun’s desktop portfolio

A Next.js portfolio with the original macOS desktop, project gallery, and interactive career story, plus a Grafana-style SRE Dashboard and About Si Jun contact window.

## Run locally

```sh
npm install
npm run dev -- --port 3100
```

For a production preview:

```sh
npm test
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
```

## Explore the desktop

- **SRE Dashboard:** open the Activity icon in the Dock. One Grafana-style page shows four health signals and four charts, drawn from Si Jun's distributed-storage SRE field of work. The first machine fault, storage-pressure issue, or placement hotspot appears randomly after 30–45 seconds of visible browsing. One **Resolve fault** button runs the relevant recovery and checks its result; charts keep their history as the cluster returns to healthy. Another fault can appear after 90–150 visible seconds following recovery. Reading, scrolling, typing, opening projects, and switching portfolio windows all count without resetting the timer. Only hiding the browser tab pauses the countdown and telemetry; returning resumes the remaining time. Hover, tap, or use arrow keys to inspect chart samples. All machines, telemetry, and outcomes are fictional.
- **Simulated alerts:** each active fault adds a red **1** badge to the SRE Dock icon and a Mac-style **Cluster issue** notification at the bottom right. The notification follows the portfolio's light/dark mode and appears above the current browsing window, without moving focus or scroll position. Its buttons join the active window's keyboard navigation. Dismissal is retained when switching windows. A brief jitter plays once when the fault first becomes visible, then a subtle, steady red edge remains until recovery verifies; reduced-motion mode keeps the static edge without jitter. Short menus and contact/permission dialogs defer the card and hide the edge, while the simulation keeps running. The edge returns without replaying the jitter. Dismissing or acknowledging the notice leaves the fault, edge, and Dock badge active. Recovery clears the edge and badge. No sound or automatic window opening. A new fault gets a new notice. Closing or minimizing the dashboard preserves its state.
- **Projects:** click or type `projects` to open the original categorized gallery. Search projects, open their detail pages, and return with Back to Projects.
- **About me and Journey:** click or type `aboutme` for the professional biography and its original interactive career story. The chapters keep their scenes and illustrative skill progression, with factual tools and retrospective reflections in the same story.
- **About Si Jun:** choose About Si Jun in the Apple menu. The compact Mac-style window displays `aersijun@gmail.com` as an email link, with résumé and contact shortcuts.
- **Terminal:** the original commands (`aboutme`, `projects`, `experience`, `resume`, `clear`, and `cd`) are available. `clear` resets the terminal and `cd` switches between dark and light mode. The SRE Dashboard opens through its Dock icon or an alert, with no terminal command. The Dock keeps its original applications with the SRE Dashboard added.

## Content and simulation boundaries

Published project descriptions and role history live in `data/data.js`. Chapter captions distinguish factual periods/tools from retrospective questions. Current ByteDance storage work and the earlier ByteGraph internship remain separate chapters.

The live dashboard uses `lib/ambientSreSimulation.mjs` over the unchanged storage model in `lib/incidentSimulation.mjs`. Its one-click response performs the relevant operational sequence, gathers fresh evidence between changes, and verifies recovery using the engine's guards. Healthy telemetry retains the recovered layout; each new fictional incident starts with the engine's five-machine fixture, while retaining earlier plotted samples. The older guide, request model, and fictional CLI are unexposed utilities. They never execute shell commands or connect to production.

`npm test` covers ambient faults and recovery, state transitions, safety guards, CLI parsing, and career/project data. Browser reviews additionally exercise dashboard alerts and navigation, the original portfolio navigation, light/dark themes, and mobile layouts.
