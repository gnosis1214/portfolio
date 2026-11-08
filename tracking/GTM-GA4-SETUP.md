# GA4 through GTM on zana-g.com

No IDs live in this repo. The GTM container ID goes into the site through the Code Snippets plugin, and the GA4 Measurement ID only inside GTM.

## How it works

1. Every page (home and the six service and case study pages) pushes one event for each `[data-zg-event]` click:
   `{ event: "zg_event", zg_event: "<name>", zg_label: "<label>", zg_url: "<link href, links only>" }`
2. GTM loads site-wide from two Code Snippets HTML snippets: `zg GTM head` (head) and `zg GTM body` (noscript, body open).
3. In GTM, one Custom Event trigger catches `zg_event`, and one GA4 Event tag sends it to GA4 under its own name (`book_call`, `view_switch`, and so on). New `data-zg-event` names reach GA4 with no GTM change.

## Events

| Event name in GA4 | Fired by | Key event |
|---|---|---|
| `book_call` | Book a call buttons (nav, hero, CTA, packages, contact, case pages) | Yes |
| `email_click` | mailto links | Yes |
| `upwork_click`, `onlinejobs_click` | Profile links | Optional |
| `service_page_open` | Home Services cards → service page | |
| `case_page_open` | Home Work cards and modals, service page project cards → case study | |
| `view_switch` | Case study view tabs | |
| `process_step` | "How a project runs" stepper on service pages | |
| `build_step` | "How it was built" stepper on case studies | |
| `project_click`, `social_click`, `case_study_open`, `project_filter`, `view_projects`, `contact_click`, `assistant_open`, `assistant_question`, `theme_toggle` | Home page (see V2-NOTES) | |

Parameters: `label` (from `zg_label`) and `link_url` (from `zg_url`, mailto links sent as `mailto` so no email address reaches GA4).

`link_url` uses a Custom JavaScript variable, not a Data Layer Variable: GTM keeps keys from earlier pushes, so a plain variable would repeat the last link's URL on button clicks (`view_switch`, steppers).

## 1. GA4 property (skip if you have one)

1. analytics.google.com → **Admin** (gear, bottom left) → **Create** → **Property**.
2. Property name `zana-g.com`, time zone **Philippines**, currency **US Dollar** → **Next** → pick business details → **Next** → objective **Generate leads** → **Create**.
3. Platform **Web** → website URL `zana-g.com`, stream name `zana-g.com web` → leave **Enhanced measurement** on → **Create & continue**.
4. Copy the **Measurement ID** (`G-…`). Close the install screen: GTM loads the tag, so don't add gtag code anywhere.
5. Recommended: **Admin → Data collection and modification → Data retention** → Event data retention **14 months** → **Save**. (The default is 2 months.)

## 2. GTM container (skip if you have one)

1. tagmanager.google.com → **Create account**.
2. Account name `Zana-G`, country **Philippines**. Container name `zana-g.com`, target platform **Web** → **Create** → accept the terms.
3. Close the install code pop-up. Copy the container ID (`GTM-…`) shown at the top. Claude adds the snippet to the site.

## 3. Load the tags into GTM

### Fast way: import (about 3 minutes)

1. GTM → **Admin** → **Import Container**.
2. **Choose container file** → `tracking/gtm-import.json` (or the copy with your GA4 ID filled in, if Claude made one).
3. Choose workspace: **Existing** → **Default Workspace**.
4. Import option: **Merge** → **Rename conflicting tags, triggers, and variables** → **Confirm**.
5. **Variables** → open `Const - GA4 Measurement ID` → replace `G-XXXXXXXXXX` with your Measurement ID → **Save**. (Skip if your file already has the ID.)
6. **Tags** → open `Google tag - GA4` and check its trigger is **Initialization - All Pages**. If it's blank, click **Triggering** → pick **Initialization - All Pages** → **Save**.

### Manual way (if the import fails)

Variables (**Variables → User-Defined Variables → New**):
1. `Const - GA4 Measurement ID`: type **Constant**, value = your `G-…` ID → **Save**.
2. `DLV - zg_event`: type **Data Layer Variable**, name `zg_event`, version 2 → **Save**.
3. `DLV - zg_label`: type **Data Layer Variable**, name `zg_label`, version 2 → **Save**.
4. `CJS - zg_url`: type **Custom JavaScript**, paste the function from `gtm-import.json` (the `javascript` value, with `\n` as line breaks) → **Save**.

Trigger (**Triggers → New**):
5. `CE - zg_event`: type **Custom Event**, event name `zg_event`, fires on **All Custom Events** → **Save**.

Tags (**Tags → New**):
6. `Google tag - GA4`: type **Google Tag**, Tag ID `{{Const - GA4 Measurement ID}}`, trigger **Initialization - All Pages** → **Save**.
7. `GA4 Event - zg_event`: type **Google Analytics → Google Analytics: GA4 Event**.
   - Measurement ID `{{Const - GA4 Measurement ID}}`
   - Event name `{{DLV - zg_event}}`
   - Event parameters → **Add parameter**: `label` = `{{DLV - zg_label}}`; `link_url` = `{{CJS - zg_url}}`
   - Trigger `CE - zg_event` → **Save**.

## 4. Test, then publish

1. GTM → **Preview** (top right) → enter `https://zana-g.com/` → **Connect**. The site opens in a new window with "Tag Assistant connected".
2. On the home page: click a Services card link (`service_page_open`) and a Work "Read case study" button (`case_page_open`). On the service page: click a "How a project runs" step (`process_step`). On a case study: click a view tab (`view_switch`) and a "How it was built" step (`build_step`).
3. In the Tag Assistant tab, each `zg_event` row should show **GA4 Event - zg_event** under *Tags Fired*. Click the tag to see the event name and `label`.
4. GA4 → **Admin → Data display → DebugView**: the same events appear within a minute.
5. Back in GTM → **Submit** → version name `GA4 + zg_event` → **Publish**.
6. GA4 → **Reports → Realtime overview** → card *Event count by Event name* shows the events from a normal (non-preview) visit. Ad blockers hide them, so test in a clean browser or phone.

## 5. GA4 settings

1. **Key events**: **Admin → Data display → Key events → New key event** → `book_call` → **Save**. Repeat for `email_click`. These work before the events first arrive.
2. **Custom dimension** for labels: **Admin → Data display → Custom definitions → Create custom dimension** → name `ZG label`, scope **Event**, event parameter `label` → **Save**. (`link_url` is already a built-in dimension, *Link URL*.)
3. Optional: exclude your own visits. **Admin → Data collection and modification → Data streams → zana-g.com web → Configure tag settings → Show all → Define internal traffic** → add your IP. Then **Admin → Data collection and modification → Data filters** → set *Internal Traffic* to **Active**.

## Reading the results

- Visits to the new pages: **Reports → Engagement → Pages and screens**, filter for the page paths.
- Clicks from home to the new pages: **Reports → Engagement → Events** → `service_page_open` / `case_page_open`, broken down by `ZG label`.
- Contact clicks: `book_call` and `email_click` (key events), broken down by page path or `ZG label`.
