/**
 * eventPools.js — Event Diversity System
 *
 * Guarantees structural variety across stories even when the same theme
 * or blueprint repeats, by pre-selecting a mandatory EVENT CHAIN before
 * Gemini generates the story.
 *
 * Each theme has 5 pools:
 *   START   — pages 1–2:   how the inciting moment unfolds
 *   MID_A   — pages 3–5:   first obstacle / encounter
 *   MID_B   — pages 6–8:   complication / something goes wrong
 *   MID_C   — pages 9–11:  turning point / revelation
 *   END     — pages 15–16: resolution type
 *
 * Events are deliberately broad so they work with any blueprint in the theme
 * while still forcing structural variety.
 */

// ---------------------------------------------------------------------------
// Hash — FNV-1a 32-bit (independent copy so this module has no deps)
// ---------------------------------------------------------------------------
function fnv1a(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = (h * 0x01000193) >>> 0
  }
  return h
}

function pick(arr, seed, salt) {
  const h = fnv1a(String(seed) + '||' + salt)
  return arr[h % arr.length]
}

// ---------------------------------------------------------------------------
// EVENT POOLS — 6 themes × 5 page-group phases × 5–6 options each
// ---------------------------------------------------------------------------

const EVENT_POOLS = {

  // ── JUNGLE ──────────────────────────────────────────────────────────────────
  jungle: {
    start: [
      'Child follows a glowing creature that vanishes the moment they hesitate — forward is the only option',
      'Child discovers something visibly wrong in the jungle and every creature is waiting, watching to see what they do',
      'A creature arrives carrying something and places it at the child\'s feet — a gift that turns out to be a task',
      'Child finds a trail of objects leading deeper in, each one stranger and more personal than the last',
      'Child stumbles into a clearing where jungle creatures have gathered in silence — as though they expected someone exactly like this',
      'Child is told clearly not to go somewhere and immediately hears a sound from exactly that direction',
    ],
    mid_a: [
      'A stubborn gatekeeper creature bars the way and the child must find what it actually needs before it will move',
      'Something that should be easy — crossing a stream, climbing a root — becomes impossible in a way that makes no sense',
      'Child encounters a creature in visible distress and stopping to help costs them time they do not have',
      'A rule of this jungle reveals itself the hard way — the child broke it without knowing and must now fix it',
      'The path divides and both directions seem equally right; waiting for certainty is not an option',
      'Child must speak to a creature that does not share their language and figure out what it is trying to say',
    ],
    mid_b: [
      'Something the child brought from the human world turns out to be the key — but using it means letting it go',
      'The helper creature stops and admits it cannot go further — the child must continue alone from here',
      'What seemed like the goal turns out to be wrong; the real destination is somewhere the child has already passed',
      'A mistake made earlier surfaces and demands to be corrected before anything else can move forward',
      'Two creatures give opposite instructions and both seem to be telling the truth',
      'The most direct path is blocked; the only way through requires doing the opposite of what feels right',
    ],
    mid_c: [
      'Child realizes the creature they were following was actually following them — waiting for the child to lead',
      'The thing they sought was with them all along, transformed beyond recognition by the journey itself',
      'What looked like failure turns out to have been the actual test — the child passed without knowing',
      'The creature who seemed to be in the way is revealed as the most important ally in the whole story',
      'Child discovers the journey was never about the destination — something in them had to change first',
      'An unexpected connection appears between the beginning and now — the child suddenly understands everything',
    ],
    end: [
      'Child returns changed in a way that does not need explaining — the jungle acknowledges it with a single sound',
      'The journey ends exactly where it started, but the child is not the same and the jungle knows it',
      'Child must give something away to complete what they came to do — and letting go feels exactly right',
      'Resolution comes quietly: one small gesture, one creature\'s response, and it is done',
      'Child and the jungle reach a wordless agreement — sealed by something specific only they will remember',
      'The creature who first called the child appears one last time to confirm: the task is complete',
    ],
  },

  // ── SPACE ───────────────────────────────────────────────────────────────────
  space: {
    start: [
      'A signal appears on the child\'s screen — blinking in a pattern that no instrument can explain but the child immediately understands',
      'Child\'s small craft drifts off course and arrives somewhere no map shows — and something there was clearly expecting them',
      'A mysterious object floats through the airlock, too deliberate to be random, too strange to ignore',
      'Child spots something through the porthole that the instruments say is not there — only they can see it',
      'Engines go silent in exactly the wrong place and restarting them requires going outside alone',
      'A distress call arrives from a direction that should be empty space — and it is using the child\'s name',
    ],
    mid_a: [
      'Child must navigate through an asteroid field using only pattern recognition — instruments are useless here',
      'A creature or being blocks the route and will not move until the child solves something it poses',
      'Life support in one section fails and fixing it means going somewhere the child was warned to avoid',
      'Child must communicate with an entity that does not use language — only shapes, timing, or light',
      'The route requires passing through a region that changes the rules of how things work',
      'Child finds a damaged craft with something inside that is still alive and now becomes their responsibility',
    ],
    mid_b: [
      'Equipment the child counted on fails and must be replaced with something improvised from what is already here',
      'The map or plan was wrong — the real destination is completely different and requires backtracking',
      'An alien entity that has been following quietly reveals itself and its intentions are unclear',
      'A decision made at the start turns out to have had consequences that only become visible now',
      'Child must choose between completing the mission and helping someone else — there is no path that does both',
      'Time is running out and the only remaining option involves trusting something the child still does not understand',
    ],
    mid_c: [
      'Child discovers the signal or call was not a distress — it was a test to see who would come',
      'The creature or entity the child was sent to find turns out to have been guiding them all along',
      'What the child assumed was the goal is revealed as a misunderstanding — the real mission is something deeper',
      'A piece of information the child had from the beginning finally makes sense — and changes everything',
      'Child realizes that what seemed like an obstacle was actually a gift in the wrong packaging',
      'The child\'s greatest worry — the thing they most feared — turns out to be the exact thing that saves them',
    ],
    end: [
      'Child transmits something back — a discovery, a message, a proof — and waits to see if it arrives',
      'The journey\'s end is not a place but a moment: the child understands something they could not have before',
      'Child must leave behind something real to complete the mission — and realizes it was worth it',
      'The stars that seemed cold and empty turn out to have been watching — and something in them shifts',
      'Child returns to find the world they left slightly different — or discovers that they are what changed',
      'Final resolution comes from the most unexpected direction: the entity or being that started it all',
    ],
  },

  // ── OCEAN ───────────────────────────────────────────────────────────────────
  ocean: {
    start: [
      'Something surfaces near the child — too deliberate to be random, too large to be ordinary — and waits',
      'Child dives and discovers a world below that operates by completely different rules than the surface',
      'A current pulls the child somewhere they were not going, deposits them somewhere they were not expecting',
      'Child finds an object washed up that clearly does not belong — and following where it came from becomes necessary',
      'A sea creature appears and clearly wants the child to follow — urgency in every movement',
      'Child notices the sea is behaving wrongly in a small but specific way that no one else sees',
    ],
    mid_a: [
      'A deep-water creature will not let the child pass until they prove they understand the ocean\'s rules',
      'Visibility drops to zero and navigation requires listening instead of seeing',
      'Child encounters an underwater community with its own laws — and has accidentally broken one',
      'Something is caught or trapped and freeing it means going somewhere the current will not allow return from easily',
      'Child must find a way between two competing ocean forces that seem to cancel each other out',
      'A creature in trouble offers to help in exchange for help — but the child does not know if it can be trusted',
    ],
    mid_b: [
      'The tool or skill the child relied on does not work underwater the same way — must adapt or fail',
      'The way back closes — current shifts, something blocks it — and continuing forward becomes the only option',
      'Child discovers the real reason for the journey is different from what they thought at the surface',
      'A choice surfaces between what is right and what is fast, and the wrong choice would be easy to make',
      'An underwater creature who seemed unfriendly turns out to be the only one who knows the way',
      'The ocean itself seems to be giving the child a message — but it takes the whole middle of the story to read it',
    ],
    mid_c: [
      'Child realizes the creature they followed was the one who needed to be followed — not the guide',
      'What looked like an obstacle is revealed as an entrance to the place the child was actually looking for',
      'Child discovers that the ocean remembers everyone who has ever passed through this place — including them',
      'A secret about the ocean\'s problem surfaces: it is older and stranger than the child could have guessed',
      'The child\'s own fear — of depth, of dark, of silence — turns out to be where the answer was hiding',
      'Something from the beginning of the journey reappears completely transformed, and now the child understands it',
    ],
    end: [
      'Child returns to the surface carrying only knowledge — but that knowledge changes everything above the water',
      'The sea makes a gesture of recognition: something only happens once and only the child is there to see it',
      'Child must release something into the ocean to complete what they came to do — it is harder than expected',
      'Resolution is not announced — it simply is: the child surfaces and the water is different behind them',
      'Child and the ocean reach a private understanding sealed by an object, a sound, or a silence',
      'The creature who called the child appears one last time, deeper than before — and they are both ready',
    ],
  },

  // ── FOREST ──────────────────────────────────────────────────────────────────
  forest: {
    start: [
      'Child notices the forest edge behaving strangely — trees that were not there yesterday, a path that opened overnight',
      'A small creature arrives carrying something and leaves it at the child\'s feet without explanation',
      'Child hears a sound in the forest that no other person seems to notice — only them',
      'Something in the forest is clearly wrong: a colour that should not be there, a silence that has a shape',
      'Child follows a trail of flowers, feathers, or prints that could only have been left deliberately',
      'An old part of the forest that was always closed is now open — and something has just come out of it',
    ],
    mid_a: [
      'A forest guardian — old, patient, testing — stands between the child and the deeper forest',
      'Child loses the trail and must figure out a different way of navigating that makes no logical sense',
      'An injured creature blocks the path — it cannot be left behind but carrying it complicates everything',
      'Child must learn a forest rule through consequences before they can apply it to move forward',
      'Two paths appear and every instinct says to take the wrong one — taking the right one requires overriding instinct',
      'Child discovers they are not the first here — something was left behind, and it is now their responsibility',
    ],
    mid_b: [
      'Weather or season changes suddenly in a way the forest seems to have chosen deliberately',
      'The creature guiding the child stops and reveals it is lost too — leadership passes to the child',
      'Child realizes the forest is not a place they are moving through — it is responding to them specifically',
      'An earlier choice resurfaces as a problem and the child must return to a moment they thought was finished',
      'Two forest creatures need help simultaneously and only one can be helped first',
      'Night falls unexpectedly and the forest is an entirely different world in the dark',
    ],
    mid_c: [
      'Child realizes the forest led them here on purpose — this was the destination all along, not a waypoint',
      'What the child thought was their goal is revealed as the beginning — the real work starts now',
      'A creature who was following in silence finally speaks — and what it says changes the whole shape of the story',
      'Child finds evidence that the forest itself is a living being with its own memory and intention',
      'The most frightening part of the forest turns out to be where it is safest — and most necessary to go',
      'An object or detail from the very start of the journey reappears and finally makes complete sense',
    ],
    end: [
      'Child plants or places something in the forest — a permanent mark that the forest will grow around',
      'Forest returns to how it was — but the child carries something invisible that did not exist before',
      'Resolution comes in the form of a sound: the forest exhales, and all the creatures do too',
      'Child is guided back by the same creature that started everything — now moving differently than before',
      'The forest makes one final gesture — specific, unexpected, and perfectly right — and it is enough',
      'Child leaves by a path that was not there before, made just for this exit and this moment',
    ],
  },

  // ── DESERT ──────────────────────────────────────────────────────────────────
  desert: {
    start: [
      'Child sees something on the horizon that should not exist in a desert — and it does not disappear when approached',
      'A desert creature appears from below the sand and behaves as though it has been waiting specifically for this child',
      'Child finds an object half-buried in a dune — old, unusual, impossible to ignore — and picking it up starts everything',
      'A sandstorm parts in exactly one direction, leaving a corridor that closes the moment the child enters it',
      'Child notices that their footprints in the sand lead toward something rather than away from where they started',
      'A sound rises from beneath the sand — rhythmic, intentional — and it matches the child\'s heartbeat',
    ],
    mid_a: [
      'A vast, featureless plain must be crossed with no landmarks and the only guide is something internal',
      'Child encounters a mirage that turns out to be real — but not in any way that was expected',
      'A desert creature demands proof of something before it will share what it knows',
      'The heat, the thirst, or the light creates a challenge that cannot be solved by moving faster',
      'Child must find water — or the equivalent of it for this desert\'s rules — using only observation',
      'An impassable barrier of rock, dune, or heat forces a route that the child was not prepared for',
    ],
    mid_b: [
      'Night falls and the desert becomes a completely different landscape — colder, stranger, more revealing',
      'The guide or companion can go no further — the child continues with only what they remember',
      'Child realizes the desert is not empty — it is full of something invisible that has been here much longer',
      'A decision made in daylight turns out to have been wrong; the desert corrects it now',
      'Child must give up something practical to gain something that does not seem useful — and it is the right choice',
      'Two desert creatures describe the way forward in incompatible terms — both are telling a kind of truth',
    ],
    mid_c: [
      'Child realizes the desert has been guiding them the entire time — what seemed like obstacles were directions',
      'What appeared to be an oasis turns out to be the actual problem — the solution is what surrounds it',
      'A creature who seemed to be following turns out to have arrived first — and knows why the child is here',
      'The child\'s greatest obstacle turns out to be made of the same material as their greatest strength',
      'Sand shifts to reveal something ancient that has been waiting specifically for this moment',
      'Child discovers that arriving here required becoming someone who was ready to arrive here — and they already are',
    ],
    end: [
      'Child leaves a mark in the desert that will remain until the next wind — which is long enough',
      'The desert does not change, but the child does — and the way back looks nothing like the way in',
      'Resolution is sealed by the desert itself: a final shift of sand, light, or wind at exactly the right moment',
      'Child releases something into the desert — lets it go — and the desert acknowledges this in its own language',
      'The creature from the beginning reappears at the end and leads the child out — differently than it led them in',
      'Child stands at the desert\'s edge and looks back; what they see confirms everything was worth it',
    ],
  },

  // ── FARM ────────────────────────────────────────────────────────────────────
  farm: {
    start: [
      'Child notices that one animal on the farm is behaving differently — with a kind of urgency that cannot be ignored',
      'Something is missing from the farm that was there yesterday — and the animals all seem to know what happened',
      'An unusual visitor arrives at the farm, unexpected and out of place, and it needs something only the child can give',
      'Child discovers a part of the farm they never knew existed — and inside it, something is asking to be found',
      'A crop, a nest, or a pen shows signs of something that should not be possible but clearly is',
      'The farm wakes up wrong: sounds that should be there are absent, and something is waiting in the silence',
    ],
    mid_a: [
      'Child must communicate with an animal that normally does not interact with people — and figure out its actual need',
      'A task that should be simple — fetching, fixing, carrying — reveals itself to be the entry to something larger',
      'Two animals need help at the same time and their needs pull in opposite directions',
      'Child must do something for the first time, with no instruction, and do it correctly on the first attempt',
      'The rest of the farm cannot see what the child sees — they must act on knowledge no one else will confirm',
      'A boundary on the farm — a fence, a hedge, a locked gate — must be crossed and only the child can decide if it is right',
    ],
    mid_b: [
      'Weather threatens the farm and there is not enough time to do everything that needs to be done — choices must be made',
      'Child discovers the problem runs deeper than the farm — it started somewhere else and must be followed there',
      'An animal that was supposed to help is frightened and can no longer — the child must go forward alone',
      'Child realizes they have been solving the wrong problem and must start over with less time than before',
      'The farm itself seems to have a memory of what happened before the child was born, and it is relevant now',
      'Something fixed earlier has come undone — the real solution requires understanding why, not just patching it again',
    ],
    mid_c: [
      'Child discovers that the animal who first showed distress was trying to lead them here from the beginning',
      'The solution is something simple that has been present all along — the child had to become ready to see it',
      'An elder animal reveals a farm secret that changes the shape of the whole problem',
      'What seemed like a failure on the child\'s part turns out to have set up the only possible good outcome',
      'The farm reveals it has been tending the child just as much as the child has been tending it',
      'Two pieces of the mystery that seemed unrelated connect suddenly and completely',
    ],
    end: [
      'Child performs one final act of care — planting, mending, releasing — that seals the resolution',
      'The farm returns to its ordinary rhythm, but the animal or place at the center of everything is visibly different',
      'Resolution is marked by a small, specific animal behaviour that only means something to the child',
      'Child and the farm share a quiet moment — nothing dramatic, but exactly enough',
      'The animal who started everything returns to normal, and watching it do so is the ending',
      'Child places something in the farm — a stone, a seed, a gesture — and the farm closes gently around it',
    ],
  },
}

// ---------------------------------------------------------------------------
// Build event chain — deterministic, uses orderId + blueprintId for entropy
// ---------------------------------------------------------------------------

/**
 * Selects a mandatory event chain for a story.
 * Uses FNV hash of orderId + blueprintId to ensure:
 *   - Same order always gets same events (consistency)
 *   - Different blueprints of the same theme get different events
 *   - Same blueprint with different orderIds gets different events
 *
 * @param {string} orderId
 * @param {string} blueprintId
 * @param {string} theme
 * @returns {{ start, mid_a, mid_b, mid_c, end, summary }}
 */
export function buildEventChain(orderId, blueprintId, theme) {
  const pools = EVENT_POOLS[theme] || EVENT_POOLS.forest
  const base  = (orderId || '') + '|' + (blueprintId || '') + '|' + (theme || '')

  const start = pick(pools.start, fnv1a(base + '::start'), 'EVT_START')
  const mid_a = pick(pools.mid_a, fnv1a(base + '::mid_a'), 'EVT_MIDA')
  const mid_b = pick(pools.mid_b, fnv1a(base + '::mid_b'), 'EVT_MIDB')
  const mid_c = pick(pools.mid_c, fnv1a(base + '::mid_c'), 'EVT_MIDC')
  const end   = pick(pools.end,   fnv1a(base + '::end'),   'EVT_END')

  const summary = [
    `START=${start.slice(0, 50)}`,
    `MID_A=${mid_a.slice(0, 50)}`,
    `MID_B=${mid_b.slice(0, 50)}`,
    `MID_C=${mid_c.slice(0, 50)}`,
    `END=${end.slice(0, 50)}`,
  ].join(' | ')

  return { start, mid_a, mid_b, mid_c, end, summary }
}
