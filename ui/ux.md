# StudioSplit — UI/UX Specification

## 1. Design thesis

**Archetype:** analog recording studio + session sheet + mixing console

**Signature:** Each collaborator is a vertical mixer channel. Checkpoints appear as tape markers on a horizontal session timeline. Final bps is shown on a physical-looking split sheet, not a donut chart.

The interface must visually belong to this domain. Remove the logo and a reviewer should still identify what kind of product it is.

## 2. Anti-generic-AI rules

Do not use:

- purple/blue gradient hero;
- glowing background orbs;
- centered “AI-powered” headline + 3 feature cards;
- glassmorphism;
- bento-grid filler;
- giant rounded rectangles everywhere;
- decorative metric cards without a workflow purpose;
- meaningless radar/donut charts;
- excessive icons;
- sparkle/brain/robot AI motifs;
- 3D tokens/network spheres;
- wallet-connect as primary visual identity;
- hover lift/drop-shadow on every surface.

Do not import a UI kit and accept its default look. If primitives are used, restyle them to this system.

## 3. Color system

| Token | Hex | Primary use |
| --- | --- | --- |
| espresso | `#2A2119` | studio chrome |
| parchment | `#F5E9D8` | session sheet |
| brass | `#B18A4E` | ownership/finalized split accent |
| slate | `#627184` | secondary tracks/metadata |
| oxide | `#A84E3B` | overlap/dependent-claim warning |

Use status text alongside color. Do not create gradients between these colors.

## 4. Typography

DM Sans for UI; DM Mono for version/hash; Fraunces used sparingly for project titles

### Type roles

- **Domain title:** strong display face defined above.
- **Primary prose/evidence:** readable text face with generous line height.
- **Identifiers/digests:** mono where specified.
- **Controls:** compact UI face.
- **Status:** uppercase or small-cap only when it matches this project's design language; never use every label as a pill.

## 5. Geometry and surfaces

horizontal channel strips, fader-like contribution bars, ruled paper areas, 5px radius; no bento cards

Borders/rules should do more work than shadows. Keep domain documents, maps, timelines, brackets or matrices visually primary.

## 6. Motion

fader values animate only after finalized split; tape-head cursor for timeline scrubbing

All motion obeys `prefers-reduced-motion`.

## 7. Application chrome

### Header

- Project/domain context left.
- Live StudioNet/fixture/unavailable provenance visible but quiet.
- Actual wallet network + address utility right.
- No auto-connect.
- Wrong network blocks the write in-context.

### Navigation

Navigation should use the domain concepts from the route list below. Avoid generic “Dashboard / Analytics / Settings” unless a screen genuinely is settings.

## 8. Route-by-route specification

### `/` — Project tape

**Desktop composition:** Session timeline across width with project reels in left shelf; current release marker at right.

**Primary action:** Open project

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/projects/[id]/lanes` — Collaborator lanes

**Desktop composition:** Mixer-style vertical channels per collaborator with dimension markers and checkpoint counts.

**Primary action:** Inspect lane

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/projects/[id]/checkpoint` — Checkpoint recorder

**Desktop composition:** Artifact version top, contribution text on ruled session sheet, dimension selector like track assignment.

**Primary action:** Record checkpoint

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/projects/[id]/artifacts` — Artifact version room

**Desktop composition:** Tape-reel/version history with digest, public preview and contributors.

**Primary action:** Select version

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/projects/[id]/overlap` — Overlap matrix

**Desktop composition:** Collaborators rows × dimensions columns; cells open semantic overlap evidence.

**Primary action:** Inspect overlap

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/projects/[id]/finalize` — Final split desk

**Desktop composition:** Band matrix left, deterministic normalization math center, physical split sheet right.

**Primary action:** Request/run finalization

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.

### `/projects/[id]/receipt` — Credit receipt

**Desktop composition:** Print/export page with 10,000 bps exact total, release digest and tx.

**Primary action:** Export credit sheet

**State requirements:** explicit live provenance, loading, empty/not-found where applicable, unavailable read, wallet disconnected (read remains usable where possible), wrong network for writes, submitted transaction, consensus/finality pending, finalized-success + authoritative re-read, finalized rollback/error, and abstain/insufficient where the domain supports it.

**Mobile adaptation:** Preserve the main artifact and primary action. Move the secondary evidence/memory pane into a full-height sheet or dedicated route rather than shrinking text into unreadability.


## 9. Signature components

The component library should be named around the domain. Core cross-project primitives may exist internally, but visible components should reflect this product.

- **Primary domain surface:** implement the `analog recording studio + session sheet + mixing console` rather than a card grid.
- **Decision strip/rail:** fixed place for on-chain status and tx lifecycle.
- **Semantic context:** related records with ID/version/raw distance.
- **Immutable reference block:** URL + digest + copy + provenance.
- **History/version object:** append-only past decisions.
- **Network gate:** exact expected/actual chain.
- **Receipt:** printable/copyable authoritative outcome.

Project pages to support:

- Project tape
- Collaborator lanes
- Checkpoint recorder
- Artifact version room
- Overlap matrix
- Final split desk
- Credit receipt
- Release archive

## 10. Transaction experience

Never show “success” after only receiving a transaction hash.

```text
Awaiting signature
  -> submitted (hash)
  -> consensus/finality pending
  -> FINALIZED
  -> inspect GenVM execution
     -> SUCCESS: re-read record
     -> ROLLBACK/ERROR: show failure, do not fake state
```

Do not show a fake percentage while consensus is pending.

## 11. Semantic-memory presentation

Semantic memory is related context, not truth.

### Show

- record title/ID;
- namespace/version;
- raw vector distance;
- one bounded authoritative excerpt/summary;
- final status of that prior record;
- why it is eligible.

### Never show

- “92% true”;
- “AI confidence based on similarity”;
- “validator certainty” derived from KNN;
- a green check merely because distance is small.

## 12. Density and information design

This product should be usefully dense.

- Repeated records use ruled lists/tables.
- Identifiers are selectable/copyable.
- Evidence and result are visually distinguishable.
- Digests/versions sit beside the object they bind.
- Do not hide critical details behind hover.
- Avoid excessive whitespace that turns an operational app into a landing page.

## 13. Responsive system

### Desktop

Use the full signature composition.

### Tablet

Primary domain object + one context pane; other nav/context becomes a drawer.

### Mobile

- one main column;
- 44px touch targets;
- dedicated full-screen mode for map/graph/bracket/complex matrix;
- hashes wrap and have copy controls;
- evidence/context becomes a sheet;
- primary write can use a bottom action bar only when contextually valid.

## 14. Accessibility

- WCAG AA text contrast.
- Text labels for all status colors.
- Full keyboard access.
- Visible focus state.
- Table headers/semantic HTML.
- List alternative to visual graph/map.
- Evidence selectable as text.
- Reduced motion.
- Minimum practical text size 12px for dense metadata, larger for critical text.

## 15. Content language

Use domain language and precise transaction language.

Good:

- “Related records retrieved”
- “Bound to version 3”
- “Finalized; GenVM execution rolled back”
- “Insufficient public evidence”
- “No eligible semantic memory found”

Avoid:

- “AI magic”
- “Trustless revolution”
- “Intelligence score”
- “Smart insights”
- “Powered by next-gen AI”

## 16. Screenshot quality bar

- [ ] Logo can be removed and the product is still visually identifiable.
- [ ] No generic AI-template motifs.
- [ ] Main domain artifact occupies more attention than metrics.
- [ ] Wallet is utility chrome.
- [ ] Provenance is visible.
- [ ] Transaction truth is inspectable.
- [ ] VecDB distance is not mislabeled.
- [ ] Empty/error/abstain states look intentional.
- [ ] Mobile primary workflow is viable.
- [ ] Color, type, geometry and composition differ materially from the other nine packs.
