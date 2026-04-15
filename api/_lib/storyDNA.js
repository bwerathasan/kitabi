/**
 * storyDNA.js — Story DNA System
 *
 * Architecture:
 *   1. 5 concrete PLOT BLUEPRINTS per theme — each a completely different story premise
 *   2. 10 cross-cutting DNA dimensions — tone, pacing, conflict, etc.
 *   3. Theme-specific secondary character pool — additional cast variety
 *   4. FNV-1a hash applied independently per dimension with unique salt
 *
 * Same orderId → same DNA (PDF + image consistency)
 * Different orderId or different theme → statistically very different blueprint + DNA
 *
 * With 5 blueprints × 5 structures × 10 goals × 6 tones × 5 pacings ×
 * 6 conflicts × 6 helpers × 6 twists × 6 endings × 5 narratives × 6 openings
 * = 58,968,750,000 unique combinations
 */

// ---------------------------------------------------------------------------
// Hash — FNV-1a 32-bit
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
// THEME BLUEPRINTS — 5 completely different plot premises per theme
// This is the primary variation driver. Each blueprint forces a different story.
// ---------------------------------------------------------------------------
export const THEME_BLUEPRINTS = {
  jungle: [
    {
      id: 'jungle_moonlit_lost',
      premise: 'The child wanders into a moonlit jungle alone and must find the way back through a living forest that seems to want to help — but keeps leading deeper in instead of out',
      setting_variant: 'silver-moonlit jungle at night, fireflies forming paths that disappear, ancient roots as tall as houses, the canopy blocking all stars except one',
      protagonist_role: 'lost wanderer who must learn to trust the jungle before it will guide them home',
      inciting_incident: 'a firefly lands on the child\'s finger, lights up three times, and starts moving — clearly asking to be followed, deeper not outward',
      supporting_cast: ['a 200-year-old tortoise who speaks very slowly but says only truth', 'a baby monkey who cannot stop following the child and accidentally helps at the worst moments'],
      core_challenge: 'the jungle will guide you home only after you help it with something first — and finding what it needs takes the whole journey',
      world_detail: 'the jungle communicates through sound patterns: three rustles mean danger ahead, two means turn here, one long whisper means you are close to what you are looking for',
    },
    {
      id: 'jungle_dying_heart',
      premise: 'The oldest tree at the heart of the jungle is dying and only the child can hear its call — all the creatures feel it but none know how to help',
      setting_variant: 'deep vine-cathedral jungle where golden light falls in columns and the further in you go the louder the silence of one dying tree becomes',
      protagonist_role: 'the only being who can hear what the great tree is actually asking for',
      inciting_incident: 'a single leaf falls and lands on the child\'s face like a soft hand — and in that touch the child hears a faint voice saying a single word',
      supporting_cast: ['a weary parrot who has guarded the ancient tree for generations and is exhausted', 'a cloud of glowing butterflies that form arrows pointing the way'],
      core_challenge: 'the tree does not need water or medicine — it needs someone to hear its story before it sleeps, and the child must find all four parts of that story',
      world_detail: 'every creature in this jungle draws life from the great tree like a root system — when it grieves, the animals grieve; when it is heard, they all exhale',
    },
    {
      id: 'jungle_last_creature',
      premise: 'The last of an unknown creature is trapped in the forbidden zone — and a sound unlike anything in nature is coming from inside it',
      setting_variant: 'stormy jungle where waterfalls crash so loud you must shout, mist so thick the trees ahead appear only when you are nearly touching them',
      protagonist_role: 'the rescuer who believed the sound was real when everyone else called it thunder',
      inciting_incident: 'in a pause between thunderclaps, a sound cuts through — half-cry, half-music — and the child knows immediately it is asking for help',
      supporting_cast: ['a river otter who knows every waterway and offers to navigate if the child protects her from the storm', 'a grumpy elephant who refuses to enter the forbidden zone but cannot stop worrying'],
      core_challenge: 'three barriers block the path: a flooded gorge, a thorn wall only an animal can navigate, and a last test the creature itself sets for anyone who comes',
      world_detail: 'the forbidden zone is forbidden not because it is dangerous but because it is where creatures go when they no longer want to be found — entering requires an invitation',
    },
    {
      id: 'jungle_ancient_map',
      premise: 'A symbol carved into a tree matches one the child drew in a dream — following its meaning leads through four jungle trials to something that should not exist here',
      setting_variant: 'dawn jungle dripping with dew, ancient carved stones half-buried in moss, paths that seem freshly used but by feet much smaller than human',
      protagonist_role: 'the young archaeologist who read the first symbol right when no adult has in centuries',
      inciting_incident: 'the child\'s hand traces a carved symbol and warmth floods up their arm — a sudden, certain knowledge of what the symbol means',
      supporting_cast: ['a chameleon who changes color to say yes, no, danger, and safe', 'a trio of young jungle animals who know all the old stories and have been waiting for someone to come'],
      core_challenge: 'four carved symbols, four locations, four trials that test listening instead of strength — the treasure at the end is living',
      world_detail: 'the jungle was once a great civilization of small beings who chose to become trees and rivers — their messages are still legible if you know their alphabet',
    },
    {
      id: 'jungle_two_sides',
      premise: 'The jungle is split by a dead strip — lush on both sides but nothing grows between — and animals on each side have not spoken in generations. The child crosses without thinking.',
      setting_variant: 'jungle divided down its center by a bone-dry riverbed fifty steps wide, dead as ash, with thriving green on each side and animals watching from a distance',
      protagonist_role: 'the accidental bridge — the first being to cross in living memory',
      inciting_incident: 'the child steps across the dead strip simply because it is in the way, and both sides of the jungle go utterly silent and turn to look',
      supporting_cast: ['a proud lion from the eastern jungle who has never questioned the divide', 'an old tigress from the western side who remembers, just barely, when there was no divide at all'],
      core_challenge: 'the child must find the original misunderstanding — a single misheard message from long ago — and carry it to both sides before they declare the final war',
      world_detail: 'the dead strip will bloom the moment both sides remember the old rain-song they used to sing together — the child is the only one who does not know they already know it',
    },
  ],

  space: [
    {
      id: 'space_message_in_dream',
      premise: 'A signal from an unmapped planet has been playing as a melody the child knows from a recurring dream — and the child is the only one who can decipher it',
      setting_variant: 'deep space with a purple nebula ahead like a doorway, asteroids that hum at different frequencies, a single bright planet blinking at irregular intervals',
      protagonist_role: 'the decoder — the only mind that recognizes the dream-melody as a message',
      inciting_incident: 'the signal plays over ship speakers and the child stands up because they are already humming along — they learned this melody in a dream they have had ten times',
      supporting_cast: ['a small robot whose emotion chip is broken and who desperately wants to understand feelings', 'an ancient comet who has passed through every solar system and seen everything once'],
      core_challenge: 'the melody has five parts; each part can only be heard in a different region of space — and something else is also following the signal',
      world_detail: 'some asteroids are sleeping beings that wake when music touches them — the melody will wake five of them, and each one holds a part of the message',
    },
    {
      id: 'space_dying_stars',
      premise: 'Stars in one sector of the galaxy are going out one by one — not dying but disappearing — and the darkness is spreading toward the child\'s home system',
      setting_variant: 'galaxy where extinguished star-holes gape like dark wounds and the remaining stars burn desperately bright as if afraid',
      protagonist_role: 'the light-keeper sent to find what is taking the stars',
      inciting_incident: 'the child catches a falling star — it lands in their palm warm and small and says one word before going dark: "lonely"',
      supporting_cast: ['a star-sprite who is the last survivor of three extinguished stars and is barely visible', 'a ringed planet who has been watching and has a theory but is afraid it is correct'],
      core_challenge: 'the darkness is not evil — it is an ancient being that has forgotten what light felt like and is collecting stars trying to remember — it must be helped, not fought',
      world_detail: 'stars do not simply shine — they are in constant conversation with each other through light-pulse patterns; the extinguished ones went silent first, then disappeared',
    },
    {
      id: 'space_hidden_planet',
      premise: 'A small inhabited planet has hidden itself — not been destroyed — and its people are sending silent distress calls that appear as impossible details: a handprint on a ship window from inside with no one there',
      setting_variant: 'outer solar system where planets breathe visible light and cosmic dust arranges itself in slow shapes that look almost intentional',
      protagonist_role: 'the cosmic detective following faint impossible trails',
      inciting_incident: 'the child\'s own breath fogs the ship window from the inside — and when it clears, a small handprint is already on the glass from the other side',
      supporting_cast: ['a moon who has secretly been watching over the hidden planet for three years and is ready to help', 'a nebula made entirely of memories that replays past scenes like a cinema when you fly through it'],
      core_challenge: 'six clues each require traveling to a different point in space — each clue is more faint than the last, and something that does not want the planet found is erasing them',
      world_detail: 'the planet hid itself inside a fold in space to escape a threat — but it sealed the door from the outside, which means someone on the outside sealed it in',
    },
    {
      id: 'space_old_station',
      premise: 'An abandoned space station sends a distress call — it was decommissioned 30 years ago. The call says the child\'s name, in a recording made before the child was born.',
      setting_variant: 'drifting abandoned station lit only by emergency amber lights, covered in crystallized oxygen that grows like flowers on every surface',
      protagonist_role: 'the person who was already expected — before they existed',
      inciting_incident: 'the distress recording plays clearly: the child\'s exact name, spoken gently, followed by the words "we kept it safe for you"',
      supporting_cast: ['a station AI that has been alone for 30 years and has developed very strong opinions about loneliness', 'a colony of small creatures living in the station walls who have kept something safe all this time'],
      core_challenge: 'the station holds something that was left specifically for this child — but to reach it requires passing through five sealed sections that only open when you tell them a true thing about yourself',
      world_detail: 'the station was not abandoned by accident — it was sealed and left in orbit as a vault, and the child\'s name was placed in it by someone who knew they would come',
    },
    {
      id: 'space_twin_planets',
      premise: 'Two twin planets are drifting apart after a terrible argument — if they fully separate, the solar system\'s gravity balance breaks and everything moves wrong',
      setting_variant: 'in the growing gap between two identical-looking planets, each glowing a different color, the gravitational waves between them visible as shimmering distortions',
      protagonist_role: 'the solar system\'s emergency mediator',
      inciting_incident: 'the child arrives just as the planets exchange the final cold words of their argument — in light-pulse language that the child somehow reads perfectly',
      supporting_cast: ['a wind-being who lives in the space between the planets and carries their messages — currently very overworked and frantic', 'an ancient astronomer who lives in a station between them and has watched every argument for 200 years without intervening'],
      core_challenge: 'the argument started from a misunderstood light-pulse three hundred years ago — finding the original pulse in the astronomer\'s records and correcting the misreading in both planets\' memories',
      world_detail: 'the twin planets were once one planet that split — they have been slowly moving apart for a thousand years and this argument finally snapped their last gravitational thread',
    },
  ],

  ocean: [
    {
      id: 'ocean_deep_song',
      premise: 'A song not heard in one hundred years is coming from the deepest part of the ocean — and it responds when the child hums anything at all',
      setting_variant: 'bioluminescent abyss where creatures have never seen surface light, ancient coral formations that glow with stored memory, currents that flow in spirals',
      protagonist_role: 'the one whose voice the deep ocean recognizes',
      inciting_incident: 'the child leans over the ship railing and hums absently — and from far below, the ocean hums back the same note, one octave lower',
      supporting_cast: ['an ancient octopus who is keeper of the deepest records and has been waiting for this conversation', 'a school of silver fish that move together as one mind and collectively know the way down'],
      core_challenge: 'five ocean layers to descend, each with its own challenge — the song grows clearer with each level and guides the child, but only if the child keeps singing back',
      world_detail: 'the deepest ocean is full of stories that sank from the surface world — they drift as visible light-bubbles and can be read by touch',
    },
    {
      id: 'ocean_coral_city',
      premise: 'The great coral city that has housed millions of creatures for a million years is going grey — not from pollution but from grief — and the inhabitants are preparing to leave',
      setting_variant: 'vast coral reef metropolis with towers and archways going grey at the edges, colorful fish carrying small belongings, tide rushing faster than it should',
      protagonist_role: 'the surface-world healer who can feel the coral\'s emotional state',
      inciting_incident: 'a single clownfish swims to the surface, grabs the child\'s finger with both fins, and holds on — not letting go, clearly asking them to follow',
      supporting_cast: ['a coral elder who remembers when the reef was the most joyful place in the ocean', 'a starfish doctor who has tried every physical cure and is desperate because nothing has worked'],
      core_challenge: 'the coral needs to hear something specific — a sound it has not heard in one hundred years — and finding what that sound is requires asking every species in the reef',
      world_detail: 'coral is not stone — it is a continuous living community that feeds on emotional resonance; silence and grief starve it just as surely as pollution',
    },
    {
      id: 'ocean_wrong_treasure',
      premise: 'Everyone searches for the legendary ocean treasure — the child finds it first and discovers it is not gold but a living thing that has been waiting for exactly this child',
      setting_variant: 'ancient shipwreck graveyard with hulls from five centuries, ghost crabs patrolling forgotten cargo, kelp forests so tall sunlight is just a memory far above',
      protagonist_role: 'the accidental finder who was not even looking',
      inciting_incident: 'following a golden crab that seems nervous, the child finds a door in an underwater cliff face — and it opens at their touch, warm as a handshake',
      supporting_cast: ['the ghost of a young sailor who has guarded the door for two hundred years and is very relieved to finally have company', 'an enormous wise shark who tests all treasure-seekers but has never let any through — until now'],
      core_challenge: 'inside is a living memory — it shows whoever touches it their most important moment — and the child must decide what to do with something this powerful before others arrive',
      world_detail: 'the treasure was not hidden by pirates — it was hidden by the ocean itself, waiting for the one who would not take it for power or wealth but would simply ask it what it needed',
    },
    {
      id: 'ocean_storm_grief',
      premise: 'Something in the ocean is making the storms that batter the coastline — and following the storm-tracks leads the child to a source made of grief, not malice',
      setting_variant: 'churning storm-grey sea surface, underwater raging currents that flow like sorrow, every sea creature keeping away from one region that glows angry red',
      protagonist_role: 'the investigator who refuses to assume the storm-maker is an enemy',
      inciting_incident: 'the child follows the storm-tracks into the waves and finds them converging on a point where the sea is making a sound that is unmistakably crying',
      supporting_cast: ['a dolphin who speaks in weather-language and is the only one willing to go closer', 'a lighthouse keeper who has watched 70 years of storms and recognized this one as different the first day'],
      core_challenge: 'reaching the source of the storms — a being in enormous grief — and finding the specific thing that would let it stop, which requires first understanding what it lost',
      world_detail: 'in this ocean, powerful emotions become weather — joy makes sunbeams underwater, grief makes storms, love makes fog, rage makes currents; everything you feel is visible here',
    },
    {
      id: 'ocean_body_swap',
      premise: 'The child wakes up breathing water — and a fish wakes up on land breathing air. They must find each other and reverse the swap before sunrise makes it permanent.',
      setting_variant: 'underwater world with bubble-rooms of air and forests of kelp that mirror the trees above, seen from below at dawn — the surface like a ceiling of liquid silver',
      protagonist_role: 'the accidental dimension-switcher who must navigate a world built for different bodies',
      inciting_incident: 'the child opens their eyes to see they are at the bottom of the ocean, breathing perfectly, with no memory of how they got there — and a fish onshore is equally confused',
      supporting_cast: ['the fish, onshore, keeping desperately wet in tide pools and trying to signal the child', 'a wise jellyfish who explains this swap happens when two wishes cross in the night and tells them the rules'],
      core_challenge: 'the underwater world mirrors the land world exactly — finding the swap-point requires navigating to the equivalent of a specific land location, underwater, before the tide turns at sunrise',
      world_detail: 'the ocean\'s mirror of the land world is not metaphorical — every building on land has a coral equivalent below; every road is a current; every tree is a kelp tower',
    },
  ],

  forest: [
    {
      id: 'forest_tree_door',
      premise: 'A door appears in the oldest tree in the forest — it was not there yesterday and it opens only when this child\'s hand touches it',
      setting_variant: 'ancient cathedral forest where oaks are so old they have visible faces in their bark, paths rearrange slightly at night, streams that sometimes flow uphill',
      protagonist_role: 'the door-finder — the one the tree has been waiting for',
      inciting_incident: 'the child\'s palm presses the bark where there was no door and warmth floods up their arm — then a door is simply there, open, as if it was always there',
      supporting_cast: ['a red fox who has been trying to find the door for seven years and cannot believe a child found it by accident', 'an ancient tree-spirit who communicates only through the specific sound of wind in leaves'],
      core_challenge: 'inside the tree is the forest\'s own memory — vast, labyrinthine, alive — and something important was lost inside it long ago that the forest cannot function without',
      world_detail: 'inside the oldest tree lives the forest as it was three hundred years ago — smaller trees, different creatures, the same light — and whatever happened there shaped everything since',
    },
    {
      id: 'forest_birds_silent',
      premise: 'Every bird in the forest stops singing at exactly the same moment one morning — and in the total silence, the child hears something that no one else can',
      setting_variant: 'eerily still misty dawn forest where every animal has frozen mid-motion, dew on every surface, sound itself holding its breath',
      protagonist_role: 'the only moving creature in the frozen silence',
      inciting_incident: 'in the complete absence of all sound, the child hears their own heartbeat — and another heartbeat, distant and slow, echoing it',
      supporting_cast: ['a small owl who has not slept in three days because it has been watching something approach', 'a river that has started flowing backward and whose current carries patterns the child recognizes as letters'],
      core_challenge: 'following the other heartbeat to its source before the frozen state becomes permanent — which requires moving through the silent forest without making a sound',
      world_detail: 'the forest\'s silence is not empty — it is a language; specific arrangements of nothing mean specific things, and the silence today is spelling out an urgent sentence',
    },
    {
      id: 'forest_stuck_autumn',
      premise: 'Autumn has been stuck for six months — leaves that should have fallen months ago cling desperately to exhausted trees, and winter, unable to come, is building up like a held breath',
      setting_variant: 'perpetually orange-golden forest where trees droop under the weight of leaves they cannot release, mushrooms growing in unseasonal confusion, sky stuck at one shade of grey',
      protagonist_role: 'the season-unsticker who must find the emotional knot that is holding the forest in place',
      inciting_incident: 'a single perfect leaf falls from the highest branch and spirals down to land in the child\'s open hand — the first leaf to fall in six months — and it has a tiny face, and it is crying',
      supporting_cast: ['the Spirit of Winter waiting just outside the forest, not able to enter, enormous and patient and cold', 'a colony of mushrooms who are the forest\'s collective memory and know exactly what caused this but are afraid to say'],
      core_challenge: 'the forest made a promise not to let go — finding who it made the promise to, and helping it understand that releasing is not forgetting',
      world_detail: 'seasons change not by calendar but by emotional readiness; the forest cannot move forward because something inside it is still holding the hand of something that already left',
    },
    {
      id: 'forest_mirror_twin',
      premise: 'Deep in the forest lives another child who looks exactly like the protagonist — but is made of reflection, not flesh — and has been waiting to be found since the protagonist was born',
      setting_variant: 'mirrored forest where every tree is reflected in still dark pools, left and right reversed, echoes that change the last word of whatever you say',
      protagonist_role: 'the original half, arriving to meet the complement they did not know they had',
      inciting_incident: 'the child\'s reflection in a forest pool blinks — but the child did not blink — and then the reflection points, slowly and clearly, deeper into the trees',
      supporting_cast: ['a magpie who collects both real objects and their shadows, keeping them in separate nests', 'a bridge made of woven moonlight that only appears when both the child and the reflection stand on their respective sides simultaneously'],
      core_challenge: 'the reflection-child has everything the real child is afraid to be — the child must understand what the mirror is showing them and accept what it means',
      world_detail: 'the mirror-forest contains everything that was ever almost chosen — every almost-decision, every held-back word, every unfelt feeling lives here as a visible thing',
    },
    {
      id: 'forest_elder_farewell',
      premise: 'The forest\'s oldest tree has decided it is time to sleep forever — and it has asked for this specific child to be the one to say goodbye properly',
      setting_variant: 'ancient forest clearing where one enormous tree glows golden from within as if it stored centuries of sunlight and is now slowly releasing it',
      protagonist_role: 'the chosen farewell-giver — the child who will be the last thing the tree ever hears',
      inciting_incident: 'the great tree calls the child by their full name — a name no tree was told — and asks, gently and formally, if they will come to say goodbye',
      supporting_cast: ['all the creatures of the forest gathering in a vast silent circle, not from obligation but from love', 'the tree\'s youngest sapling — barely a sprout — who will become the new eldest and is absolutely terrified'],
      core_challenge: 'the tree does not need to be saved — it needs to be truly heard before it sleeps; the child must find the four things the tree wishes someone had said to it in all its centuries',
      world_detail: 'trees do not die — they become the ground itself; the grandmother tree\'s sleep will make this clearing the richest soil in the entire forest, and something extraordinary will grow here',
    },
  ],

  desert: [
    {
      id: 'desert_oasis_moved',
      premise: 'The oasis that has sustained all life in the desert for a hundred years has vanished overnight — but a single drop of water floats in the air where it was, and it is moving',
      setting_variant: 'blazing midday desert with mirages in every direction, animal tracks converging on a point of empty sand, the sky white with heat',
      protagonist_role: 'the water-finder who notices the floating drop when everyone else is too panicked to look carefully',
      inciting_incident: 'in the middle of the empty space where the oasis was, one perfect drop of water floats impossibly at chest height — and when the child reaches out, it moves away slowly',
      supporting_cast: ['a desert fox with a nose so precise it can smell water through stone from a kilometer away', 'an ancient camel who has seen six previous vanished oases and is neither surprised nor afraid'],
      core_challenge: 'following the floating drop through four desert obstacles — a sand avalanche, a canyon with no visible path, a field of mirages indistinguishable from reality — to find where the oasis went',
      world_detail: 'the desert has a heartbeat detectable by pressing your ear to a dune at exactly noon — and oases move when the heartbeat changes, following the pulse to where it is needed',
    },
    {
      id: 'desert_sand_writing',
      premise: 'Writing appears in the desert sand every morning before dawn — in a language no living person reads — except the child, who realizes with shock that they can read every word',
      setting_variant: 'pre-dawn desert where the sand is cool and blue in starlight, air perfectly still, faint glowing script materializing letter by letter',
      protagonist_role: 'the sole reader of the forgotten language',
      inciting_incident: 'walking out before sunrise, the child finds their own name written first — then below it, a sentence that says: "we have been waiting for you specifically"',
      supporting_cast: ['an elderly scholar who has spent forty years staring at this writing without understanding a single character', 'a sand-spirit that appears only when two moons are visible simultaneously — which happens tonight'],
      core_challenge: 'the full message is in five sections in five different locations — each day\'s wind erases that day\'s section; the child must reach all five before five consecutive dawns pass',
      world_detail: 'the desert was an ocean floor ten thousand years ago; the writing is from the beings that lived at its bottom, whose language encoded itself in the sand when the water left',
    },
    {
      id: 'desert_star_child',
      premise: 'Something falls from the sky and lands in the deep desert leaving a warm crater — and at its center is a child made of condensed starlight who does not remember their name',
      setting_variant: 'nighttime desert where a warm circular crater glows faintly, the sand around it turned to smooth glass, the stars above unusually dense and watching downward',
      protagonist_role: 'first finder and protector — the human who reaches the star-child before anyone else',
      inciting_incident: 'at the center of the crater, a child sits — luminous, confused, speaking in a language made entirely of warmth rather than words — and looks up with enormous relief when the protagonist arrives',
      supporting_cast: ['a night-jaguar who patrols this desert after dark and considers this her territory but is also moved by what she sees', 'a Bedouin elder who arrives at dawn, recognizes immediately what the star-child is, and knows the time limit'],
      core_challenge: 'the star-child has three days before they begin dissolving into ordinary sand — finding how to send them home requires recovering the star-child\'s four lost memories, each held by a different desert creature',
      world_detail: 'star-children fall when a star wants to understand what living briefly feels like; they carry no memories of their star-life and must recover them from the land they landed on',
    },
    {
      id: 'desert_buried_city',
      premise: 'A sandstorm reveals the top of an ancient buried city — and a door in the sand opens for the child and no one else',
      setting_variant: 'post-storm desert with beautiful ruins emerging from the dunes — archways, towers, a courtyard — all warm amber stone, half-submerged, perfectly preserved',
      protagonist_role: 'the city\'s first visitor in one thousand years',
      inciting_incident: 'inside, everything is preserved as if the inhabitants left one hour ago — food still on tables, lamps still burning, doors still open to rooms mid-conversation',
      supporting_cast: ['a mechanical guardian left to protect the city until the right visitor arrived — and who is overwhelmed with relief that someone finally came', 'sand-memories: visual recordings embedded in the walls that play the last day of the city when touched'],
      core_challenge: 'understanding why the city sealed itself underground — not disaster, but protection of something — and deciding whether the world is ready for what the city has been keeping safe',
      world_detail: 'the city chose to bury itself by collective decision — every person and creature voted, then walked down together; the thing they protected is still here, still alive, still waiting',
    },
    {
      id: 'desert_stolen_wind',
      premise: 'The cool night wind has been disappearing and the desert is overheating — nocturnal animals are suffering, and a thread of remaining wind wraps around the child\'s wrist and pulls',
      setting_variant: 'oppressively hot desert where even midnight brings no coolness, exhausted nocturnal animals sheltering in thin shadows, heat-shimmer visible at night',
      protagonist_role: 'the wind-detective who follows the only clue left',
      inciting_incident: 'the remaining wind — thinner than it should be — wraps a tendril around the child\'s wrist and tugs, clearly leading somewhere specific',
      supporting_cast: ['a moon-rabbit who navigates by wind-scent and is completely disoriented without it, following the child for help', 'the desert\'s wind-keeper spirit, barely conscious, collapsed at the base of a dune, whispering what happened'],
      core_challenge: 'following the wind-thread to its end — which leads to someone who took the wind not out of malice but desperation — and finding a solution that gives both the desert and that being what they need',
      world_detail: 'desert wind is not weather — it is the desert\'s own breath; without it the desert slowly suffocates, and the stars grow dimmer because no wind reaches them to carry the desert\'s greetings',
    },
  ],

  farm: [
    {
      id: 'farm_animals_vote',
      premise: 'The farm animals hold a secret assembly and vote unanimously to make the child their representative — they have a serious grievance that must reach the farmer before tomorrow',
      setting_variant: 'full-summer farm where every animal is somehow gathered in the big barn at the same time, arranged in a circle, extremely formal',
      protagonist_role: 'the elected advocate — the child who animals trust to speak what they cannot',
      inciting_incident: 'the child walks into the barn and every animal stops talking immediately, turns to look at them in perfect unison, and the rooster steps forward holding a folded leaf with a vote-count on it',
      supporting_cast: ['an extraordinarily articulate rooster who acts as the animals\' lawyer and has prepared a very organized case', 'a shy rabbit who holds the single most important piece of evidence and is terrified of speaking'],
      core_challenge: 'understanding the grievance fully — it involves something the farmer does not know they are doing — and presenting it in a way that changes the farmer\'s mind without making them defensive',
      world_detail: 'on this farm, animals can speak to children — but only when they have something important to say, and only once; if the child fails to help, the animals will never speak to anyone again',
    },
    {
      id: 'farm_walking_harvest',
      premise: 'The harvest is disappearing overnight — and staying up to watch reveals the vegetables quietly walking in a single file into the forest on their own',
      setting_variant: 'harvest-time farm in silver moonlight, half-empty fields, confused farmers blaming each other, animals acting strangely restless near the forest edge',
      protagonist_role: 'the only one awake to see what is actually happening',
      inciting_incident: 'at midnight, in total silence, the child watches from the barn window as a line of root vegetables methodically detach from the earth and begin walking, single-file, toward the tree line',
      supporting_cast: ['the oldest apple tree who has seen this before and knows what it means and what to do', 'a crow who has been following the vegetables for three nights, taking very thorough notes on a birch-bark notebook'],
      core_challenge: 'following the vegetables to their destination and understanding what they are walking toward — and whether the farm can afford to lose them, or whether the farm needs to understand something about letting go',
      world_detail: 'once every hundred years, crops are given one night to choose: return to the wild or stay cultivated. Most choose to stay. Some do not. The farm\'s relationship with its plants depends on whether it has been a good partner.',
    },
    {
      id: 'farm_grieving_land',
      premise: 'One section of the farm refuses to grow anything — the soil tests perfect, the water reaches it, the sun falls on it — but it simply refuses, and the child can feel exactly why',
      setting_variant: 'contrast farm in full bloom except for one grey circular patch the size of a house, completely bare, surrounded by lush crops that lean slightly away from it',
      protagonist_role: 'the land-healer who can feel the soil\'s emotional state through their feet',
      inciting_incident: 'the child steps onto the grey patch and an enormous wave of sadness — not their own — moves through them from the ground up like cold water',
      supporting_cast: ['a worm who has been trying to work the soil back to life from inside for three years and is close to giving up', 'an old scarecrow who has been standing at the edge of this patch for thirty years and saw what happened'],
      core_challenge: 'understanding the specific memory that caused the land\'s grief — something that happened here that no one living remembers — and performing the specific act of acknowledgment that the land needs',
      world_detail: 'farm land is a continuous living memory — it records everything that happens on it; trauma does not wash out with rain; it requires being named and witnessed before the land can release it',
    },
    {
      id: 'farm_season_visitor',
      premise: 'A mysterious visitor arrives at the farm at exactly the same time each year — visible only to this child — and this year she says: "This year is different. This year I need your help."',
      setting_variant: 'late-autumn farm with harvests stored and first cold winds arriving, a figure visible at the gate at golden hour that the adults walk right past without seeing',
      protagonist_role: 'the only person who has ever seen the visitor and the only one who can help her',
      inciting_incident: 'the visitor touches the child\'s shoulder — and her hand is warm but leaves a faint frost-print, and her voice is the sound of wind in dry corn husks',
      supporting_cast: ['the farm\'s ancient dog who also sees the visitor and has always known — and is relieved the child finally sees her too', 'a migratory bird who arrives on the same day as the visitor every year, carrying news from further along her journey'],
      core_challenge: 'the visitor is the spirit of the coming season — and this year something is blocking her path; helping her requires traveling to the farm\'s oldest corner and performing a task the previous child-who-saw-her left unfinished',
      world_detail: 'every farm is tended not just by the farmer but by the season-spirit who passes through it; when the spirit passes cleanly, the year is good; when she is blocked, the farm feels it for months',
    },
    {
      id: 'farm_impossible_map',
      premise: 'Under a loose floorboard in the old barn is a map — not of this farm as it is, but as it was supposed to be — and the child holding it can see ghost-shapes of unplanted things',
      setting_variant: 'old wooden barn where every beam has a story in its grain, afternoon light through cracks making golden columns, the smell of a hundred harvests stacked in memory',
      protagonist_role: 'the map-holder who can see what others cannot when holding it',
      inciting_incident: 'the child steps outside holding the map and the farm overlays itself with faint luminous shapes — a garden that does not exist, plants no one has grown here, paths leading to places that seem familiar in a way that makes no sense',
      supporting_cast: ['the ghost of the farm\'s first farmer — present only as a warm feeling and sometimes a voice — who needs one task completed before they can rest', 'a badger who has been living under the barn for sixty years, guarding the map, waiting for the right person to find it'],
      core_challenge: 'planting what the map shows — in the right places, in the right order — before the next full moon, which is also the sixty-year anniversary of when the first farmer stopped',
      world_detail: 'the farm was designed to grow something that has not existed for sixty years — a plant that heals a specific thing — and the first farmer was interrupted before finishing; the map is the instruction, and the child is the last chance',
    },
  ],
}

// ---------------------------------------------------------------------------
// SECONDARY CHARACTER POOL — additional cast variety per theme
// Adds a second supporting character beyond the blueprint's built-in cast
// ---------------------------------------------------------------------------
const SECONDARY_CHARACTERS = {
  jungle: [
    'a wise elder tortoise who speaks only in questions',
    'a rainbow-feathered parrot who repeats the most important thing said three pages ago at exactly the right moment',
    'a tiny luminous frog who is braver than any creature twice its size',
    'a silent leopard cub who follows from a careful distance',
    'a spider who weaves accurate maps of wherever she has been',
    'a colony of ants who collectively hold a single enormous piece of useful knowledge',
  ],
  space: [
    'a lonely robot whose face-screen shows exactly what it feels even when it says it feels nothing',
    'a cloud-creature made of stardust who communicates through temperature changes',
    'an alien child about the same age who has never met a human and is intensely curious',
    'a sentient spaceship who is very old and very tired but will make one last effort',
    'a crystal moon-being who sees the future in fragments but cannot explain what they mean',
    'a singing comet who has passed through this part of space seven hundred times and remembers all of them',
  ],
  ocean: [
    'a ghost-crab who carries a lantern and has been lighting the way for lost travelers for a century',
    'a blue whale who speaks so slowly each word arrives minutes after the last but is always worth waiting for',
    'a tiny seahorse who is physically incapable of giving up',
    'a jellyfish choir that communicates in harmonics the child feels in their chest',
    'a retired pirate fish who knows where everything is hidden',
    'a hermit crab who has lived in seventeen different shells and carries the memories of all their previous owners',
  ],
  forest: [
    'a silver fox who knows three secrets about every creature in the forest and exactly which one is relevant right now',
    'a white deer who appears only when something important is about to happen',
    'a hedgehog scholar who has read every mushroom-library document in the forest',
    'a raven who collects secrets in a cache and will trade them for truths',
    'an invisible sprite visible only to children who is genuinely very helpful but easily distracted',
    'a badger who has been watching the forest for forty years and is absolutely not surprised by anything that happens',
  ],
  desert: [
    'a philosophical camel who responds to every difficulty with a calm observation that is immediately useful',
    'a sand-colored lizard who knows the name and history of every rock in a two-kilometer radius',
    'a scorpion who is almost offensively gentle and kind despite everyone\'s initial reaction',
    'a nomad child who appears from nowhere and navigates by star-reading',
    'a mirage that is actually real but only shows true things to people who are genuinely thirsty',
    'a desert hawk who has the most complete view of everything happening below and will share it if asked correctly',
  ],
  farm: [
    'a barn cat who has seen everything that has ever happened in this farm and judges none of it',
    'a family of mice living in the farmhouse wall who have an encyclopedic knowledge of everything said in this house',
    'a very opinionated goat who is usually wrong but occasionally spectacularly right',
    'a giant gentle workhorse who has been present at every important farm event for twenty years',
    'a wise old pig who has read every newspaper page that blew into the sty for thirty years',
    'a pair of farm dogs who disagree about everything except what matters most',
  ],
}

// ---------------------------------------------------------------------------
// DIMENSION 1 — Goal (what the child must achieve)
// ---------------------------------------------------------------------------
const GOALS = [
  { id: 'rescue_creature',  en: 'rescue a lost or injured being and return them to where they belong' },
  { id: 'find_hidden',      en: 'discover a hidden place, buried object, or long-forgotten truth' },
  { id: 'fix_broken',       en: 'repair something vital that has broken — a balance, a bond, or a living thing' },
  { id: 'deliver_message',  en: 'deliver something critically important before irreversible consequences unfold' },
  { id: 'uncover_mystery',  en: 'solve a mystery that everyone else has given up on or refuses to believe exists' },
  { id: 'earn_trust',       en: 'prove worthy and earn the trust of a world that doubts the child completely' },
  { id: 'protect_home',     en: 'protect a beloved place from a slow invisible threat' },
  { id: 'bring_together',   en: 'unite two estranged beings who have forgotten why they were ever friends' },
  { id: 'escape_transform', en: 'escape an impossible situation and emerge permanently changed by it' },
  { id: 'learn_forgotten',  en: 'recover a lost skill or ancient knowledge before it disappears forever' },
]

// ---------------------------------------------------------------------------
// DIMENSION 2 — Tone
// ---------------------------------------------------------------------------
const TONES = [
  { id: 'adventurous',   en: 'bold heart-pounding adventure — fast, exciting, never a dull moment' },
  { id: 'emotional',     en: 'deeply emotional and tender — every moment carries weight and warmth' },
  { id: 'mysterious',    en: 'mysterious and suspenseful — questions accumulate, answers arrive slowly' },
  { id: 'funny',         en: 'genuinely funny and playful — unexpected humor woven throughout' },
  { id: 'calm_magical',  en: 'calm, dreamlike, quietly magical — beauty in unexpected places' },
  { id: 'bittersweet',   en: 'bittersweet and reflective — joy mixed with longing, beauty mixed with loss' },
]

// ---------------------------------------------------------------------------
// DIMENSION 3 — Pacing Style
// ---------------------------------------------------------------------------
const PACING_STYLES = [
  { id: 'fast_journey',    en: 'urgent fast-paced journey — every page delivers a new challenge or revelation' },
  { id: 'slow_discovery',  en: 'slow discovery with deep wonder — atmosphere builds, details matter enormously' },
  { id: 'episodic',        en: 'three distinct mini-challenges within one larger journey, each complete in itself' },
  { id: 'escalating',      en: 'escalating tension — each page raises the stakes higher than the last' },
  { id: 'circular',        en: 'circular — the journey ends where it began, but everything has fundamentally changed' },
]

// ---------------------------------------------------------------------------
// DIMENSION 4 — Conflict Type
// ---------------------------------------------------------------------------
const CONFLICT_TYPES = [
  { id: 'external_danger', en: 'external physical danger requiring cleverness and courage — not strength alone' },
  { id: 'inner_doubt',     en: 'internal fear or crippling self-doubt — the real battle happens inside' },
  { id: 'puzzle_mystery',  en: 'a puzzle where the critical clues are hidden in plain sight — observation wins' },
  { id: 'moral_dilemma',   en: 'a genuine moral dilemma — helping others requires personal cost' },
  { id: 'survival',        en: 'survival against overwhelming elements — nature itself is the obstacle' },
  { id: 'misunderstanding', en: 'a deep mutual misunderstanding — only the child can see both sides clearly' },
]

// ---------------------------------------------------------------------------
// DIMENSION 5 — Helper Type
// ---------------------------------------------------------------------------
const HELPER_TYPES = [
  { id: 'wise_elder',         en: 'a wise ancient being who speaks in riddles and reveals truth only when truly needed' },
  { id: 'small_unlikely',     en: 'an impossibly small overlooked creature — the most unlikely helper proves essential' },
  { id: 'rival_friend',       en: 'a rival or apparent enemy who becomes the crucial ally at the worst moment' },
  { id: 'magic_object',       en: 'a mysterious object whose true power reveals itself only when genuinely needed' },
  { id: 'solo',               en: 'no external helper — a completely solo journey where self-reliance is everything' },
  { id: 'living_environment', en: 'the environment itself acts as silent helper — nature guides without speaking' },
]

// ---------------------------------------------------------------------------
// DIMENSION 6 — Twist Type
// ---------------------------------------------------------------------------
const TWIST_TYPES = [
  { id: 'helper_needed_help',   en: 'the helper was the one in need all along — their guidance was a cry for help' },
  { id: 'obstacle_protecting',  en: 'the obstacle was protecting something precious — removing it required understanding it' },
  { id: 'goal_transforms',      en: 'mid-journey, the real goal reveals itself as something completely different' },
  { id: 'past_mistake_solves',  en: 'the child\'s specific past mistake becomes the exact key that unlocks the solution' },
  { id: 'always_had_it',        en: 'the answer was always within the child — the journey was the process of finding it' },
  { id: 'stranger_forever_ally', en: 'the most intimidating stranger transforms into the most devoted companion' },
]

// ---------------------------------------------------------------------------
// DIMENSION 7 — Ending Type
// ---------------------------------------------------------------------------
const ENDING_TYPES = [
  { id: 'shared_victory',     en: 'triumphant shared victory — not one winner but everyone transformed together' },
  { id: 'personal_discovery', en: 'quiet personal discovery — external problem solved but real change is inside' },
  { id: 'bittersweet_farewell', en: 'bittersweet farewell — something beautiful ends and something new begins, both felt fully' },
  { id: 'surprising_return',  en: 'the return home reveals the world looks completely different through changed eyes' },
  { id: 'new_beginning',      en: 'the ending is unmistakably a beginning — a door opens to something even larger' },
  { id: 'earned_belonging',   en: 'earned belonging — the child discovers they were always exactly where they belonged' },
]

// ---------------------------------------------------------------------------
// DIMENSION 8 — Narrative Style
// ---------------------------------------------------------------------------
const NARRATIVE_STYLES = [
  { id: 'linear',          en: 'linear chronological — clear cause and effect, every scene earned by the last' },
  { id: 'mystery_driven',  en: 'mystery-driven — questions raised on page 1, answered slowly, final page gives full meaning' },
  { id: 'mission_based',   en: 'mission-based — explicit goal, clear obstacles, measurable progress every page' },
  { id: 'discovery_based', en: 'discovery-based — no clear purpose at first, meaning emerges gradually through exploration' },
  { id: 'emotional_journey', en: 'emotional journey — inner transformation drives everything; external events mirror the inner state' },
]

// ---------------------------------------------------------------------------
// DIMENSION 9 — Opening Hook
// ---------------------------------------------------------------------------
const OPENING_HOOKS = [
  { id: 'strange_sound',       en: 'wakes to a sound that no one else can hear — and it is clearly asking for something' },
  { id: 'mysterious_object',   en: 'finds something that was not there yesterday — as if placed specifically for this child' },
  { id: 'wrong_discovery',     en: 'notices something terribly wrong that every adult around has completely missed' },
  { id: 'irresistible_pull',   en: 'feels an irresistible pull toward something unknown — following is not choice but certainty' },
  { id: 'vivid_dream_answer',  en: 'wakes from a dream that was more real than waking — and finds the dream left something behind' },
  { id: 'unexpected_arrival',  en: 'something arrives that changes everything — and it arrived specifically because of this child' },
]

// ---------------------------------------------------------------------------
// STORY STRUCTURES — 5 fundamentally different narrative architectures
// ---------------------------------------------------------------------------
export const STORY_STRUCTURES = [
  {
    id: 'A',
    name: 'The Mission',
    description: 'A clear goal is established after a warm setup. Obstacles escalate. A helper appears mid-journey. The climax requires everything the child has learned.',
    flow: [
      'pages 1-3: The world and who lives in it — child in their ordinary place, no urgency yet',
      'pages 4-5: The mission arrives — the inciting moment and the decision to go',
      'pages 6-7: Journey begins, first complication shows this is bigger than expected',
      'pages 8-9: Serious obstacle — first approach fails, stakes become real',
      'pages 10-11: Helper appears or new understanding forms; a turning point in strategy',
      'pages 12-13: Climax — all skills and courage tested; the decisive action',
      'page 14: Aftermath — the world responds to what just happened',
      'pages 15-16: Quiet resolution and reflective ending — what the mission permanently changed',
    ],
  },
  {
    id: 'B',
    name: 'The Mystery',
    description: 'A strange discovery raises questions. Investigation deepens the mystery. A false lead misleads. The final revelation recontextualizes everything seen before.',
    flow: [
      'pages 1-3: The world in its normal state — child observing, curious, at ease',
      'pages 4-5: The mysterious discovery — nothing makes sense yet; investigation begins',
      'pages 6-7: Following the first clue deeper — the world grows stranger',
      'pages 8-9: False trail — the apparent answer is wrong and the child knows it',
      'pages 10-11: Deeper layer revealed — the mystery is bigger than it appeared',
      'pages 12-13: The real answer surfaces from an unexpected direction; revelation begins',
      'page 14: Everything the child saw before now means something different',
      'pages 15-16: Resolution with entirely new understanding; quiet wonder',
    ],
  },
  {
    id: 'C',
    name: 'The Endurance',
    description: 'A problem demands action. Three attempts each teach something essential. Failure is the real teacher. The third attempt uses everything failure provided.',
    flow: [
      'pages 1-3: The world before the problem — child in their element, full of quiet confidence',
      'pages 4-5: The problem arrives fully formed — stakes established; first response is ready',
      'pages 6-7: First attempt — bold, confident, and completely insufficient; what it taught',
      'pages 8-9: Second attempt — smarter but still missing something fundamental',
      'pages 10-11: Both failures crystallize into real understanding; the turning point',
      'pages 12-13: Third attempt — built from what failure taught; the decisive action',
      'page 14: Success and its unexpected shape — not what was imagined',
      'pages 15-16: The permanent growth from having to fail first; quiet final beat',
    ],
  },
  {
    id: 'D',
    name: 'The Emotional Journey',
    description: 'External events mirror internal transformation. The real story is what changes inside. Every external obstacle is a reflection of an inner one the child must face.',
    flow: [
      'pages 1-3: Ordinary world — child in daily life; something feels incomplete but cannot be named',
      'pages 4-5: The call arrives — inner resistance is real and understandable; first movement begins',
      'pages 6-7: Journey begins — the external world immediately reflects the inner state',
      'pages 8-9: The real fear or wound surfaces — the child faces it directly',
      'pages 10-11: The inner obstacle demands confrontation; something begins to loosen',
      'pages 12-13: The transformation moment — something releases; the decisive inner change',
      'page 14: External resolution flows naturally from the internal change',
      'pages 15-16: Return — the same world looks entirely different, correctly; calm wonder',
    ],
  },
  {
    id: 'E',
    name: 'The Discovery',
    description: 'The child moves without clear purpose. Meaning accumulates through small encounters. The final pages reveal the pattern that was always present, always meaningful.',
    flow: [
      'pages 1-3: The world before understanding — pure curiosity, no direction, open to everything',
      'pages 4-5: First unexpected encounter — a seed of meaning is planted',
      'pages 6-7: Second encounter — a pattern begins to be visible',
      'pages 8-9: Third encounter — the pattern is unmistakable; something deeper is suspected',
      'pages 10-11: The child begins to understand what they are really doing here; a quiet realization',
      'pages 12-13: Unexpected truth arrives; the pattern revealed completely',
      'page 14: Full meaning understood — the child is changed by knowing',
      'pages 15-16: Who the child will be from now on; one final image of calm wonder',
    ],
  },
]

// ---------------------------------------------------------------------------
// MAIN — Build full story DNA for an order
// ---------------------------------------------------------------------------

/**
 * Returns a deterministic story DNA object for the given orderId + theme.
 * Every field is selected independently so the combination space is enormous.
 * Blueprint selection provides the primary variation driver.
 *
 * @param {string} orderId
 * @param {string} theme
 * @returns {{ blueprint, secondary, goal, tone, pacing, conflict, helper, twist, ending, narrative, opening, structure }}
 */
export function buildStoryDNA(orderId, theme) {
  const base       = (orderId || '') + '|' + (theme || '')
  const blueprints = THEME_BLUEPRINTS[theme] || THEME_BLUEPRINTS.forest
  const secondaries = SECONDARY_CHARACTERS[theme] || SECONDARY_CHARACTERS.forest

  return {
    blueprint:  pick(blueprints,    fnv1a(base + '::blueprint'),  'BLP'),
    secondary:  pick(secondaries,   fnv1a(base + '::secondary'),  'SEC'),
    goal:       pick(GOALS,         fnv1a(base + '::goal'),       'GOAL'),
    tone:       pick(TONES,         fnv1a(base + '::tone'),       'TONE'),
    pacing:     pick(PACING_STYLES, fnv1a(base + '::pacing'),     'PAC'),
    conflict:   pick(CONFLICT_TYPES,fnv1a(base + '::conflict'),   'CON'),
    helper:     pick(HELPER_TYPES,  fnv1a(base + '::helper'),     'HLP'),
    twist:      pick(TWIST_TYPES,   fnv1a(base + '::twist'),      'TWI'),
    ending:     pick(ENDING_TYPES,  fnv1a(base + '::ending'),     'END'),
    narrative:  pick(NARRATIVE_STYLES,fnv1a(base + '::narrative'),'NAR'),
    opening:    pick(OPENING_HOOKS, fnv1a(base + '::opening'),    'OPN'),
    structure:  pick(STORY_STRUCTURES,fnv1a(base + '::structure'),'STR'),
  }
}

/**
 * Returns a human-readable DNA summary for logging.
 */
export function summarizeDNA(dna) {
  return [
    `blueprint=${dna.blueprint.id}`,
    `structure=${dna.structure.id}`,
    `tone=${dna.tone.id}`,
    `goal=${dna.goal.id}`,
    `pacing=${dna.pacing.id}`,
    `conflict=${dna.conflict.id}`,
    `helper=${dna.helper.id}`,
    `twist=${dna.twist.id}`,
    `ending=${dna.ending.id}`,
    `narrative=${dna.narrative.id}`,
    `opening=${dna.opening.id}`,
    `secondary=${dna.secondary.slice(0, 30)}`,
  ].join(' | ')
}
