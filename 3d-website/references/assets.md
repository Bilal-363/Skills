# Generating assets for the niche

**Assets are resolved at build time by a ladder, not chosen upfront.** When the
prompt runs, the agent detects what is available in that session and walks the
ladder below per shot: user URLs → a connected generator → free stock → code.
The same spec therefore works whether or not a generation tool is present.

**Not every page needs a photograph.** Roughly half the archetypes look better
with zero image files — a typographic hero with real negative space beats a
mediocre stock photo. Ask before spending anything: *does this composition need
a photograph, or does it need space?*

## Where imagery comes from — the run-time fallback ladder

This runs **at build time, per shot**, and adapts to whatever is available in
the session it runs in. The emitted spec carries the ladder (see
`spec-template.md` §2b) so the same prompt behaves correctly on a machine with a
generator and on one without. Walk top to bottom; **stop at the first rung that
succeeds.**

**1 · The user's own URLs.** Verbatim law. Generate nothing, substitute nothing.

**1b · Need a 3D MODEL (GLB) for a spinnable product (A34)?** User’s own `.glb`
first; else Higgsfield `generate_3d` turns a product photo into a GLB mesh
(preflight cost, report first). No model → fall back to a product photo (A23).
Shaders (A35) need no assets — pure code.

**2 · A generation tool is connected.** Detect any image/video capability
exposed this session — not only Higgsfield. Check, in order:
- Higgsfield MCP → `generate_image` (`nano_banana_pro`, stills) and
  `generate_video` (`kling3_0`, `mode:"pro"`, `sound:"off"`, `duration:4`).
- Any other connected image/video MCP or tool with an equivalent verb.
If one exists, use it; results come back as URLs — use them directly, never
re-host. **Always preflight the cost and report it before spending** (§ Always
preflight). If no such tool is exposed, fall through to Rung 3.

> **How to detect:** look at the tools actually available this session. If an
> image/video-generation tool is present and the user has not forbidden it, take
> Rung 2. If the user said "no generation" / "don't use Higgsfield" / has no
> connector, skip straight to Rung 3 or 4. Never announce a tool you cannot see.

**3 · Free-licence stock, hotlinked from its own CDN.** Only from sources whose
terms permit hotlinking and commercial use — Unsplash (`images.unsplash.com`)
and Pexels. Always pin the size and quality (`?q=80&w=2000&auto=format&fit=crop`),
and record the photographer credit in a comment. Use this when the niche needs
a *real* photograph (food, interiors, people at work) and generation is not
available.

> **Never scrape Google Images.** Those results are other people's copyrighted
> work served from hosts that block hotlinking, so the images break, and using
> them commercially exposes the client. If the user asks for this, say so once
> and offer tier 3 or tier 4 instead.

**4 · Build the visual in code.** The default when nothing above is available,
and often the *best* answer regardless — see § Zero-asset visuals. Costs
nothing, cannot fail to load, never dates, no licence risk.

**Never**: grey placeholder rectangles, `placehold.co`, `picsum.photos`,
`via.placeholder.com`, scraped image results, or "add your image here" boxes.
If you cannot produce a visual, change the composition to one that does not
need it.

---

## The shot list

Generate the minimum that carries the page. Never one image per section.

| site type | shots | credits |
|---|---|---|
| Single viewport / spotlight hero | 1 hero still (+1 reveal grade if A14) | 2–4 |
| Scroll story | 1 hero video (4s) + its poster still | 9 |
| Mosaic (A16, light) | 1 wide plate **per mosaic section** — usually 2–3 | 4–6 |
| Multi-page | hero video + poster + 1 still per major inner page | 13–17 |
| Video switcher (A19) | 3–4 clips, 4s each | 21–28 |

**Poster rule:** whenever there is a hero video, generate the still **first**,
then pass it as the video's `start_image`. Same shot, so the
`poster → video` handoff is invisible. Costs nothing extra.

**Spotlight rule (A14/I1):** the two images must be the *same subject, different
grade* — same room, warm vs cold; same dish, lit vs shadow. Generate the base,
then the reveal from it as a reference. Two unrelated images read as a bug.

---

## Always preflight

```
get_cost: true   → report the credit total to the user BEFORE generating
```
Then generate. Never spend without saying the number first. If the balance
won't cover the shot list, say what it covers and ask what to cut.

Models: `nano_banana_pro` for stills (16:9). `kling3_0` for video —
`mode: "pro"`, `sound: "off"`, `duration: 4`, `aspect_ratio: "16:9"`.
Silent, always: a background video that makes noise is a bug.

---

## Prompt recipe

Every generation prompt is five clauses in this order:

```
1. SHOT      Ultra-cinematic wide shot / medium shot, [aspect]
2. SUBJECT   the niche-specific content
3. LIGHT     the preset's palette, named in hex
4. SPACE     "heavy negative space in the left third for typography,
              subject weighted right of centre"
5. CRAFT     anamorphic lens, shallow depth of field, fine film grain,
              [low-key | high-key] lighting, photoreal
6. BAN       no text, no logos, no watermarks, no UI, no people looking
              at camera [+ niche-specific bans]
```

Clause 4 is the one people forget and the one that makes the page work — without
reserved negative space the headline sits on visual noise.

**For a looping background video, add:**
> "The camera moves extremely slowly and steadily on a dolly; the first and last
> frame look nearly identical for a seamless loop."

---

## Embedded generation prompts (write these INTO the master prompt)

Every master prompt the skill emits must carry, in its §2b, a small block of
**ready-to-run generation prompts written for the specific niche** — so whoever
runs the prompt later gets automatic assets if any engine is connected, and a
clean code fallback if not. The runner does not have to think; it just fires
these when a tool exists.

**Always emit exactly:**
- **2–3 image prompts** — 16:9 stills. Prompt 1 = the hero. Prompts 2–3 = the
  other shots the section set needs (about plate, an industry/act still, etc.).
  If the site needs only a hero, emit 2 (hero + one alternate grade for a
  spotlight/reveal).
- **1 video prompt** — **4 seconds, 16:9, silent, seamless loop.** Its first
  frame must match hero image prompt 1 (so the still doubles as the poster).

Each is a **complete paste-ready string** built from the six-clause recipe above,
with this build's palette hexes already substituted — not a template with blanks.

**Emit them in this exact shape inside §2b:**

```
### Generation prompts (auto-run if an engine is connected; else ignore)

IMG-1 (hero, 16:9):
  Ultra-cinematic wide shot. <niche hero subject>. Lit in <accent hex> key with
  <accent-2 hex> rim on <void hex> ground. Heavy negative space in the left
  third for typography, subject weighted right of centre. Anamorphic lens,
  shallow depth of field, fine film grain, low-key lighting, photoreal.
  No text, no logos, no watermarks, no UI, no faces to camera<niche bans>.

IMG-2 (<role>, 16:9):
  <same recipe, second subject>

IMG-3 (<role>, 16:9):        # omit if only two shots are needed
  <same recipe, third subject>

VID-1 (hero loop, 16:9, 4s, silent):
  <same as IMG-1> The camera pushes in extremely slowly and steadily on a
  dolly; first and last frame near-identical for a seamless loop.

Model hints (use whatever this session exposes):
  images → nano_banana_pro (Higgsfield) or any image tool, aspect 16:9
  video  → kling3_0 (Higgsfield) mode:pro sound:off duration:4, or any video tool
Poster rule: VID-1's start_image = IMG-1, so the poster→video handoff is invisible.
If no engine is connected, skip this block and use the procedural system in §6.
```

**Worked example — a dental clinic (P7 ENAMEL, accent `#3ec7c1`):**
```
IMG-1 (hero, 16:9):
  Ultra-cinematic wide shot. A clean dental treatment room in soft morning
  light, instruments out of focus on a pale surface. Cool teal #3ec7c1 key
  light, warm #7fb4d4 rim, near-white #f2f8fa ground. Heavy negative space in
  the left third for typography, subject weighted right of centre. Anamorphic
  lens, shallow depth of field, fine film grain, high-key lighting, photoreal.
  No text, no logos, no watermarks, no UI, no open mouths, no procedures, no faces.
VID-1 (hero loop, 16:9, 4s, silent):
  <IMG-1> The camera pushes in extremely slowly and steadily on a dolly; first
  and last frame near-identical for a seamless loop.
```

For an **abstract niche** (AI, finance, legal) still emit the block, but add a
one-line note: *"this niche has nothing to photograph — a connected engine may
run these, but the procedural system in §6 is the intended visual."*

### Exploded-layer prompts (for A24 layered assembly)
When the build uses **A24** (a product that assembles/explodes on scroll), the
image prompts change shape: generate **one transparent-PNG layer per part**, all
the same canvas size and centred registration so they stack pixel-aligned, plus
one assembled hero. Every layer prompt ends with the same framing clause so the
parts line up.

```
Shared clause (append to EVERY layer): "isolated on a plain transparent
background, centred, same camera angle and scale as the other layers, straight-on
slightly-high product shot, soft studio light, no shadow baked in, no plate, no
props, no text."

Burger example (7 layers + 1 assembled), warm light, tomato #e8452a build:
LAYER-1  a shiny sesame brioche bun TOP, <shared clause>
LAYER-2  a spread of burger sauce and melted cheese, <shared clause>
LAYER-3  a beef patty with grill marks, <shared clause>
LAYER-4  crispy bacon strips, <shared clause>
LAYER-5  a second beef patty with melted cheese, <shared clause>
LAYER-6  pickles and red onion rings and lettuce, <shared clause>
LAYER-7  a toasted brioche bun BOTTOM, <shared clause>
HERO     the whole burger assembled on a plain warm surface, one soft contact
         shadow, appetizing, <same light> — used as the assembled/poster frame
VID-1 (4s loop): the assembled burger, steam rising, camera pushes in slowly.
```
Rules: **same angle + scale + lighting across all layers** or they won't stack.
No baked-in shadows (the page draws one contact shadow). Transparent ground.
If an engine can't do transparency, generate on flat `#fbfaf7` and note that a
background-removal pass (`remove_background` if available) is needed. If nothing
can generate layers, fall back to a **single assembled hero** + A23 bleed, and
say the assembly effect needs layered art the user must supply.

Applies to any separable product: **burger, sneaker, phone, watch, cosmetic
bottle, coffee cup, engine part, furniture flat-pack.**

---

## Subject clauses by niche

Pair each with its preset's palette from `art-direction.md`.

| niche | subject clause | ban additions |
|---|---|---|
| **Restaurant** | a chef's pass at service, steam rising over plated food, warm practical lights out of focus behind | no stock-photo smiling, no cutlery flat-lays |
| **Hospital / clinic** | a bright corridor with soft daylight falling across it, a clinician walking away from camera, shallow focus | no visible patients, no medical gore, no branded equipment |
| **Dental** | a clean treatment room in morning light, instruments soft-focus, pale surfaces | no open mouths, no procedures |
| **Hotel / hospitality** | a suite interior at dusk, curtains half-drawn, one warm lamp, city bokeh beyond | no people, no beds made-up like a catalogue |
| **Gym / fitness** | a single athlete mid-effort in a dark hall, one hard rim light, chalk dust in the air | no gym-selfie framing, no logos on kit |
| **Law / finance** | a stone lobby, long shadows, an empty conference table, cold daylight | no handshakes, no gavels, no stock charts |
| **Real estate / architecture** | a poured-concrete interior with a single large window, dust in the light shaft | no wide-angle distortion, no furniture staging |
| **Salon / beauty** | a mirror-lit station, soft bounce light, product shapes out of focus | no faces in focus, no before/after framing |
| **Automotive** | a vehicle silhouette in a dark studio, one sweeping edge light along the body | no visible badges, no showroom floors |
| **Education** | an empty lecture hall in raking afternoon light, dust in the beam | no children's faces, no whiteboards with text |
| **Agency / creative** | translucent glass panels floating in a dark void, layered depth, wireframe geometry | no mockup screens, no dribbble-style gradients |
| **AI / SaaS / infra** | *use procedural geometry instead* — `gl-scenes.md` | — |

### Health & care
| niche | subject clause | ban additions |
|---|---|---|
| **Primary care / GP** | a small waiting room in warm daylight, empty chairs, plants, a reception desk out of focus | no visible patients, no clipboards, no stethoscope close-ups |
| **Urgent care / ER** | an ambulance bay at blue hour, doors open, interior light spilling onto wet tarmac | no injuries, no blood, no distress |
| **Paediatrics** | a bright playroom corner, soft toys out of focus, low sunlight across the floor | no children's faces, no cartoon styling |
| **Dermatology / aesthetics** | a treatment room with a large window, pale surfaces, one plant, soft diffused light | no skin close-ups, no before/after |
| **Physiotherapy / rehab** | an empty studio with mats and bars, low raking light, dust in the air | no exercises being performed, no injuries |
| **Mental health / therapy** | two empty armchairs facing each other, a window, late afternoon light | no faces, no clichéd couches, no head-in-hands |
| **Optometry** | a wall of frames in soft focus, one pair sharp on a lit surface | no eye close-ups, no eye charts |
| **Veterinary** | a bright consulting room, an examination table in daylight, leash on a hook | no distressed animals, no procedures |
| **Pharmacy** | ordered shelving in soft focus, one counter surface in sharp light | no readable labels, no branded packaging |
| **Care home / eldercare** | a sunlit lounge, armchairs by tall windows, a garden beyond | no residents' faces, no hospital beds |
| **Lab / diagnostics** | ranked sample racks under cool even light, shallow focus down the row | no biohazard imagery, no gore |

### Trades & services
| niche | subject clause | ban additions |
|---|---|---|
| **Plumbing / HVAC** | a clean utility space, copper pipework catching one hard light | no exposed grime, no logos on vans |
| **Electrical** | a consumer unit in a bare new-build, work light raking across the wall | no live wires, no unsafe practice |
| **Roofing / construction** | a timber frame against dusk sky, site lights below | no workers without PPE |
| **Cleaning** | an empty room after work, low sun across a polished floor | no products, no gloved hands |
| **Landscaping** | a garden at golden hour, one path leading out of frame | no lawn-mower catalogue framing |
| **Moving / logistics** | a loading bay at dawn, roller door half up, light shaft across the floor | no branded boxes |
| **Security** | an empty corridor at night, one camera silhouetted against a lit doorway | no weapons, no uniformed guards |

### Food, retail & leisure
| niche | subject clause | ban additions |
|---|---|---|
| **Café / bakery** | a counter at opening, steam off a cup, morning light through the window | no latte art top-downs |
| **Bar / nightlife** | backlit bottles, a dark room, one warm pool of light on the bar | no crowds, no branded bottles |
| **Grocery / market** | produce crates in raking daylight, deep shallow-focus row | no readable price tags |
| **Fashion / boutique** | a rail of garments in a bright empty shop, one shaft of daylight | no faces, no visible brands |
| **Jewellery** | a single object on dark velvet, one hard raking light, deep shadow | no hands, no ring-box clichés |
| **Furniture / interiors** | one chair in an empty concrete room, window light across it | no staged living rooms |
| **Pet store / grooming** | a warm shop interior, shelves out of focus, one sunlit patch on the floor | no distressed animals, no costumes |
| **Florist** | a work bench mid-arrangement, stems and paper, north light | no bouquet catalogue shots |
| **Travel / tour** | a landscape at first light, a single path or road leading away | no tourists, no landmarks with signage |
| **Events / weddings** | an empty set before guests, lights strung, dusk sky beyond | no couples, no confetti |

### Retail & specialty shops
The universal shop recipe: **an empty, well-lit interior at opening or after
close, product weighted to one side, one shaft or pool of light, negative space
for the headline.** Never faces, never readable brand names or price tags, never
a busy shop. For most shops the **Storefront (scene 35)** hero fits; specialised
ones get their own scene below. Default look P8 ORCHARD (warm) or P7 ENAMEL
(clean) unless the brand is premium/dark.

| niche | subject clause | scene | ban additions |
|---|---|---|---|
| **Car dealership / showroom** | a single vehicle silhouette on a polished floor, one sweeping edge light along the body, dark studio | Storefront / MonolithRow | no badges, no salespeople, no forecourt clutter |
| **Used-car lot** | a row of vehicle silhouettes under overhead lot lights at dusk | RouteMap / Storefront | no number plates, no dealer flags |
| **Tyre / tire shop** | a wall of stacked tyres in raking light, one hero tyre lit, dark garage | IsoBlocks | no brand sidewalls readable, no dirty floors |
| **Auto parts / spares** | ordered bins of parts receding into fog, one part lit on a bench | Storefront | no packaging logos, no grease |
| **Car wash / detailing** | water sheeting off a dark panel, droplets catching light, deep shadow | LiquidPlane | no people, no branded foam |
| **Motorcycle / bike shop** | one machine lit from the side in a dark space, chrome catching accent | CrystalCluster | no riders, no brand tanks |
| **Bicycle shop** | a single frame suspended, wheel spokes catching one light | Gyroscope | no cyclists, no logos |
| **Home mart / hardware / DIY** | aisles of ordered supplies receding, one endcap lit, warm store light | Storefront | no price tags, no brand packaging, no clutter |
| **Paint shop** | a wall of colour swatches out of focus, one lit tin on a counter | HalftoneField | no readable brand names |
| **Tile / flooring** | stacked sample boards fanned in raking light, one surface sharp | IsoBlocks | no showroom staging |
| **Lighting store** | rows of pendant forms glowing softly in a dark room | AuroraPlanes | no visible bulbs' brands |
| **Kitchenware / homeware** | a shelf of vessels in soft window light, one piece sharp | Storefront | no top-down flat-lays, no brands |
| **Furniture / décor** | one chair or object in an empty concrete room, window light | Storefront | no staged living rooms |
| **Juice / smoothie bar** | fruit and a glass on a lit counter, splash frozen mid-air, warm bokeh | PlateSteam / LiquidPlane | no faces, no brand cups, no straws-in-hand |
| **Dry fruits & nuts** | open sacks/bowls of nuts in warm raking light, one bowl sharp | PlateSteam | no plastic packaging, no price cards |
| **Spice shop** | mounds of coloured spice in cones under warm light, shallow focus | HalftoneField | no jars with labels, no hands |
| **Sweet shop / confectionery / mithai** | trays of sweets in a lit glass case, warm glow, deep shadow | Storefront | no faces, no branded boxes |
| **Chocolate shop** | a single praline on dark stone, one hard raking light | CrystalCluster | no wrappers, no hands |
| **Ice cream / gelato** | tubs of colour receding in a lit case, one scoop sharp | Storefront | no cones-in-hand, no brands |
| **Bakery / patisserie** | a counter at opening, warm loaves out of focus, one item lit | PlateSteam | no faces, no chef clichés |
| **Coffee roastery / tea shop** | beans or leaves cascading in warm light, steam rising behind | PlateSteam | no latte art, no mugs with logos |
| **Butcher / meat** | a clean cold counter, one cut on paper under bright light, tiled wall | Storefront | no blood, no gore, no faces |
| **Fishmonger / seafood** | ice bed under cool light, one fish sharp, deep shadow around | Storefront | no gore, no whole tanks |
| **Greengrocer / fruit & veg** | crates of produce in raking daylight, one crate sharp | Storefront | no price chalkboards readable |
| **Health food / organic store** | shelves of jars and grains in soft daylight, one lit | Storefront | no brand labels, no supplement claims |
| **Wine / liquor store** | backlit bottle silhouettes on dark shelving, one lit | Storefront | no readable labels, no drinking imagery |
| **Convenience / mini-mart** | a lit aisle at night through the window, shelves receding | Storefront | no brand packaging, no fluorescent glare |
| **Supermarket / superstore** | a long aisle receding into soft fog, overhead light lines | Storefront | no crowds, no trolleys, no brands |
| **Electronics store** | dark aisle with device silhouettes edge-lit, one screen glowing off | Storefront / IsoBlocks | no brand logos, no boxes |
| **Mobile / phone shop** | one device floating, edge-lit on black, reflection below | GlassSlab | no brand marks, no hands |
| **Computer / gaming store** | a dark room, one rig lit with accent, peripherals in shadow | CrystalCluster | no game screenshots, no logos |
| **Appliance store** | large matte forms in a lit showroom fog, one accent-lit | IsoBlocks | no brand badges |
| **Toy shop** | shelves of soft shapes out of focus, one warm sunlit patch | Storefront | no licensed characters, no faces |
| **Bookstore** | tall shelves receding, one shaft of light across the spines | Storefront | no readable titles, no faces |
| **Stationery / office supplies** | ordered rows in soft light, one object sharp on a desk | HalftoneField | no brands |
| **Gift shop** | a lit shelf of small objects, warm glow, shallow focus | Storefront | no price tags, no brands |
| **Sports goods** | gear silhouettes on a dark wall, one piece hard-lit | JerseyField | no team crests, no brands |
| **Shoe store** | a single shoe on a lit plinth, deep shadow, one rim light | GlassSlab | no feet, no brand marks |
| **Watch shop** | one watch on dark velvet, one hard raking light, macro shallow focus | CrystalCluster | no hands, no readable brands |
| **Perfume / fragrance** | a single bottle catching light in a soft haze, mist drifting | AuroraPlanes | no brand names, no models |
| **Cosmetics / makeup** | product forms in soft beauty light on a pale surface, one sharp | AuroraPlanes | no faces, no swatches-on-skin, no brands |
| **Optician / eyewear** | a wall of frames in soft focus, one pair sharp on a lit stand | Storefront | no eye close-ups, no eye charts |
| **Florist** | a work bench mid-arrangement, stems and paper, north light | LeafCanopy | no bouquet catalogue shots |
| **Plant / nursery / garden** | rows of foliage in a light shaft, dust in the beam, one plant sharp | LeafCanopy | no garden-centre signage |
| **Thrift / vintage** | a rail of mixed garments in warm dusty light, one shaft | Storefront | no faces, no brand labels |
| **Fabric / textile / tailor** | bolts of cloth stacked in raking light, one drape catching accent | FlowRibbons | no measuring clichés, no faces |
| **Dry cleaner / laundry** | a rail of covered garments receding under even light | Storefront | no faces, no brand tags |
| **Pawn / gold shop** | one gold object on dark stone, single hard light, deep shadow | CrystalCluster | no hands, no cash, no faces |
| **Music instrument shop** | one instrument lit in a dark room, others in shadow | Waveform | no players, no brand headstocks |
| **Vinyl / record store** | crates of sleeves receding, one record catching light | HalftoneField | no readable album art, no faces |
| **Art supplies** | tubes and brushes fanned in north light, one sharp | HalftoneField | no finished artwork, no brands |
| **Phone / device repair** | a clean bench, one device open under a task light, tools in shadow | Mechanism | no brand logos, no faces |

For any shop not listed, use the universal shop recipe above and the Storefront
scene. Keep it an **empty, lit, aspirational space** — never a busy shopfloor,
never a product with a readable brand, never a price tag.

### Professional & industrial
| niche | subject clause | ban additions |
|---|---|---|
| **Accounting** | a quiet office at dusk, one desk lamp, city beyond the glass | no calculators, no stock charts |
| **Insurance** | a stone facade in flat daylight, deep shadow under the eaves | no umbrellas, no family clichés |
| **Recruitment / HR** | an empty interview room, two chairs, daylight from one side | no handshakes, no CVs |
| **Manufacturing** | a machine hall, one line of overhead lights receding into haze | no workers' faces, no brand marks |
| **Energy / utilities** | turbines or pylons in low mist at dawn, long lens compression | no smokestacks, no protest imagery |
| **Agriculture** | a field at golden hour, one track running to the horizon | no machinery catalogue framing |
| **Marine / shipping** | containers stacked at blue hour, crane silhouette | no readable shipping lines |
| **Aviation** | an empty apron at dawn, ground lights receding | no visible airline liveries |

### Consumer & digital
| niche | subject clause | ban additions |
|---|---|---|
| **Photography / film** | a lit empty set, light stands, haze in the beam | no cameras as hero subject |
| **Music / studio** | a live room in low light, one instrument lit, cables coiled | no artists' faces |
| **Podcast** | a treated room, one mic in a pool of light, everything else dark | no headphones-on-model shots |
| **Gaming / esports** | a dark arena, one seat lit, screens off | no game screenshots, no logos |
| **Fintech / crypto** | *procedural geometry* — `gl-scenes.md` | — |
| **Non-profit / charity** | hands at work on something ordinary, no faces, warm daylight | no poverty imagery, no saviour framing |
| **Religious / community** | an empty hall with light through high windows, dust in the beam | no worshippers, no denominational symbols |
| **Sports club** | an empty pitch or court under floodlights at dusk | no team crests, no player faces |

### More services & modern businesses
| niche | subject clause | ban additions |
|---|---|---|
| **SaaS / startup** | *procedural geometry* — `gl-scenes.md` (NodeGraph / ParticleRepel) | no dashboard screenshots, no logos |
| **Web3 / crypto / NFT** | *procedural* — CrystalCluster or Wormhole, dark | no coin logos, no charts |
| **Coworking space** | an empty modern workspace at golden hour, plants, one lit desk | no people, no brand mugs |
| **Tattoo studio** | a clean dark studio, one lamp over an empty chair, ink bottles in shadow | no skin, no tattoos in progress, no faces |
| **Nail salon** | a bright station, tools and polish rows out of focus, one sharp | no hands, no feet, no faces |
| **Yoga / pilates studio** | an empty sunlit studio, mats rolled, one shaft of light | no bodies in poses, no faces |
| **Martial arts / dojo** | an empty mat hall, low raking light, one belt on a hook | no fighters, no faces |
| **Daycare / preschool** | a bright playroom corner, soft shapes out of focus, low sun | no children, no faces, no cartoon styling |
| **Driving school** | an empty road at dawn stretching to the horizon, one cone lit | no cars with plates, no learners |
| **Mortgage / loans broker** | a stone facade in flat daylight, keys on a clean surface | no handshakes, no house clichés |
| **Solar / renewables** | panels or turbines catching first light, long-lens haze | no smokestacks, no protest imagery |
| **Pool service** | still turquoise water, one ripple catching light, clean tile edge | no swimmers, no faces |
| **Pest control** | a clean home exterior at dusk, one porch light, calm | no insects, no gore, no hazmat drama |
| **Catering** | a plated course on a lit pass, warm bokeh behind | no faces, no buffet clutter |
| **Meal prep / subscription box** | neat containers of fresh food in soft daylight, one sharp | no brand packaging, no hands |
| **Brewery / winery / distillery** | copper tanks or barrels in low warm light, one lit | no readable labels, no drinking imagery |
| **Art gallery / museum** | a bright empty gallery, one framed void on a wall, raking light | no recognisable artworks |
| **Theatre / cinema** | empty seats facing a dark stage/screen, one spotlight | no films, no audience, no faces |
| **Recording studio** | a dim control room, one console light, monitors off | no artists, no brand gear |
| **Game / animation studio** | a dark room, one screen glow off, sculptural forms | no game screenshots, no logos |
| **Travel agency** | a landscape at first light, a single path leading away | no tourists, no landmark signage |
| **Hostel / B&B / glamping** | a warm-lit room or tent interior at dusk, one lamp, view beyond | no people, no catalogue staging |
| **Personal trainer / coach** | a single kettlebell or rope in a dark gym, one hard light | no bodies, no faces |
| **Chiropractor / physio** | an empty treatment room, table in soft daylight, calm | no procedures, no bodies, no faces |
| **Nutritionist / dietitian** | fresh produce arranged in raking daylight, one sharp | no faces, no diet clichés, no scales |
| **Pet boarding / grooming** | a warm clean kennel/salon interior, leash on a hook, sunlit floor | no distressed animals, no cages-as-focus |
| **Locksmith / security** | a clean lock or keyset on dark steel, one hard light | no break-in imagery, no faces |
| **Interior / landscape design** | one designed corner in a light shaft, dust in the beam | no full staged rooms, no people |

### Portfolios & personal brands
A portfolio's real content is the **work**, not a stock scene — so most portfolio
heroes are best served by **procedural geometry or a typographic hero** (Rung 4),
with the person's actual project images (user-supplied, Rung 1) in the work rail.
Generate an atmospheric hero only when the discipline is visual and the person
has no hero shot yet.

| niche | look default | hero subject (if generating) | ban additions |
|---|---|---|---|
| **Developer / engineer** | Dark VOID or Light ENAMEL | abstract node-and-line architecture in a void | no code on screen, no IDE, no faces |
| **Designer (product/UI)** | Light ENAMEL | floating translucent UI panels at depth, one accent | no real app screenshots, no dribbble gradients |
| **Photographer** | Light ENAMEL or Dark TAPE | *use their photos* — else a lit empty set, haze | no cameras as hero, no faces |
| **Filmmaker / video** | Dark TAPE | a lit empty set, light stands, volumetric haze | no clapperboards, no faces |
| **3D / motion artist** | Dark VOID | one sculptural procedural form, studio rim light | no software UI, no turntable clichés |
| **Illustrator / artist** | Warm ORCHARD or Light | a bright studio corner, tools out of focus, north light | no finished artwork as hero (put it in the rail) |
| **Writer / journalist** | Light ENAMEL | pure typographic hero, no image | no typewriters, no coffee-and-notebook cliché |
| **Architect** | Light ENAMEL or KILN | a poured-concrete interior, one shaft of daylight | no furniture staging, no wide-angle distortion |
| **Musician / producer** | Dark CIRCUIT or TAPE | a live room in low light, one instrument lit | no artists' faces, no logos |
| **Model / actor** | Dark TAPE | *their own shots only* (Rung 1) | never generate a person — use supplied images |
| **Founder / consultant** | Corporate VAULT or Light | a stone lobby / empty desk, cold daylight | no handshakes, no stock boardrooms |
| **Student / new grad** | Light ENAMEL | typographic hero + one procedural mark | no graduation-cap clichés |
| **Agency / studio (multi-person)** | Dark VOID or Light | floating glass panels, layered depth | no team-photo hero, no mockups |

**Rule for any portfolio:** the hero sets the tone, but the **work rail carries
the proof** — reserve those slots for the person's real project images (Rung 1).
If they have none yet, use tasteful placeholders' *procedural* stand-ins, never
stock photos pretending to be their work.

For a niche not listed: name the **place**, the **light**, and **one moving
thing**. Never name a brand, never ask for text in the image, and never put a
recognisable face in frame — faces date a site faster than anything else and
carry likeness problems you do not want.

---

## Wiring the result in

1. Take the `result_url` from `jobs_wait` — it is already a CDN URL, use it
   directly. Never download and re-host.
2. Put it in the spec's asset table with its role, before writing any markup.
3. **Read the image** before shipping it. Check: is the negative space where you
   asked? Is there accidental text? Is the subject on the right side?
   Regenerate once if not — do not build around a bad plate.
4. Follow the loading discipline in `video.md` V1: poster preloaded
   `fetchpriority="high"`, `<source>` attached after `window.load`.

---

## Zero-asset visuals — often the right answer, not the fallback

Ranked by how expensive they look, best first. All are pure code, zero bytes,
zero load failure.

| technique | how | best for |
|---|---|---|
| **Procedural WebGL** | `gl-scenes.md` — lattice, grid floor, node graph, monoliths | tech, AI, finance, anything abstract |
| **CSS perspective floor** | `repeating-linear-gradient` + `rotateX(64deg)` + mask fade | any dark page; already in `core.css` `.fallback` |
| **SVG duotone shapes** | 2–3 large overlapping organic paths, `mix-blend-mode: multiply`, two palette colours | clinics, wellness, education, consumer |
| **Generated noise / grain** | inline `feTurbulence` data-URI at `opacity:.055`, `mix-blend-mode:overlay` | universal — already in `core.css` `.grain` |
| **Typographic hero** | the headline *is* the visual: `clamp(3rem,11vw,11rem)`, `line-height:.79`, huge negative space | law, consulting, agencies, editorial |
| **Canvas gradient mesh** | 3–4 radial gradients drifting on the rAF loop, blurred, low opacity | hospitality, beauty, lifestyle |
| **Data-driven marks** | draw the business's own numbers as arcs / bars / lines (`interactions.md` I7) | clinics, logistics, SaaS |

Rules: pick **one** per page. Keep it behind the grain and vignette so it reads
as material rather than decoration. It must still look intentional under
`html.no-gl` and reduced motion.

### Which compositions want zero assets
| archetype | verdict |
|---|---|
| A11 final-cta, A13 single-viewport, A21 form panel | **always** — space is the point |
| A1 hero, A18 sequential | either; procedural WebGL usually wins |
| A16 mosaic, A20 photo floor | **needs real photographs** — the layout *is* the image |
| A14 spotlight, A9 media-act | needs a photograph, and a second grade of it |

If a niche has nothing to photograph — software, consulting, finance, legal,
insurance — do not force one. Those are exactly the pages that look most
expensive with type, space, grain and one procedural mark.

## When to skip generation

- The user supplied URLs → use theirs verbatim, generate nothing.
- The niche is abstract tech (AI, dev tools, data) → procedural geometry looks
  better than any generated photo, and weighs nothing.
- The user said "procedural only" or has no credits.
- A single-viewport build where the composition is pure typography.
