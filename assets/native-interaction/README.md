# Native interaction and MG motion

Read `../../references/native-interaction-fidelity.md` and `../../references/native-motion-vocabulary.md` first. This module connects verified product controls to actual results, then choreographs typography, native 3D pages, a collection and a brand ending.

Customer captures, documents and audio are not distributed. Supply your own authorized content and assets.

```bash
python3 rebuild.py --content /absolute/project/content.json \
  --assets /absolute/project/authorized-assets --validate-only

python3 rebuild.py --content /absolute/project/content.json \
  --assets /absolute/project/authorized-assets \
  --out /absolute/new-directory --render
```

The output directory must be new and empty. The builder makes a native EffectCraft project and optionally a silent picture render. Voice, music, sound effects, captions and final acceptance are separate production work; do not call that silent render a finished commercial video.

Current picture routes: `main`, `transfer`, `graphic`, `luminous`, `companion`. `main` and `transfer` retain the evidence-case and results-tour content contract; the other three are the report/plan study layouts. These layout names are not five new style IDs. This version is validated at 1920×1080 and 30 fps. It uses FOLDHan-Regular and FOLDHan-Bold available on the production machine; install appropriately licensed fonts or deliberately replace and inspect typography on another machine.

Required evidence fields per `interaction_sources[id]`:

- `files_asset`: exact crop of the real file/control area.
- `crop`: `[left, top, right, bottom]` in the original screenshot.
- `hotspot`: `[x, y]` in that same original screenshot; the cursor tip is the anchor.
- `row`: verified target row bounds in the original screenshot, not a decorative invented button.
- `toolbar_asset`: actual native preview toolbar, separated from scrolling content.
- `viewer.type = strip`: `asset`, original `width/height`, `scroll_offsets`; optional `focus_crop` from the same report pixels.
- `viewer.type = pages`: actual `pages` and their `aspect`. The current demonstration scrolls from the first page to the second; additional page sequences require editorial timing.

Each case sets `workspace`, `click`, `result_start`, `end`, and an optional `source_id`. The sound trigger uses `click + 1/30`, matching the most compressed pointer frame. Click-to-response time is editorial and is never a product speed claim.

The optional `motion_stage` supplies `start`, `end`, `title`, and six `{file, label}` items. The current gallery requires at least 7.6 seconds for reveal, depth, stable reading and convergence. `depth_assets[case_id]` optionally supplies up to two actual result pages behind the Graphic Product Pop scene. These counts are this layout's constraints, not limits on the style itself.

Editable modules:

- `input_library.jsx`: captured empty/enabled input, original glyph reveal, focus/caret/submit choreography and shape handoff.
- `interaction_library.jsx`: source coordinates, cursor, shape reveal, document scrolling, magnifier, reading paths.
- `motion_vocabulary.jsx`: clipped kinetic type, native camera and 3D page layers, staggered fan/grid, persistent-page convergence.
- `evidence_library.jsx`: question handoff, evidence proof rail, native wipe, results tour and continuous matrix.
- `style_film.jsx`: three distinct spatial layouts using shared business evidence.

Retain state-capture vs continuous-recording provenance, original data scope, official product identity and new-version review status when adapting.

Optional native input uses `cases[].input` with `start`, `focus`, `type_start`, `type_end`, `submit`, `end`; `input_sources[id]` supplies `empty_asset`, `ready_asset`, `text_asset`, input dimensions, `text_box`, `clear_box`, `glyph_ends`, `submit_hotspot`, and a provenance note. The image data must match the real product. Masks and caret share the same glyph boundary sequence; pauses and click cues are editorial, never latency evidence. Keep at least a readable pause before submit. Actual local drafts used for capture should be restored, and submission/inference status recorded separately.


## Shared refinement profiles (3.30.0)

`style-profiles.json` now carries shared input/cursor/guidance/MG/audio checks and separate choreography for all four styles. The selector and planner expose these profiles. Read `../../references/cross-style-mg-enhancements.md` for the generic interaction refinements and their implementation scope. The builder uses a single-row input rig; a multi-row implementation requires project-specific adaptation.
