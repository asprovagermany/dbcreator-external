[![License: MIT](https://img.shields.io/badge/License-MIT-informational.svg)](./LICENSE)

# dbcreator - (Custom Dashboard)

A grid-based dashboard builder for **Asprova** that runs inside a WebView (Edge WebView2). It lets you add, arrange, and style widgets, and visualize Asprova data with **ApexCharts** on a **GridStack** layout. The UI supports multiple languages (DE/EN/PL/FRA/JPN) and includes a styling system with custom color palettes and print-to-PDF.

> **Designed for Asprova CustomView.** The code expects an `asprova` host object (via WebView2). Running it in a plain browser requires stubbing/removing that integration (see “Browser-only preview” below).



## Key Features

- **Drag & drop layout** with [GridStack]: resize from corners; snap-to-grid; lock/unlock widgets.
- **Widget lifecycle**
  - Add / edit / delete widgets via modal dialogs.
  - Per-widget size (`gs-w`/`gs-h`), position (`gs-x`/`gs-y`), lock state, and chart type.
  - Tooltips & quick actions (lock/unlock, edit, delete).
- **Display modes (charts & KPIs)** via [ApexCharts]:
  - `abs` (large single KPI),
  - `bar`, `horizontalbar`, `line`,
  - `radar`, `pie`, `donut`,
  - `radialBar`, `gauge` (semi-circle).
- **Data selection UI** with [TreeselectJS]:
  - Pick **Tables**, **KPIs (properties)**, **Schedule Runs**, optional **filters**.
  - “Keep up to date?” flag and “Number of planning runs” per widget.
- **Styling / Theming**
  - Style bar with **save / load / rename / delete** style buttons.
  - Custom color palettes (primary/secondary/icons/font) and header title.
  - Print stylesheet and **“Save as PDF”** (uses browser print).
- **Internationalization**
  - Language strings in `assets/utils/lang.js`; The dashboard creator selects the language based on the language selected in the APS.



## How It Works (Asprova Integration)

The file `assets/charts/asprovaConnector.js` bridges to Asprova via WebView2:

- Expects `window.chrome.webview.hostObjects.sync.asprova`.
- Reads the **Active Project** and locale; populates the UI (tables, properties, schedule runs, resources).
- Stores layout/styles in Asprova **Project** user properties (created automatically if missing):

  - `GlobalDashboardCreatorData` – global dashboard metadata.
  - `DashboardCreatorStyleData` – **multi-data** store for saved styles.

> Internally uses Asprova APIs (e.g., `CreateUserPropertyDefWithoutAddingToStyles`, `LookupClassDefFromCode("Project")`, `LookupPropertyDefFromCode`, etc.) to create and access those properties.



## Display Modes

The widget renderer is implemented in `assets/charts/charttypes.js` (**`ChartWidget`**). Supported `chartType` values:

- `abs` (Big number / KPI)
- `bar`, `horizontalbar`, `line`
- `radar`, `pie`, `donut`
- `radialBar`, `gauge` (semi-circle)

Each mode builds an ApexCharts config from the selected Asprova data. Helper transforms live in `assets/charts/utils.js`.



## UI Walkthrough

- **Header / Nav**
  - Buttons for **Add Style**, **Add Widget**, **Save/Load Style**, **Print PDF**, **Settings**.
  - Tooltips are localized via `lang.js`.
- **Add Widget Modal**
  - **Title**, **Chart Type**, **Table**, **KPI(s)** (multi), **Schedule Runs**, **Resource**, **Filter**, **Keep up to date?**, **Number of planning runs**, **Width/Height** (1–12).
- **Style Bar**
  - Saved styles appear as buttons. Click to activate; use context buttons to rename or delete.
- **Grid Area (`.grid-stack`)**
  - Drag to move, resize from corners; per-widget action buttons (lock/unlock, edit, delete).


## Getting Started (Asprova – recommended)

1. Ensure Asprova is configured to host HTML content via **WebView2**.
2. Place the repository folder where Asprova can load `index.html`.
3. Open the HTML view in Asprova pointing to `index.html`.
4. The first run creates the user properties:
   - `GlobalDashboardCreatorData`
   - `DashboardCreatorStyleData` (multi-data)
5. Use **Add Widget** to define charts/KPIs, then **Save Style** to store your palette/layout.

> **Note:** The page loads libraries from `node_modules/**`. If you distribute the dashboard, ship `node_modules` alongside or adapt paths/CDN hosting.


## Embedding the Dashboard

### Inside Asprova (primary)

- Use Asprova’s HTML/WebView panel to load `index.html`.
- Data and styles are read/written through the project host object – **no external config file** is required.
- Saved styles/layout are persisted in the Project’s user properties listed above.

### Outside Asprova (advanced)

- You’ll need to **replace** `assets/charts/asprovaConnector.js` with a connector to **your** data source (REST, JSON, etc.).
- Implement analogs for:
  - `getAllSchedRuns`, `getRessources`, `getProperties`, `getData`
  - and storage for “global” & “styles” (e.g., localStorage or your API).
- Keep the same **data shapes** expected by `ChartWidget` and modal helpers.



## Development Notes

- No bundler/build step is required; scripts and CSS are included via `<script>` / `<link>` from `node_modules`.
- If you plan to deploy on the web (non-Asprova), consider migrating to CDN imports or bundling to avoid shipping `node_modules` in production.



## Printing / Export

- Use the **PDF** button (calls `window.print()` with `assets/styles/print.css`) to save a printable dashboard view.
- After printing, the page reloads to restore the UI state.



## License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

Copyright © 2025 **Asprova GmbH**



## Third-Party Notices

This project uses third-party libraries under their respective licenses, including but not limited to:
- [ApexCharts]      (MIT)
- [GridStack]       (MIT)
- [TreeselectJS]    (MIT)
- [Font Awesome]

Refer to each library’s repository for the full license text.

[ApexCharts]: https://apexcharts.com/  
[GridStack]: https://gridstackjs.com/  
[TreeselectJS]: https://treeselectjs.org/  
[Font Awesome]: https://fontawesome.com/