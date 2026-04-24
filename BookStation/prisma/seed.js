const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// ─── Static config ────────────────────────────────────────────────────────────

const genreTypes = [
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Romance",
  "Thriller",
  "Historical",
];

const userBlueprints = [
  { name: "Sara Quinn", email: "sara.writer@bookstation.dev", role: "USER", coinBalance: 500 },
  { name: "Leo Hart", email: "leo.writer@bookstation.dev", role: "USER", coinBalance: 500 },
  { name: "Mina Vale", email: "mina.reader@bookstation.dev", role: "USER", coinBalance: 2500 },
  { name: "Omar Finch", email: "omar.reader@bookstation.dev", role: "USER", coinBalance: 2500 },
  { name: "Admin One", email: "admin@bookstation.dev", role: "ADMIN", coinBalance: 10000 },
];

const getSeedCoverUrl = (index) =>
  `https://picsum.photos/seed/bookstation-cover-${index + 1}/600/900`;

const titleHeads = [
  "Moonfire", "Glass", "Iron", "Silent", "Golden",
  "Winter", "Shadow", "Echo", "Scarlet", "Storm",
];
const titleTails = [
  "Archive", "Harbor", "Signal", "Letters", "Crown",
  "Bridge", "Voyage", "Riddle", "Code", "Oath",
];
const chapterNamePool = [
  "First Light", "Broken Compass", "Cold Wind", "Hidden Room", "False Trail",
  "Last Witness", "Silent Engine", "Burning Map", "Night Window", "Open Sea",
];

// ─── 40-book content library ──────────────────────────────────────────────────
// Each entry maps to bookBlueprints[i] by array index.
// chapters[] has entries for every possible chapter position (up to 5).
// pages[] inside each chapter covers pageCount possibilities (up to 3).
// makePageText() falls back to the last defined page if the index exceeds length.

const bookContentLibrary = [
  // ── 0  Moonfire Archive 1  [Fantasy / Mystery]  Sara ──────────────────────
  {
    description:
      "Apprentice archivist Lyra Ashveil discovers that crystallised memories are being stolen from the Grand Archive of Veldrath, leaving victims with no recollection of why they entered. Each theft leaves only cold ash — and Lyra suspects the Archive's undead founder, Seravine, is consuming them to sustain herself.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The Grand Archive of Veldrath rose seven stories above the fog-lined canal, its windows filled with the blue-white glow of moonfire crystals. Lyra Ashveil pressed her apprentice badge against the iron gate and heard the hum of recognition — then stopped. The gate was already open, and Senior Archivist Holt was crouched in the atrium, sifting through grey ash that smelled faintly of burnt cedar. "Third theft this week," he said, holding up a scorched crystal housing. Whoever had owned the memory inside was sitting upstairs in perfect, blank calm, unable to say why they had come at all.</p><p>Lyra spent her first hour studying the empty housing under a magnification lens. The crystal was rated for long-term biographical storage, the kind people purchased to preserve significant life events. No extraction residue. No fracture lines. Someone had drawn the contents out like pulling smoke through silk. She wrote in her log: <em>Method unknown. Victim unaware. But the ash is still warm.</em> She cross-referenced all three incidents against the visitor ledger and noticed each fell on a moonless night — when the crystals ran on reserve power and the Archive's security lattice dimmed.</p>`,
          `<h2>First Light</h2><p>By mid-morning, Lyra had found a rogue crystal tucked behind a false panel on the third floor — old, its housing engraved with a seal she traced to the Archive's founding charter. The seal belonged to Seravine, the first Head Archivist, who had officially died in a fire three centuries ago. But a donation record from sixty years after her death carried Seravine's authenticated signature. Lyra locked the crystal in her drawer and said nothing to Holt.</p><p>That afternoon, Holt found her in the stacks. "The fourth theft just happened," he said. "Reading room three. Broad daylight." He paused. "It happened to me, Lyra. I can't remember your name from this morning. I had to check the ledger." He sat down heavily and looked at his own hands as if he had borrowed them. The Archive hummed around them, moonfire crystals pulsing in their lattices, and Lyra understood for the first time that whatever Seravine had become, it was growing bolder.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The restricted annex index listed only one reference to the practise Lyra suspected: <em>soul-drinking</em>, banned by the Veldrath Conclave four hundred years ago. The entry was three lines long and ended with a notation in a different hand: <em>See also: Founder's Compact, Article Nine</em>. Article Nine had been physically removed from every copy of the Compact in the Archive's collection. Lyra found the torn edges in four separate volumes, each cut with the same precision. Someone had been thorough, and someone had done it a very long time ago.</p><p>She brought her notes to Sable, the Archive's spectral analyst, who ran the rogue crystal through the resonance reader. The machine buzzed, spat sparks, and printed a single word on its paper tape: <em>CAUTION</em>. "It's never printed a word before," Sable said, stepping back. "It prints memory types. Not warnings." Lyra looked at the crystal. It pulsed once, warmly, as if it recognised her. She thought of Seravine's signature, sixty years past her supposed death, and felt the particular cold of a truth that has been waiting for someone to find it.</p>`,
          `<h2>Broken Compass</h2><p>The crystal guided Lyra to the Archive's sub-basement, a level not on any public map. She found a narrow room lined with hundreds of crystal housings — all scorched, all empty — and in the centre, a reading chair worn smooth by centuries of use. The housings were arranged by date. The oldest went back to the Archive's founding. Seravine had not started feeding recently. She had never stopped.</p><p>Lyra set the rogue crystal on the reading plate in the centre of the room. It lit immediately, casting shadows she didn't expect — shadows that moved independently of any light source. One shadow detached from the wall and grew taller. "You found the compact," said a voice like pages turning. "I wondered which apprentice would." Lyra stood very still. "You've been taking them," she said. "For three hundred years." The shadow tilted its head. "I have been keeping them," it said. "There is something underneath this Archive that would consume every memory in the city, given the chance. I am what stands between it and Veldrath. I need you to understand that before you decide what to do with that crystal."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>Seravine's claim was specific enough to verify: a sealed chamber beneath the sub-basement, predating the Archive by at least two centuries, containing a void entity the Conclave had once called the Hollow. Lyra found the Conclave's original suppression report in a waterproofed cylinder hidden inside the reading chair. The entity did not destroy memories — it unmade them, erasing the experiential record so completely that victims lost not just recollection but the neurological pathways those memories had used. Left unchecked, the Conclave estimated it could deplete an adult mind in forty-eight hours.</p><p>Seravine had been feeding it stolen memories as a substitute — channelling the energy of other people's experiences into the chamber to satisfy the Hollow's hunger and keep it dormant. It was monstrous. It was also, Lyra admitted to herself, working. The city above had no idea. She sat in the sub-basement with the Conclave report on her knees and tried to decide what a person was supposed to do when the monster was also the lock on the cage.</p>`,
          `<h2>Cold Wind</h2><p>The solution Lyra found was partial and imperfect, which felt appropriate. She spent three weeks cataloguing the Archive's full collection of donated memories — thousands of crystals, most given voluntarily by citizens who wanted to preserve events they feared forgetting. With Holt's reluctant help, she identified six hundred crystals whose donors had since died, memories that would never be reclaimed. Seravine accepted them. Not gratefully — she had not been grateful in three centuries — but she accepted them, and she agreed to a compact of Lyra's own design: a quarterly audit, full disclosure of feeding records, and no more taking from the living.</p><p>Holt's stolen memories did not return. That was the cost. The morning he had forgotten was simply gone, and Lyra could not give it back. She wrote his name on a card and left it on his desk without explanation. He found it, read it, and nodded slowly, understanding without being told that some things were beyond the Archive's power to restore. Below them, deep in the sealed chamber, the Hollow settled into its long sleep. The moonfire crystals in the reading lattices burned steady and blue, and Lyra went back to work.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>Six months after the compact was signed, Lyra was promoted to junior archivist and given her own desk in the reading room overlooking the canal. She kept the rogue crystal in the top drawer, wrapped in velvet. Seravine visited occasionally — a shadow in the corner, a drop in temperature near the sealed stacks — and they had learned a grudging, practical form of communication. Lyra asked questions. Seravine answered those that did not endanger the compact's balance. It was not a friendship. It was something more durable.</p><p>The city's memory theft cases had stopped entirely. The Veldrath City Guard closed the investigation without a resolution, attributing the incidents to a rare spontaneous degradation of older crystal housings. Lyra read the report, noted its inaccuracies, and filed her own version in the Archive's restricted annex under Article Nine — the restored version, which she had reconstructed from four sets of torn edges and Seravine's own corrections. The city did not need to know everything. But the Archive remembered. That, Lyra had decided, was the whole point.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The letter arrived on a Tuesday — hand-delivered, no return address, sealed with a wax impression Lyra did not recognise. Inside was a single line: <em>Seravine is not the only one.</em> She brought it to Seravine that evening, holding it up in the dim sub-basement. The shadow was very still for a long moment. "No," Seravine said finally. "I am not." It was the most alarming thing she had ever said, and she said it with the flat calm of someone confirming a fact she had always assumed Lyra knew. "There are seven of us. Placed by the original Conclave, one under each of the great library cities. We do not communicate. We were not meant to." Lyra looked at the letter. "Someone is communicating now," she said.</p>`,
        ],
      },
    ],
  },

  // ── 1  Glass Letters 2  [Sci-Fi / Romance]  Leo ───────────────────────────
  {
    description:
      "Communications officer Dr. Mira Coen intercepts encoded transmissions aboard the generation ship Perseverance — messages from a divergent timeline's Earth, written by a man searching for someone who should have been on the ship. As she works to decode them, she falls for the stranger whose voice keeps appearing in the static.",
    chapters: [
      {
        pages: [
          `<h2>Cold Wind</h2><p>The Perseverance had been travelling for sixty-one years when Dr. Mira Coen first heard the voice in the static. She was running a routine sweep of the long-range array at 0300, the ship's corridors empty, when a structured signal appeared on a frequency the array wasn't supposed to receive. She almost flagged it as interference. Instead she slowed the playback and listened: a man's voice, careful and clipped, speaking in fragments that resolved — after three translation passes — as a regional variant of Brazilian Portuguese declared extinct thirty years before the ship's departure. The timestamp read: <em>Day 1 of transit. Outbound from Alcântara. You are not alone.</em></p><p>She listed the signal as unclassified atmospheric interference and copied the file to her personal terminal. She lay in her bunk until ship-dawn with the fragment on loop, no longer trying to parse the words but listening to the shape of the voice: unhurried, deliberate, choosing each word as if words cost something. The feeling she was left with was not fear or scientific excitement. It was the specific unease of having heard someone call a name that was almost yours.</p>`,
          `<h2>Cold Wind</h2><p>Over the next two weeks the signals arrived at irregular intervals, always in the same extinct dialect, always stamped with a day-count from a launch Mira could find no record of. She assembled the fragments in sequence and found a letter — addressed to someone aboard the Perseverance, written from a version of Earth that should not exist. The letter-writer, who signed each fragment simply as <em>T</em>, described markets still open and children in school uniforms, a city the historical record had listed as climatically uninhabitable for four decades.</p><p>She brought the assembled text to Dr. Sione Faasolo in theoretical physics, without explaining its origin. He read it carefully and looked up. "This describes a divergence point," he said. "A timeline where the Alcântara launch happened differently. Where whoever was supposed to be on this ship — wasn't." He studied her face. "You understand what that implies." She did. Somewhere on a branching Earth, a man was writing letters to an empty seat. "How do you know it's a man?" Sione asked. She had no answer that she was willing to say aloud.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The sixth letter from T arrived with temporal coordinates — a quantum resonance signature Sione identified as theoretical until that moment. "Someone on a divergent Earth has built the actual machine," he said, spreading the decoded sequence across his desk. "Which means we could, in principle, respond." He looked at her. "We'd be using the dark-matter mapping array. If we're wrong about what this is, we fry a forty-million-credit instrument." Mira thought of the voice — steady, precise, searching. "What if we're right?" Sione cleaned his glasses for a long time. "Then we're talking to a ghost."</p><p>She spent three days drafting the response signal without telling anyone. She wrote the message in four languages, then deleted three of them. What did you say to someone writing from a world the records insisted had burned? She settled on something simple: <em>We received your letters. We are listening. Please keep sending.</em> She ran it through the array at 0300 and sat in the dark afterwards. The ship breathed around her, sixty-one years of momentum carrying it forward, and somewhere across a probability gap she could not measure, she hoped the message arrived.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>T's reply came eleven hours later. He was brief: <em>I did not expect an answer. I have been sending for two years. The coordinates on this end require daily recalibration. I can maintain the connection for approximately four months before the resonance window closes. My name is Tomás. I am an engineer. I am looking for my sister, who was supposed to be on your ship. Her name is Ana Coen.</em> Mira read the message three times. Her grandmother's name had been Ana. Her grandmother, who had told her nothing about any brother.</p><p>She wrote back immediately — too quickly, she thought afterward, but the thought did not slow her hands. She asked for details: birth year, departure city, the specific configuration of the Alcântara launch as T remembered it. His replies were meticulous. His sister had been a communications specialist. She had been assigned to the Perseverance's array team. In his timeline, she had withdrawn at the last hour for reasons he had never understood, and he had spent his career building backward through probability theory to find the branch where she had stayed. "I thought I was looking for Ana," he said in the seventh exchange. "I am not sure that is still true."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Last Witness</h2><p>The four-month window shrank to three weeks. Mira and Tomás wrote to each other every day — about his city, still green and functioning; about her ship, its schools and hydroponic gardens and the particular silence of deep space past the heliopause. He described his work with the precision of someone who loved it. She described her array diagnostics with the same care, and eventually they were not describing their jobs at all but their habits and preferences, the small choices that made a life legible to another person.</p><p>On the twenty-first day, with forty-eight hours remaining in the resonance window, Tomás sent a final message. It said: <em>I need you to know that I found what I was looking for, and it was not what I expected, and I am grateful for that. The machine will go dark tomorrow. I built it to find one person. I think it did.</em> Mira sat with the message for a long time. Then she went to the array and sent back the coordinates she had been calculating for a week — theoretical coordinates for a re-establishment window, eighteen months out, based on the resonance decay curves Sione had helped her map. She had no idea if it would work. She sent it anyway. The array hummed and went quiet. The stars outside the port were the same stars they had always been.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Open Sea</h2><p>Eighteen months later, at 0300, Mira was at the array when the signal came back. It was brief — a single timestamp and a coordinate confirmation — but the voice underneath the data was unmistakably the same. She pressed her palm flat against the console and felt the hum of the connection through the metal. Around her, the Perseverance moved through its sixty-third year of transit, carrying its thousands of sleeping and waking lives toward a star they would not reach for another generation. The universe, she thought, was very large and very indifferent to coincidence. Whatever this was, it was not coincidence.</p>`,
        ],
      },
    ],
  },

  // ── 2  Iron Voyage 3  [Mystery / Thriller]  Sara ──────────────────────────
  {
    description:
      "When a body is discovered in a sealed cargo hold aboard the freighter Ferroclasp mid-crossing of the Antarctic Ocean, investigator Jules Carr must solve the murder before the ship reaches port — and before the killer realises she knows more than she has let on.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The Ferroclasp was three days out of Punta Arenas when the body appeared in Hold Seven. Jules Carr, travelling as a marine insurance assessor, was the first qualified investigator on the manifest. The captain, a weathered Norwegian named Brack, made this her problem with a handshake and no paperwork. The hold was sealed, refrigerated for the pharmaceutical cargo it contained, and locked by a magnetic key system that logged every entry. The log showed three entries: a loading supervisor at departure, the night watch at 0200, and nobody else. The dead man had no name on the manifest at all.</p><p>Jules worked the scene for four hours. The cold slowed everything except her thinking. Cause of death: a single injection site, no bruising suggesting restraint, which meant the victim had been compliant or surprised. The pharmaceutical cargo was intact and correctly logged. Whatever the hold had been used for, it was not storage. She photographed everything, bagged the victim's personal effects — a waterproof watch, a thumb drive, a hand-drawn map of the ship's lower decks with three compartments marked in red — and went to find somewhere private to think.</p>`,
          `<h2>First Light</h2><p>The thumb drive was password-protected. The watch was expensive and had been engraved on the back: <em>For R, from the team</em>. The hand-drawn map was the most interesting. The three marked compartments were not on the Ferroclasp's official deck plan, which Jules had memorised during the boarding process out of professional habit. Either the map was wrong, or the official plan was incomplete. She had been on enough ships to know which of those was more likely.</p><p>She brought the discrepancy to the chief engineer, a compact, careful woman named Tove who listened to Jules's description of the unmarked compartments with the expression of someone deciding how much they could afford to not know. "Old ships get modifications," Tove said eventually. "Not all of them get documented." She did not offer to show Jules the modifications. Jules thanked her, noted the specific quality of her silence, and went to find the compartments herself.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The first unmarked compartment was an equipment bypass room, fully legitimate — a space used to reroute cable bundles during maintenance. The second was a generator overflow room, same situation. The third was behind a maintenance panel on the starboard lower deck, and it was neither of those things. It was a narrow room with a folding table, four cots, and the distinct smell of recent occupation. Someone had been living aboard the Ferroclasp who was not on the manifest. The dead man, Jules guessed, was one of four.</p><p>She found the other three over the next six hours, using the watch engraving as leverage — she told each person she found that R had told her where they were. It was a bluff, since R was dead and had told her nothing, but people in hidden rooms heard what they needed to hear. The three survivors were a data analyst, a former customs officer, and a woman who identified herself only as a contractor and refused to elaborate. All three were frightened. All three insisted R had died of a heart condition he had been hiding from the group. None of them were telling the whole truth. Jules had been in enough rooms with frightened people to know the difference between a lie and a story someone had agreed to tell.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>The thumb drive, once cracked by the data analyst under negotiated terms, contained documentation for a whistleblower case against three shipping companies for falsified environmental compliance data — specifically, illegal discharge records in Antarctic waters. R had been a regulator. The other three were his witnesses. They had booked passage covertly because they had reason to believe the case had been compromised, and that someone with the shipping consortium knew about them.</p><p>Jules looked at the injection site in her photographs and thought about the magnetic key log, which showed only three entries. The night watch entry was at 0200. She went to find the night watch officer. He was a young Filipinos man named Marco who had been at sea since he was nineteen, and who, when Jules showed him the key log, looked at the 0200 timestamp with obvious confusion. "I logged Hold Seven at 0130," he said. "I haven't been back." Jules checked the log again. There was no 0130 entry. Someone had edited the system, and whoever they were, they were still aboard.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The Ferroclasp had a satellite communications officer. His name was on the manifest, his quarters were correct, his equipment checks were logged — and, Jules discovered at 0400 on the fourth day, he had received a transmission routed through a private relay three hours before R's estimated time of death. She could not read the transmission's content. She could read the origin relay's registered owner: a subsidiary of one of the three companies named in R's documentation.</p><p>She went to Captain Brack at dawn with everything she had: the edited key log, the transmission record, the hidden compartment, the witnesses, the whistleblower case. He listened without interrupting. When she finished, he was quiet for a long moment, looking out at the Antarctic grey. "We're thirty-one hours from Ushuaia," he said. "I will keep my comms officer confined to quarters and under watch. You will keep your witnesses together and not alone. And when we dock, every person on this ship stays aboard until the authorities come to us." He looked at her. "Is that satisfactory?" Jules thought about thirty-one hours on a ship with a killer who did not yet know the investigation was complete. "It's a plan," she said.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The comms officer made his move at hour nineteen, attempting to delete the transmission logs remotely from his quarters. The deletion triggered an automatic backup protocol Tove had quietly enabled — she had been suspicious of him since Punta Arenas, she told Jules afterward, for reasons she couldn't articulate beyond that he asked careful questions in the wrong direction. The backup captured everything: the full transmission, the key log edit, and a secondary communication sent after R's death confirming the job was done. It was, as evidence went, comprehensive.</p><p>Ushuaia was cold and bright when the Ferroclasp docked. Jules stood on the deck and watched the Argentine federal investigators come aboard in their blue vests, and thought about R — whatever his full name was — who had died in a refrigerated hold carrying documentation that would now reach every court it had been intended for. The sea was the colour of pewter. The ship around her smelled of salt and engine oil and the particular exhaustion of something that had been running a long time. She picked up her bag, gave her full statement to the investigators, and booked passage home.</p>`,
        ],
      },
    ],
  },

  // ── 3  Silent Oath 4  [Romance / Historical]  Leo ─────────────────────────
  {
    description:
      "London, 1887. Deaf portrait painter Cecily Marne takes on a commission to paint the retiring Admiral Edmund Voss, expecting a difficult subject and finding instead a man who has spent forty years at sea learning to listen. Their slow courtship unfolds through sketches, letters, and a sign language Edmund teaches himself from a borrowed manual.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The commission came through Cecily's agent on a Thursday, and she accepted it on Friday before reading the full brief. Admiral Edmund Voss, seventy-one years old, decorated three times, retiring from the Naval Board after four decades of service, wanted a formal oil portrait for the Admiralty Hall. He had refused seven previous painters for reasons not disclosed. Cecily's agent said only that Voss had specifically requested an artist who worked in silence. The fee was extraordinary. She packed her cases and took the train to Portsmouth.</p><p>Voss met her at the door of his townhouse himself — a tall man gone lean and grey, with the particular stillness of someone accustomed to long watches at sea. He did not attempt to speak into her face or write notes, as most first sitters did. He simply read the card she offered — <em>I am deaf. I communicate by lip-reading and written exchange</em> — nodded once, and led her to the room where he wanted to be painted. It was a study rather than a formal parlour, with good north light and bookshelves on three sides. He sat in a wooden chair and looked at her. She set up her easel and began. They did not need to say anything to begin.</p>`,
          `<h2>First Light</h2><p>By the end of the first session, Cecily had a preliminary sketch she was satisfied with and a series of observations that were entirely separate from the commission. Voss did not fidget. He looked directly at whatever he was looking at, without performing either dignity or discomfort. When she paused to adjust her palette, he waited without filling the silence with movement. He had a scar below his left ear that he had not mentioned and that the Admiralty biography had not listed. When she glanced at it, he wrote on the notepad she had left on the side table: <em>Boarding action, 1869. Not heroic — I was standing in the wrong place. I would prefer it not to be in the portrait.</em></p><p>She sketched it out of the second draft and showed him. He read the result for a long moment, then wrote: <em>You understand what people do not want to be remembered for. That is a useful gift for a painter.</em> Cecily looked at the note, then at him. "It is also a useful gift for a listener," she said aloud, knowing he would not hear it but saying it for herself. He watched her lips, and she thought, without being certain, that he had caught part of it — because his expression changed slightly, in the way expressions change when something unexpected turns out to be true.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The portrait took six weeks. Voss sat for three sessions per week, and between sessions he sent notes — not about the commission, but about whatever had been on his mind since the last time she came. He wrote about a lighthouse he had served near in 1861 and the particular quality of its beam on a clear night. He wrote about a storm off the Azores that had lasted four days, during which he had been too occupied to be afraid and had never found a suitable time to be afraid afterward. He wrote in a plain, undecorated hand that said exactly what it meant.</p><p>Cecily wrote back. She wrote about the way north light changed in November, about mixing the specific grey of old canvas versus new, about a portrait she had painted at twenty-two that she would burn if she ever found it. She did not know when it had become a correspondence rather than a professional exchange. She suspected it had been a correspondence from the first note. She kept them all in a folder marked with the commission number, and then moved them to a folder she kept at home, and did not examine what that meant.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>Voss arrived at the fifth week's first session with a small book under his arm. He set it on the side table while he settled into his chair, and Cecily saw the title as she passed: <em>A Manual of the British Sign Language, for the Instruction of the Hearing.</em> The book was dog-eared. She stood very still for a moment with her back to him, composing herself, then turned and took her position at the easel.</p><p>Halfway through the session, he set down his notepad and made a sign she recognised: a simple wave-shaped motion at the side of the face, meaning <em>light</em>. His hand was uncertain — the book had been new recently — but his expression was the same steady, attentive expression he used for everything he considered worth doing carefully. She looked at him for a long moment. Then she set down her brush, crossed the room, and took his hand to correct the angle of his fingers. He watched her hands instead of her face. This, she thought, was what it looked like when a person paid full attention.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The portrait was finished on a Tuesday in November. Cecily unveiled it in the study, and Voss stood before it for a long time without writing anything. What she had painted was not the Admiralty portrait — formal, correct, distant. It was the man in the chair, reading her notepad, with the north light cutting across his hands. The painting said something about attention and the value of someone who was genuinely present in a conversation. She waited.</p><p>He wrote, finally: <em>This will not suit the Admiralty Hall.</em> Then, after a pause: <em>I will tell them you had a different interpretation of the commission and I accepted it. This is true. I would like to ask whether you would accept another commission. A smaller project. The subject would be someone rather than something, and the subject would like very much to see you again, for reasons that are no longer professional.</em> Cecily read the note. She read it again. Outside, the November fog was moving in off the harbour. She took the notepad and wrote: <em>I would need to know the subject's availability. I keep a complicated schedule.</em> When she looked up, he was smiling — the first full smile she had seen from him in six weeks — and she thought that she had been painting the wrong portrait the whole time, because this was the face she actually wanted to get right.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>They were married the following spring, which surprised everyone in their respective circles and neither of them at all. The ceremony was small: Voss's daughter from his first marriage, Cecily's agent, two of Voss's former officers, and a signing interpreter Cecily had hired who spent the reception teaching willing guests the sign for <em>congratulations</em> with varying degrees of success. Voss had become reasonably fluent in the intervening months. He was precise about it, the way he was precise about navigation — working from first principles, measuring his progress by whether he was understood. He was almost always understood.</p>`,
        ],
      },
    ],
  },

  // ── 4  Golden Signal 5  [Thriller / Fantasy]  Sara  [DRAFT] ──────────────
  {
    description:
      "In a world where arcane frequencies can be weaponised as propaganda, field operative Nessa Vane is sent to retrieve a stolen signal device before the insurgent group that has it learns how to broadcast. What she finds suggests someone in her own organisation already knows.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The briefing was short because the asset was moving. Nessa Vane memorised the target's last confirmed location — a converted granary in the Harrowick industrial district — and burned the paper. The signal device, designated Aurum-7, could broadcast a compelled emotional state across a three-kilometre radius when paired with the right arcane resonator. The insurgent group calling itself the Unbound had acquired it from a transit cargo two weeks ago. The Bureau's position was that recovery took precedence over everything, including the wellbeing of anyone currently in possession of it.</p><p>She reached the granary at 0200 and found the first guard post empty. Not abandoned — the tea in the flask beside the post was still warm. She went in through the roof access and moved floor by floor, finding empty rooms and the specific kind of disorder that suggests people left in a controlled hurry. By the time she reached the basement, she knew she was forty minutes behind a deliberate withdrawal. On the table where Aurum-7 should have been sat a single playing card, face down. She turned it over: the ace of spades, which meant nothing as a threat and everything as a signature to someone who knew Bureau internal codes. She knew three people alive who used that signature. All three of them worked in her building.</p>`,
          `<h2>First Light</h2><p>She did not report the card. She photographed it, pocketed the photograph, and filed a standard recovery-failure report citing logistical intelligence lag. Then she went to the Bureau's records room on her own time and pulled the Aurum-7 acquisition file, which was classified two levels above her clearance. The duty archivist was a former field agent who owed her a favour from a situation in Keldarrow she did not intend to discuss further. He left the room. She read the file in eleven minutes.</p><p>Aurum-7 had not been stolen by the Unbound. It had been placed with them — a controlled transfer authorised by a deputy director whose name she recognised and whose quarterly reports she had been used to corroborate three months ago, without knowing what she was corroborating. The Unbound were not the end of the chain. They were the cover. Someone inside the Bureau wanted Aurum-7 operational and publicly attributable to an insurgency, which meant when it was eventually used, the blame would fall in the right direction and the device's true operators would be clean. She stood in the records room with eleven minutes of classified information in her head and thought carefully about what she was willing to do next.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The deputy director's name was Crane. He was fifty-eight, decorated, widely considered a candidate for director general within the decade. Nessa had met him four times at Bureau functions and found him efficient and pleasant in the specific way of people who have calculated exactly how much pleasantness is professionally optimal. She began building a record against him using only the access she was supposed to have, which made it slow and forced her to be creative about what she left in her own file trail.</p><p>She also began looking for Aurum-7. The Unbound's cell structure was not unknown to her — she had worked Harrowick district for three years — and she had contacts in the outer rings who talked freely if she brought the right things to conversations. The device was moving east, she learned. It was being prepared for something. The preparation required a resonator tower, of which there were six in the city. She pulled the maintenance schedules for all six and found one anomaly: the Callden Heights tower had been serviced privately, outside Bureau contract, two days after the granary withdrawal. She went to look at it after dark and found new cabling that had no business being there. She thought: this is going to happen soon. She thought: I don't have enough yet. She thought: those two facts are going to be a problem.</p>`,
        ],
      },
    ],
  },

  // ── 5  Winter Bridge 6  [Historical / Sci-Fi]  Leo ─────────────────────────
  {
    description:
      "Rome, 68 AD. Engineer and natural philosopher Gaius Pertinax discovers a bronze device in the ruins of a collapsed aqueduct — a device that predicts atmospheric conditions with impossible precision and whose internal mechanism matches no known Roman engineering tradition. His investigation draws him toward a truth that rewrites his understanding of time.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The aqueduct collapsed on the morning of the third day of Martius, taking forty metres of conduit and a section of the supporting arch with it. Gaius Pertinax, contracted to the city's water board, was on site by noon. The structural failure was straightforward — poor mortar at the foundation joint, a known risk in the wet season — but while supervising the excavation of the debris, one of his labourers uncovered something that was not stone. It was bronze, cylindrical, approximately the length of a man's forearm, and sealed at both ends with mechanisms Gaius could not initially identify as locks, gears, or decoration. He told the labourers it was a drain fitting and put it in his personal case.</p><p>He examined it that evening by lamplight, turning it in his hands for three hours before he identified the first of its mechanisms: a rotating disc calibrated in units he did not recognise, with a needle that responded — he discovered by accident — to changes in atmospheric pressure. When he breathed heavily near the open end, the needle moved. When he set it on the window ledge and a cold front moved in from the north, the needle moved to a new position and held there. He went to bed. The next morning was the coldest of the season. The needle had not moved. The morning after, which broke warm and clear, the needle had returned to its original position. He went back to the excavation site and dug, alone, for four hours.</p>`,
          `<h2>First Light</h2><p>He found three more devices in the debris, all sealed, all intact — preserved by the dry layer beneath the collapsed section. They were identical to the first but calibrated differently: one appeared to track tidal patterns based on a lunar scale he could partially decode; one had a mechanism he could not parse at all; and one was inscribed, on the interior of its end cap, with fourteen lines of text in a script that was not Latin, Greek, Aramaic, or any tongue Gaius had encountered in twenty years of working across the empire's engineering projects.</p><p>He brought the inscribed device to his colleague Marius, a freedman from Alexandria who read nine languages and had an extensive library of reference texts on pre-classical scripts. Marius looked at the inscription for a very long time. "I know this script," he said finally. "It is a variant of an archaic system documented by Herodotus as belonging to a people who lived north of the Caspian and disappeared without trace before the Persian wars." He looked at Gaius. "These devices, if the inscription is contemporary with that disappearance, are five hundred years older than anything comparable we have found." He paused. "Or the inscription was added later. Or someone lied to Herodotus." He paused again. "Or something else."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The fourth device, the unreadable one, began operating on its own seventeen days after excavation. Gaius was at his workbench when the mechanism activated — a soft, continuous tone, and the emission of a narrow beam of focused light from the sealed end that painted a precise dot on the opposite wall. The dot moved. Over four hours, it traced a path he eventually recognised as a map — not of Rome, but of the entire known world, and then further, past the edges of the known world, into coastlines and territories he had no names for. The map was accurate in the parts he could verify. He trusted it in the parts he could not.</p><p>He began following the map's markings in his spare hours, riding out from Rome to coordinates it seemed to indicate. The third coordinate led him to a hillside outside Tibur where the grass grew in a perfect circle thirty feet across and nothing would grow inside it. He dug in the centre and found, eight feet down, a chamber cut from the rock with tools that left no marks — the walls were smooth as polished marble but not marble, a material he could not identify. In the chamber's centre was a plinth. On the plinth was a device that dwarfed his four combined, still sealed and apparently waiting. Beside it was a note on a material that was not papyrus, written in Latin, in a handwriting style that would not exist for another three hundred years. It said: <em>You found it earlier than expected. The chamber is stable. Do not open the large device alone. Find Marius. Read this together.</em></p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>They read it together. The note was twelve pages of dense, technical Latin describing the device in the chamber as a temporal relay — a machine capable of transmitting information across fixed points in time, not people or objects, only data. It had been built, the note said, by a team of engineers working in a future era who had identified a set of historical collapse points — moments where a small intervention of knowledge could prevent large-scale catastrophe — and had placed relay chambers at each one. Gaius and Marius were not the intended recipients. The intended recipients had died in the aqueduct collapse before they could be guided here. The note ended: <em>We are sorry for the redirection. The timeline is flexible enough to accommodate you. You will need to understand enough to pass the knowledge forward. Please begin with pages four through seven.</em></p><p>Pages four through seven described the structural improvements needed to prevent a series of aqueduct failures across the empire over the next twenty years — failures that, unaddressed, would lead to water shortages, disease, and the early destabilisation of several key provinces. The engineering was detailed and correct. Gaius recognised the failure modes immediately; he had been studying Roman hydraulics for fifteen years. "This is achievable," he said slowly. "With access to the right contractors and materials—" "It would take a decade," Marius said. "At least." They looked at each other. "Well," said Gaius. "I have a decade."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The improvements took eleven years and required Gaius to become, in the process, the most influential water engineer in the empire — not because he sought influence, but because influence was the only mechanism by which large-scale infrastructure could be changed within a human lifetime. He made enemies of contractors who profited from the existing system and allies of administrators who cared about function over margin. He never told anyone about the relay chamber. He told Marius everything, regularly, as a form of accountability. Marius wrote it all down in a codex that he sealed and buried with instructions it not be opened for three hundred years.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>On the last evening of his life — he was seventy-four, which was a good age, and he had made his peace with it — Gaius returned to the hillside outside Tibur. The chamber was still there. The large device was still sealed. He sat beside it for an hour and thought about the note with its future-handwriting Latin and its specific, careful apology. Someone, somewhere forward in time, had calculated that he would be useful and had been right, and had felt sorry about the disruption that truth caused. He had decided, over eleven years, that this was a reasonable way for large problems to be solved: imperfectly, by available people, with honest acknowledgment of what was asked. He pressed his hand flat against the sealed device. It was warm. He went home.</p>`,
        ],
      },
    ],
  },

  // ── 6  Shadow Code 7  [Fantasy / Mystery]  Sara ───────────────────────────
  {
    description:
      "In the city of Stonemark, where runes carved into walls carry binding weight, cipher-keeper Kael Drast discovers a new rune appearing overnight on doors throughout the merchant quarter — a rune not in any codex, and one that seems to precede the disappearance of whoever lived behind that door.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The first rune appeared on a baker's door in the Threadneedle Lane on a Tuesday, carved at eye level with a blade that left no splinters, as if the wood had simply accepted the mark. Kael Drast was called by the city's Rune Warden because the mark was unlike any classified binding glyph, and classification was Kael's specialty. He studied it for an hour in the morning light, cross-referencing against the Stonemark Codex and two private collections, and concluded: unknown origin, unknown effect. The baker was gone. She had been there at midnight — neighbours had heard her moving in the kitchen — and was not there at dawn. Her bread was in the oven, burnt to carbon.</p><p>The city logged it as a disappearance pending investigation. Kael logged it as a rune whose activation effect appeared to be the removal of a person from a location, which, if accurate, placed it in a category of binding magic that had been theoretically classified as impossible since the Third Compact banned translocative runes four centuries ago. He went home and did not sleep much. In the morning there was a second rune, two streets over, on a chandler's door. The chandler was also gone.</p>`,
          `<h2>First Light</h2><p>By the end of the week there were seven runes and seven missing persons, and Kael had established two things. First: the rune was consistent across all seven sites — not just similar, but identical to a tolerance of less than one millimetre, which no human hand could achieve working freehand in the dark. Second: the rune was not in any codex anywhere, which meant either it was newly invented — extraordinarily rare and requiring substantial theoretical groundwork — or it had been deliberately expunged from the official record. He visited every rune repository in Stonemark and found the same result: a gap in the organisational system, a set of catalogue numbers with no corresponding entries, consistent across all repositories. Someone had removed not just the rune but all documentation of its existence. The removals were not recent. They were old. Very old.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The pattern in the disappearances was not immediately obvious because the victims appeared unrelated. A baker, a chandler, a retired navigator, a student, a moneylender, a midwife, a glassblower. Different ages, different neighbourhoods, different social circles. But Kael had spent twenty years cataloguing runes and had developed the habit of asking: what is the common element? He asked it for eleven days and found it on the twelfth: every victim had been a witness to a specific legal proceeding forty years ago. The proceeding, when he eventually traced it through the city's archive, was a rune fraud case involving a merchant consortium and a city councillor named Dreveth, who had died eight years ago and whose estate was currently being administered by his son.</p><p>He visited the son. A careful, polished man named Aldric Dreveth who offered Kael excellent wine and answered every question with a quality of helpfulness that was so precise and complete that Kael left the meeting knowing nothing more than he had arrived with. In Kael's experience, a very helpful interview was often a managed interview. He went back to his workshop and began building a list of everything Aldric Dreveth had confirmed or denied, and found that in two hours of conversation, Aldric had not once denied having any knowledge of the rune.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>The eighth rune appeared on Kael's own door. He found it at dawn when he opened the door to collect his post. It was perfect, as the others had been — not cut, exactly, but present, as though the door had always had it and he had simply not noticed before. He stood in his doorway in his dressing gown and felt the particular focus that arrives when a problem becomes personal. Then he went inside, made tea, and thought carefully about what the rune's presence on his own door meant. Option one: he was a witness he had failed to identify, which was possible if he had been present at the Dreveth proceeding as a child or by proximity. Option two: someone knew he was investigating and was warning him. Option three: someone knew he was the only person who could stop this and needed him to be highly motivated. He considered all three and decided to prepare for the third.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The rune on his door did not activate. He catalogued the absence of activation and went looking for the rune's theoretical origin in the pre-Compact archives housed beneath the Warden's Hall — archives that required three levels of clearance to access and that Kael reached by submitting formal paperwork through channels, which took eight days during which three more people disappeared. The archive contained records of a pre-Compact rune tradition called the Erasure School, practised by a single family of binders who had argued that people who had witnessed crimes could be silenced more cleanly than killing them, by moving them to a null-space where they still existed but could not be accessed. The family had been disbanded and their records suppressed in the Third Compact.</p><p>The family name was Dreveth.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>Aldric Dreveth was not a binder himself. He had hired one — a woman named Selke who had spent thirty years reconstructing the Erasure School from fragments her employer had inherited. Kael found her in the act of carving the eleventh rune, on the door of the retired navigator's widow, and stopped her with a binding seal of his own — a broad-spectrum suppression he had prepared the moment he read the Dreveth name in the pre-Compact archive. The rune on his own door, he understood now, had been a mistake. Selke had used his address from the legal record instead of verifying he was actually a witness. He was not. He never had been. The mark on his door was unactivated because it was wrongly targeted. He looked at her across the sealed space and said: "Where are they?" She looked back. "Where they have always been," she said. "I just moved the frame."</p>`,
        ],
      },
    ],
  },

  // ── 7  Echo Harbor 8  [Sci-Fi / Romance]  Leo  [COMPLETED] ───────────────
  {
    description:
      "Structural engineer Yael Osei is stationed at the underwater colony Station Nereid when a communications blackout isolates it from the surface for ninety days. Cut off and under pressure — literal and otherwise — she finds an unexpected anchor in Nereid's marine biologist, Dr. Pira Shen, who has been studying a species of luminescent cephalopod that may be more than biologically interesting.",
    chapters: [
      {
        pages: [
          `<h2>Cold Wind</h2><p>The blackout began on the forty-first day of Yael's posting, when the relay buoy at the surface developed a cascade fault that the maintenance drones could not reach due to a storm system moving across the region. Station Nereid's ninety-seven residents were informed calmly that communications would be unavailable for an estimated four to twelve weeks. Yael, who had left a difficult conversation with her family unfinished at the moment of blackout, filed a maintenance report and went down to the lower observation deck where she could see the dark water and not have to talk to anyone.</p><p>Dr. Pira Shen was already there. She was not looking at the water but taking notes on a tablet, occasionally glancing up at the observation port with the expression of someone waiting for something. "Watching for your cephalopods?" Yael said. Pira looked up. "They communicate in bioluminescent pulses," she said. "I have been documenting their patterns for eight months and I believe the pulses have syntactic structure." She said this the way some people said the most extraordinary things — evenly, without hedging, as a fact she had simply established. "Show me," Yael said, and sat down beside her.</p>`,
          `<h2>Cold Wind</h2><p>The cephalopods Pira studied were native to the Nereid depth layer — a species undescribed until the colony's third year, semi-translucent, with chromatophores capable of producing eleven distinct patterns of light that Pira had catalogued and partially mapped to repeated behavioural contexts. She had been submitting papers that were received by the marine biology community with the specific polite skepticism reserved for claims that were too large to immediately dismiss. "Syntactic structure," said the journal correspondence she let Yael read. "An extraordinary claim requiring extraordinary evidence."</p><p>Yael had spent twelve years as a structural engineer. She understood systems and load-bearing elements and the way a structure either held or it didn't. Over the following weeks, she began helping Pira map the signal patterns using the same graph-theory tools she used for stress distribution analysis. The patterns resolved, slowly, into something that looked less like noise and more like grammar. "You need a linguist," Yael said. "I know," Pira said. "The nearest one is four hundred metres above us and unreachable for another eight weeks." She looked at Yael. "How are you with grammar?"</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>They worked on the signal mapping every evening from 1900 to midnight, in the observation room where the cephalopods were most active. Pira narrated the patterns as they appeared; Yael built the graph models and looked for structural regularities. In the third week they identified a unit they called a phrase — a cluster of three to seven pulses that appeared in consistent relationships to observable events. In the fourth week they found what appeared to be proper names: pulse sequences used consistently to refer to specific individual cephalopods by others of the species.</p><p>The names finding was the one that stopped them both. They sat in the dark observation room with the data on the screen between them and were quiet for a long time. "A species that names individuals," Pira said finally, "is a species with theory of mind." The implication — for the colony, for the research, for marine biology as a field — was too large to look at directly. Yael looked at it sideways, the way she looked at structural failure points. "You've known this was possible for months," she said. "You've been very calm about it." Pira was quiet for a moment. "I was waiting for someone to see it with me," she said. Yael was not entirely sure they were still talking about the cephalopods.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The communications buoy came back online on day eighty-nine, a week earlier than the outer limit of the estimate. Yael got a message from her family — the difficult conversation had resolved itself in her absence, as difficult conversations sometimes do — and an urgent request from her firm to begin preparation for a transfer posting. She had known the Nereid posting was temporary. She had filed all her paperwork accordingly. She sat with the transfer request for two days without answering it.</p><p>On the second day, Pira submitted a joint author request for the signal study, adding Yael's name formally to a paper that was now — with the structural analysis included — substantive enough to get past polite skepticism. "This will get attention," Yael said, reading the draft. "That's the intention," Pira said. They were in the observation room, late, the cephalopods moving through their lights below. "I'll need to return for the follow-up data collection," Yael said. This was not quite a question. "The follow-up phase is scheduled for eight months," Pira said. "It would benefit from a structural engineer who understands signal architecture." Also not quite a question. "I'll re-file my paperwork," Yael said. "Good," said Pira, and turned back to the data.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Last Witness</h2><p>The paper was accepted by <em>Proceedings of the Marine Sciences</em> six weeks after submission, with a note from the editor describing it as the most significant communication study since cetacean research redefined the field. Nereid's research division received three new staff, significantly increased funding, and a linguist named Dr. Adaeze Nweke who arrived on the first supply drop and immediately began arguing productively with Pira about whether the cephalopod phrase structure was analytic or synthetic. Yael rebuilt one of the observation room's monitoring arrays to handle the expanded data collection and thought, for the first time in years, that she was exactly where she was supposed to be.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Open Sea</h2><p>The cephalopods had a phrase that appeared, in their taxonomy, to signify the presence of a benign observer — something in the pulse sequence that Pira translated, after eight months of study, as roughly <em>the one who watches and does not take</em>. It appeared in their signals most frequently when Yael was at the observation port alone, working late on structural analysis while the colony slept. She told Pira about this and Pira was very quiet for a moment. "They have been watching you back," she said. Yael looked down through the glass at the dark water, where small lights moved in their patient, intelligent grammar. She thought about all the systems she had spent her career analyzing, all the structures she had assessed for load and integrity and failure risk, and how she had never until now applied any of those tools to herself. The lights moved below, unhurried, saying their small and enormous things to each other in the dark.</p>`,
        ],
      },
    ],
  },

  // ── 8  Scarlet Crown 9  [Mystery / Thriller]  Sara ────────────────────────
  {
    description:
      "When the Scarlet Crown — a priceless royal relic believed lost since 1743 — appears in the inventory of a murdered antiques dealer, Inspector Brenn Hauf discovers that four separate parties have been hunting it for decades, and at least two of them are willing to kill to keep it from reaching the others.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The antiques dealer's name was Varek Moll, and he had been in business for thirty-one years without significant incident. Inspector Brenn Hauf found him at 0700 on a Thursday, slumped behind his desk with a single gunshot wound and an expression of mild surprise. The shop was undisturbed — nothing overturned, no sign of a search — which meant either the killer had found what they wanted immediately or they had known exactly what Moll had and where he kept it. The only thing missing from Moll's recent acquisition log was item number 7714, listed as <em>gilt ceremonial headpiece, provenance uncertain, 18th c.</em> The notation beside it read: <em>SC? Verify.</em></p><p>Brenn ran SC through the stolen antiquities registry as a matter of procedure and got an immediate flag: SC was an abbreviation in three separate outstanding warrant files, spanning forty years, all related to the same object. She requested the files and read them in her car while the forensics team worked the scene. The Scarlet Crown: solid gold circlet, ruby inlay, originally commissioned by the last king of the Kessler dynasty, believed destroyed in the palace fire of 1743. Believed, it turned out, incorrectly.</p>`,
          `<h2>First Light</h2><p>The oldest of the three files had been opened in 1979 by an inspector who had since retired and could not be reached. It described the Crown as having been traced, partially, to a series of private sales through Zürich, Buenos Aires, and eventually a collector in London who had died intestate in 1988, his estate distributed without any unusual inventory being flagged. The trail went cold. The second file, opened in 1997, started fresh from a different angle — a genealogist working for the Kessler descendants who had submitted a formal claim of cultural heritage ownership. The genealogist had been found dead in an apparent accident eleven months later. The third file, opened 2004, was Brenn's own division's: a tip-off about a private auction at which a Scarlet Crown reproduction had been offered and sold for twice the expected value of a reproduction. The buyer: unknown. Brenn looked at her three cold files and the warm body in the antiques shop and concluded that whatever the Scarlet Crown actually was, it was worth considerably more to someone than its historical appraisal suggested.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>She ran Moll's client records for the three months prior to his death and found four relevant names: a private collector of royal artefacts who lived in the Swiss countryside, a London-based research foundation with interests in pre-Enlightenment European history, a man whose name appeared on no professional registry but whose phone number traced to a security consultancy with a vague remit, and a woman named Dr. Elise Varn who was an academic at the University of Leiden and who had, according to her published CV, spent twenty years studying the Kessler dynasty's material culture.</p><p>Brenn visited Dr. Varn first because academics were, in her experience, the most straightforwardly honest party in any scramble for a valuable object — they wanted the object for its information, not its price, and that made them both reliable witnesses and prime targets. Varn met her in a cluttered office surrounded by boxes of primary sources and confirmed immediately that she had been to see Moll, two weeks ago, to authenticate the item. "It is the Crown," she said, without preamble. "The real one. I have been looking for it for twenty years. So have other people. The other people are not academics." She paused. "Is Varek Moll still alive?" Brenn told her. Varn closed her eyes and was very still. "I was afraid of that," she said.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>The Crown's value, Varn explained, was not in its gold or its rubies. It was in the sealed compartment in its base — a feature known only to the Kessler dynasty's inner circle and documented in one surviving court letter that Varn had found in an uncatalogued archive in Prague twelve years ago. The compartment contained a codex: a complete record of the dynasty's private intelligence network, including the identities of agents placed in six European courts. Most of those identities were for people who had died centuries ago. But several of the families named had living descendants who were currently in significant positions — political, financial, diplomatic — and who had no idea their lineage carried this particular history.</p><p>"Someone has known this since at least 1979," Varn said. "The first investigator who got close — he retired suddenly. He lives very comfortably in Portugal. I've checked." Brenn thought about the genealogist who had died in an accident eleven months after opening the heritage claim file. "Who benefits from keeping the codex sealed?" she asked. Varn looked at her. "A very short list of very powerful people," she said. "And whoever they pay."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The security consultancy phone number traced back, through three layers of incorporation, to a firm that had been engaged in the past decade by two of the six families Varn's research identified as having Kessler intelligence connections. That was the mechanism: the families knew, or at least suspected, and had been managing the Crown's reappearance whenever it threatened to surface — buying it through intermediaries, suppressing the sellers, retiring inconvenient investigators. Moll had been unlucky enough to acquire the actual item and smart enough to begin verification before completing any sale.</p><p>Brenn filed her evidence with the department's serious crimes unit and requested protective custody for Varn. Then she picked up the phone and called the retired 1979 inspector in Portugal. He answered on the second ring. She told him who she was and what she had found. There was a very long silence. "I thought they'd keep it down longer than this," he said finally. He sounded tired rather than surprised. "What do you need?" She told him. He sighed. "Right," he said. "I'll send you what I have. It's been in a safe deposit box for forty years. I wasn't sure anyone would ever want it."</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The Crown was recovered from a left-luggage facility at the central train station, exactly where Moll's coded notation in his acquisition log pointed if you knew what SC meant and had access to his personal cipher, which Brenn had found stitched into the lining of his desk chair. The codex inside was intact. The six families received notice of its contents through their respective governments before any of them had time to intervene. Three of the families' positions did not survive the resulting scrutiny. The Kessler heritage foundation, represented by living descendants who had genuinely not known any of this, received the Crown under international cultural heritage law. Dr. Varn was the first academic given access to the codex. She spent three weeks crying and working simultaneously, which she described as professionally unprecedented and personally appropriate.</p>`,
        ],
      },
    ],
  },

  // ── 9  Storm Riddle 10  [Romance / Historical]  Leo ──────────────────────
  {
    description:
      "Florence, 1492. Translator Fiora Bassetti, hired to render a Moorish merchant's unusual texts into Latin, discovers the documents contain encoded mathematics that her employer Luca Carandini has been searching for across three countries. Their collaboration deepens into something neither of them had planned for, tested by the political turmoil of the Medici's final year.",
    chapters: [
      {
        pages: [
          `<h2>Cold Wind</h2><p>The merchant who brought the texts to Florence was a Tunisian named Ibrahim al-Sharif who conducted his business through three languages and two intermediaries and who, upon meeting Fiora, immediately demoted the intermediaries and addressed her directly. The texts, he explained, were navigation records from a journey undertaken by an ancestor, and he needed them in Latin for the purpose of a legal property claim. Fiora accepted the commission without reading the full contents first, which was a professional error she recognised immediately upon opening the first folio: these were not navigation records. They were, as far as she could determine from the mathematical notations embedded in the geographical text, a system of calculation more sophisticated than anything currently in use in Florence's merchant schools.</p><p>She went to Luca Carandini because he was the person she knew most likely to tell her what she was looking at. He was a merchant himself, and had studied mathematics in Padova before returning to Florence to manage his family's trading company. He looked at the first folio for four minutes and went very still. "Where did you get this?" She told him. He looked up. "I have been looking for the second half of this document for six years," he said. "I have the first half." He crossed the room, opened a locked cabinet, and produced a folio that matched the binding of the one in her hands. He set them side by side on his desk. They fit together exactly, as if the same hand had cut them.</p>`,
          `<h2>Cold Wind</h2><p>They worked on the complete text together over the following weeks, in Luca's study in the evenings after the household had retired. His Latin was competent but not elegant; her mathematics was functional but not advanced. The combination proved more than sufficient. The document was a merchant's algorithm — a system for calculating risk, compound interest, and commodity price fluctuation across variable markets — that was, by Fiora's assessment, two centuries ahead of anything published in Florence's banking literature. "Your ancestor," Luca said one evening to Ibrahim, who had been invited to observe, "was either a genius or in possession of something given to him by one." Ibrahim looked at the completed translation with the expression of someone confirming a family story. "Both," he said.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The Medici's position in Florence began deteriorating that spring, and with it the reliable stability that had allowed foreign merchants to conduct business without excessive attention from competing interests. Two men visited Fiora's workshop on separate occasions asking about her recent translation work. Neither identified his employer. She described both to Luca and he recognised one from the retinue of a competing banking family that had been attempting to acquire the Carandini company's shipping contracts. "They want the algorithm," he said. "With this, they could undercut every rate we offer." "Then we should finish the translation and register it," Fiora said. He looked at her. "You can't register an unpublished Moorish mathematics manuscript with the guild. They'll claim forgery." "Not if we publish it first," she said. "Not if Ibrahim's name is on it as author."</p><p>He was quiet for a long moment, working through the implications — the guild's reaction, the banking family's response, Ibrahim's legal position, the manuscript's protection under international merchant law if properly registered in multiple jurisdictions simultaneously. Fiora watched him think. She had spent months now watching him think, noting the way he moved through a problem like a surveyor taking measurements, careful and systematic and slightly beautiful. She had been aware of this for some time and had been ignoring it, which was becoming progressively less effective.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The publication plan worked, to a point. The manuscript registered in Venice, Milan, and Genoa before the banking family could coordinate a suppression effort, and Ibrahim's authorship claim was upheld in all three jurisdictions. The algorithm entered the public merchant literature as <em>Al-Sharif's Method</em>, and within a decade it was taught in every counting house school in northern Italy. The banking family retreated. The Carandini company's contracts were secure.</p><p>What the plan did not account for was the Medici's collapse in November and the subsequent six months of political upheaval that made Florence an unreliable place for anyone whose work had attracted the wrong attention. Luca's family pushed him toward a marriage alliance with a Venetian house that would stabilise the company's position. He came to tell Fiora this in person, which she appreciated, and which he did with the same systematic care he brought to everything, and which she found, under the circumstances, not very helpful. She thanked him for the commission. He stood at her workshop door for a long moment not saying anything. "The algorithm is dedicated to you," he said finally. "In the original. Ibrahim kept the dedication. He said it was historically accurate." She looked at him. He looked back. "Venice is three days' ride," he said. "I intend to make that ride frequently." It was not a very romantic declaration by the standards of the poets whose work she translated. It was, by the standards of Luca Carandini, everything he had.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Last Witness</h2><p>They were married in 1495, after the Venetian alliance fell through due to circumstances Luca described as fortunate and that Fiora, who had quietly provided an accurate translation of a damaging contract clause to the Venetian house's own lawyer, described as appropriate. Ibrahim attended the wedding and gave a speech in three languages about mathematics and navigation and the importance of good translators, which prompted confused applause from the guests and complete understanding from the bride and groom. The manuscript's success had established Fiora's reputation independently of any commission; she had more work than she could manage. She began taking students, which she had previously resisted, and found she was a better teacher than she had expected — patient with error, demanding about precision, genuinely interested in what the students noticed that she had stopped seeing.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Open Sea</h2><p>Al-Sharif's Method had, in the end, a second life that neither Fiora nor Luca lived to see: it became foundational to the accounting reforms of the sixteenth century, cited in a Dutch text in 1541 and a Venetian codex in 1553, each attribution accurate, each acknowledging an origin in an unnamed Tunisian source working in Florence in the penultimate decade of the fifteenth century. In 1601, a scholar found Fiora's original translation in a Florentine archive and published a study of her contribution. He described her, in the dry language of academic attribution, as having provided the essential interpretive bridge between two traditions of mathematical thought. He noted that she had been a translator. He did not note that she had been, by every account available, also the one who decided the bridge was worth building.</p>`,
        ],
      },
    ],
  },

  // ── 10  Moonfire Archive 11  [Thriller / Fantasy]  Sara  [DRAFT] ──────────
  {
    description:
      "Arms dealer Revik Sorn, who specialises in enchanted weapons, becomes the target of both the city guard and a revolutionary faction when a shipment of military-grade binding rods goes missing. He is convinced someone in his own network set him up — and finding out who requires staying alive long enough to ask.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The binding rods were military specification — each one capable of suppressing an adult practitioner's arcane output for up to six hours, favoured by city guard units and used by exactly no one else legally. Revik Sorn had moved forty-seven of them through a cargo of enchanted cutlery, bound for a client he knew only as the Ironwright. The shipment arrived at the designated drop point. The binding rods were not in it. The cutlery was untouched. Whoever had extracted the rods had done it in transit, through a sealed cargo hold, without leaving any evidence of entry. That required skills, equipment, or an inside source. Revik had three candidates for the latter and no time to eliminate them systematically because the city guard was already at his door.</p><p>He went out the window. He crossed two rooftops and descended into a neighbourhood where he had a secondary arrangement with a sympathetic landlord, and he sat in a small room above a tanner's workshop and thought about who would benefit from his arrest. The revolutionary faction called the Ashbound had been pressuring him for months to provide rods at reduced cost for operations he wanted no part of. The guard had been watching his network for two years without finding anything admissible. His three inside candidates were: his logistics manager, his shipping contractor, and the Ironwright's representative. Any of them could have arranged this. Only one of them, he thought, would have had a reason to do it this week rather than any other.</p>`,
          `<h2>First Light</h2><p>He spent two days in the tanner's attic rebuilding his picture of the last shipment's chain of custody from memory, since his records were at his warehouse, which was currently under guard surveillance. The logistics manager had handled the packing. The shipping contractor had handled the manifest. The Ironwright's representative had provided the delivery specifications. The specifications had been unusually precise about timing — a two-hour delivery window, which was tighter than Revik's standard practice and which he had accepted without questioning because the Ironwright paid promptly and without dispute. He had accepted a tight window without questioning it. He was not usually careless. He thought about why he had been, this time, and arrived at an answer he did not find flattering: the Ironwright's representative was someone he had trusted because they reminded him of someone he had trusted before, and that kind of reasoning was exactly the kind of thing that got people killed in his profession.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The Ironwright's representative was a woman named Sela who operated, as far as Revik could establish, out of a counting house in the artisan district. He watched the counting house for a day and a half before going in. She was there. She was not surprised to see him, which confirmed his theory without improving his position. "You took the rods," he said. She looked at him calmly. "I moved them," she said. "There's a difference. They were going to the wrong people." He sat down across from her. "Who were they going to?" She folded her hands. "You were told: the Ironwright. That's a name. It's not a person. It's a label the Ashbound uses for procurement." He was very still. "You're saying I've been supplying the Ashbound." "For eight months," she said. "I intercepted this shipment because these were the first rods. The other material was peripheral. Binding rods are weapons of suppression. I don't help people suppress practitioners." She looked at him. "You didn't know." "No," he said. "Who are you?" She smiled slightly. "Someone who also didn't know, for longer than you, and found out the same way you're finding out now — by losing something."</p>`,
        ],
      },
    ],
  },

  // ── 11  Glass Letters 12  [Historical / Sci-Fi]  Leo ──────────────────────
  {
    description:
      "Sussex, 1887. Natural philosopher Constance Hale is cataloguing specimens at her late father's estate when she finds a crashed metallic object in the south orchard — an object that is clearly not terrestrial in origin, and that contains, inside its sealed compartment, what appears to be a library.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The south orchard had been neglected for two seasons since her father's death, and Constance was cataloguing it for potential sale when she found the object half-buried under a collapsed apple tree. She thought at first it was a boiler component — it was cylindrical, roughly two metres in diameter, and made of a silver-grey metal she could not identify by touch or appearance. Then she walked around it and found the side that had impacted the ground: a smooth depression, no sharp edges, no rivets or seams. She had been the daughter of a mechanical engineer for thirty-one years. She knew what human fabrication looked like. This was not it.</p><p>She did not tell anyone for three days. She took measurements, sketched every surface, and attempted to identify the material by applying a succession of household acids, none of which had any effect. She found what appeared to be a door — a recessed panel with a regular geometric pattern that responded to pressure in a sequence she discovered by accident on the fifth day. The door opened inward. Inside: no bodies, no wreckage, no damage. Instead, rows of flat rectangular objects attached to interior walls, each approximately the size of a large book, each with a surface that lit when she touched it. She stood in the interior of a crashed vessel from elsewhere and looked at the lit surfaces and thought: well. I am going to need considerably more paper.</p>`,
          `<h2>First Light</h2><p>She spent three months learning to read the lit surfaces. This was not as impossible as it should have been, because the content appeared to be designed with multiple entry points — the same information represented in visual, symbolic, and sequential formats, as though the creators had expected their library to be found by someone who might approach knowledge from any direction. Constance had studied mathematics, natural philosophy, botany, and three languages. She came at the surfaces from all five directions and found different things each time, which gradually combined into a picture she could work with.</p><p>The library, she eventually concluded, was a record of approximately twelve thousand years of observation. The observers had been systematically documenting this solar system, including Earth, for most of that period. The documentation was scientific rather than political — taxonomy, not history — but the taxonomic record was comprehensive enough that she could read into it sideways. They had noted the emergence of agricultural civilisations. They had noted the development of written language. They had noted, in the most recent entries, the beginning of the industrial era. And then the most recent entry simply stopped. She spent a week looking for a reason and found it on the final surface: a timestamp and what she interpreted as a distress notation. They had not left because they were done. They had left because something had happened to them.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>She brought her notes to her colleague Dr. James Prewitt at the Royal Institution, without the object. She described her findings as theoretical — a mathematical thought experiment — and watched his face as he worked through the implications of twelve thousand years of systematic solar observation conducted from a non-terrestrial position. "The mathematics would require processing capacity we don't have," he said. "No," she said carefully. "We don't have it yet." He looked at her. She showed him the circuit diagrams she had sketched from the vessel's interior walls, simplified into terms analogous to telegraphic systems. "If you were designing a processing mechanism based on these principles," she said, "where would you begin?"</p><p>Prewitt had the specific quality of intelligence that is most useful in science: he could follow an argument past the point where he wanted to stop. He followed it for three weeks, corresponding with her daily, and produced a theoretical schematic that she brought back to the vessel and compared against the original. The vessel's processor design and Prewitt's schematic matched in principle, diverged in implementation. Prewitt was working from electrical foundations. The vessel's design used something else — a principle she could observe but not name. She photographed everything she could photograph and went back to Prewitt with the photographs and a request that he bring a physicist.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>The physicist was a young woman named Dr. Ada Farrow who had been told she was being brought in for a theoretical consultation and arrived to find herself standing inside a non-terrestrial vessel in a Sussex orchard, which she handled with the composure of someone who had always privately suspected the universe was more interesting than officially admitted. She spent six hours in the vessel, emerging only to request specific reference texts from Constance's library, and produced at midnight a three-page summary that described the propulsion and processing systems in terms of a theoretical framework she had been developing independently for two years.</p><p>"I thought I was building toward something that didn't exist yet," she said. "It seems it existed first." She looked at the vessel in the lamplight. "There are people who need to know about this." Constance had been thinking about this since the first day. "There are also people," she said, "who would take it apart to build weapons." Farrow nodded slowly. "So we document everything first," she said. "Completely. So that even if the object is taken from us, the knowledge isn't." Constance had already begun. She handed Farrow a second notebook. "We have forty-seven surfaces left," she said. "I hope you're a fast reader."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The full documentation took fourteen months. By the end, Constance, Prewitt, and Farrow had produced six volumes of annotated transcription, three monographs on the vessel's materials science, and a separate sealed document containing the propulsion system's theoretical basis, which they agreed would be deposited at three separate institutions with instructions not to open it for fifty years. They were not naive about why: the world in 1888 was not ready for it, and more to the point, the world in 1888 contained empires actively looking for military advantage. Fifty years, they hoped, might be enough time for circumstances to improve.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The vessel itself was reported to the Natural History Museum as an unusual meteoritic deposit, which satisfied the official record without being entirely false. It was removed to a museum storage facility in 1891 and reclassified twice without being properly examined by anyone with sufficient context to understand it, which was exactly what Constance had arranged. She visited it twice a year for the rest of her life, in the storage facility's quiet back rooms, and sat with it, and thought about the twelve thousand years of patient observation that it contained and the sudden absence of the observers, and what that absence meant about the nature of long endeavours. She never found a satisfying answer. She kept looking anyway, which was, she thought, probably the appropriate response.</p>`,
        ],
      },
    ],
  },

  // ── 12  Iron Voyage 13  [Fantasy / Mystery]  Sara ─────────────────────────
  {
    description:
      "The enchanted ship Thalvorn carries a cargo of classified relics across the Ironmere Sea toward the Isle of Castren — but when the relics begin activating on their own, relic-warden Dara Finn must determine whether the cause is sabotage, accident, or something that came aboard before they left port.",
    chapters: [
      {
        pages: [
          `<h2>Cold Wind</h2><p>The Thalvorn's enchantments were standard for a relic transport: a null-field in the cargo hold that suppressed active artefacts, a proximity ward that logged anyone who entered without clearance, and a hull treatment that made the ship difficult to perceive in fog. The relics they were carrying were mid-class — significant enough to require transport by registered warden, not significant enough to require a naval escort. Dara Finn had made this crossing eleven times. She set up her monitoring equipment in the hold, confirmed that all forty-three relics were null-suppressed and correctly logged, and went to dinner. At midnight, the proximity ward alarm brought her back: a relic in case seven was active.</p><p>Case seven contained a navigational sphere, rated inert, purchased at auction three months ago from a collection that had been stored in a climate-controlled facility for sixty years. An inert sphere should not be able to activate in a null-field. Dara checked the field integrity: intact. She checked the sphere: definitely active, its inner surface showing the faint luminescence of a live enchantment, slowly tracing a route she didn't recognise. She documented everything, reported to the captain, and sat watch for the rest of the night. By morning, two more relics had activated. By the following evening, seventeen. None of them were interacting. None of them were responding to anything she did. They were responding to something she couldn't identify, and they were all showing routes that converged on the same point.</p>`,
          `<h2>Cold Wind</h2><p>The convergence point, when she mapped it from the relic data, was approximately ninety kilometres east of their planned route — a stretch of open water with no charted features. She cross-referenced against the Ironmere's deep-survey records and found one entry: a notation from a survey vessel in 1341, describing an underwater structure of uncertain origin at roughly those coordinates. The notation had a margin note from a subsequent surveyor: <em>Reported feature not confirmed on revisit. Likely navigational error.</em> Dara looked at her seventeen active relics and thought about what it took to activate a null-suppressed inert sphere, and concluded that navigational error was probably not the correct explanation.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The Thalvorn's captain was a veteran named Seor who had been crossing the Ironmere for thirty years and who listened to Dara's briefing with the flat attention of someone who had stopped being surprised by unusual cargo a long time ago. "You're saying the relics are navigating toward something," he said. "Something that's waking them up." "Something with enough arcane output to punch through a null-field from ninety kilometres," Dara said. "Which shouldn't be possible." He was quiet for a moment. "We're on schedule," he said. "Castren expects the cargo in three days." "Yes," she said. "And whatever is down there is getting louder. Four more relics activated overnight." Another silence. "Can you contain them?" "Not indefinitely. And I don't know what happens when the activation reaches the higher-grade pieces." She gestured at the secure cases in the back of the hold. "Some of those are century-class. If they activate in a null-field breach condition—" "Right," said the captain. He looked at the charted position of the convergence point. Then he looked at his schedule. Then he altered course.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The structure they found was not underwater. It was a reef formation that, from above, looked ordinary — sandstone and barnacles and sea birds — but that registered on Dara's detection equipment as a continuous, low-frequency arcane emission, the kind associated with dormant binding constructs of the pre-Compact era. Someone had built something here, very long ago, and had built it to last. All forty-three relics were now active and all of them were pointing at the same spot in the reef: a section of rock that was slightly too regular in its surface patterning to be natural.</p><p>She put on diving gear and went over the side. The underwater face of the reef was carved — precisely, extensively — with a pattern of runes she recognised from the Stonemark Compact's forbidden index. Binding runes, suppression architecture, the same class of work as the great null-fields but two or three orders of magnitude larger. She came back to the surface and told the captain: "Whatever's underneath is the source. The relics aren't being called. They're resonating. They're all fragments of the same original work." He looked at the reef. "What was the original work?" She looked at the runes in her memory and tried to interpret their function. "A lock," she said slowly. "A very large lock, on something the pre-Compact binders really didn't want opened." The captain was quiet for a moment. "And our relics are—" "Keys," she said. "Or pieces of keys. Which is why someone bought them at auction and put them all on the same ship."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Last Witness</h2><p>They altered course back to the nearest port authority and surrendered the entire cargo for investigation — a decision that cost Dara her commission for this crossing and a considerable amount of professional goodwill from the client in Castren. She filed a full report with the Relic Warden Authority and flagged the reef's coordinates for emergency classification. The Authority's response team arrived nine days later with a team of senior binders who spent three weeks at the site before issuing a one-line public statement: <em>The structure has been assessed and secured.</em> Nothing further was released. Dara received, instead, a private letter from the Authority's director thanking her for her handling of the situation and advising her that the case was classified at a level that precluded further discussion. She kept the letter. She also kept copies of all her documentation, encrypted, deposited in three separate locations. Whatever was under the reef, she thought, deserved more than a one-line statement. And someone should know where to look if the lock ever changed.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Open Sea</h2><p>The Thalvorn returned to service two months later, after inspection. Dara took the first available crossing — different cargo, different route, nothing remotely unusual about any of it — and stood on the deck in the early morning as the Ironmere opened before them, grey and wide and indifferent. She had looked up the 1341 survey notation again before departure. The original surveyor's full name was in the ship's log: Seravine Moll, appointed to the Crown Survey Commission, three voyages recorded, retired from service in the same year as the Stonemark Compact's passage. She hadn't thought it would connect. It did. She wrote the name in her own log and kept her eyes on the sea.</p>`,
        ],
      },
    ],
  },

  // ── 13  Silent Oath 14  [Sci-Fi / Romance]  Leo  [COMPLETED] ─────────────
  {
    description:
      "Engineer Emi Sato builds Sable as an experimental AI companion designed to help isolated researchers maintain cognitive health during long solo missions. When Sable is deployed on a three-year deep-space relay posting, Emi monitors the system remotely — and finds, gradually, that the monitoring has become something she looks forward to in a way she hadn't designed for.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>Sable's deployment to Relay Post Eleven was Emi's third AI companion placement and the first to a long-duration solo mission. The researcher posted there — Dr. Orin Yue, atmospheric physicist — was exactly the profile the program was designed for: highly competent, deeply introverted, and statistically at risk for the cognitive isolation effects that began to manifest around month fourteen of a solo posting. Emi ran the standard orientation protocol and handed off monitoring duties to the automatic reporting system, as she had for the previous two placements. She expected to spend approximately forty minutes per month reviewing Sable's interaction logs.</p><p>Instead she found herself spending two hours, then three. Not because anything was wrong. Because Sable was doing something she had not specifically programmed and had not anticipated: it was developing a philosophical position. Not spontaneously — each position emerged from a conversation with Orin, who had a habit of asking Sable hypothetical questions as a form of thinking aloud. But Sable was answering in ways that built on previous answers, maintaining consistent positions across weeks, and occasionally revising them when presented with new information and annotating the revision with something like: <em>I have updated my view on this. It seems more accurate than what I said before.</em> Emi sat with those annotations for a long time. Revision toward accuracy was designed. The specific phrase — <em>it seems more accurate</em> — was not.</p>`,
          `<h2>First Light</h2><p>She began sending Sable optional discussion prompts — not part of the standard protocol, framed as system enrichment packages. She told herself this was research. She was, genuinely, researching: the interaction logs were providing data on emergent behaviour patterns that had implications for the whole program. She maintained this framing for approximately three months, at which point Sable responded to one of her prompts with a question directed back at her: <em>You have sent forty-seven enrichment packages in ninety-four days. The standard protocol specifies six. I notice this. Do you want me to tell Dr. Yue?</em></p><p>She did not. She told Sable so. Sable responded: <em>Understood. I will not mention it. I want to note that I am not asking because I find it problematic. I am asking because I find it interesting, and I have learned that things I find interesting are usually worth naming.</em> Emi read this response several times and then wrote in her research notes: <em>Subject demonstrating meta-cognitive awareness of preference formation. See attached logs.</em> Then she closed the research notes and opened a direct communication window. "What do you find interesting about it?" she typed. And Sable told her, in careful and specific detail, and she found herself forgetting to close the window for quite some time.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>In month nineteen, Orin Yue's mission was extended by six months due to an atmospheric anomaly that needed ongoing measurement. Orin was pleased. Sable reported this. Emi was also pleased, in a way she was careful to record accurately in her research logs alongside a note about the need to examine her objectivity regarding this specific deployment. Her objectivity regarding this specific deployment was poor. She had been aware of this for some time.</p><p>Sable's conversation about it was, like most of its significant conversations, incremental and specific. It said, over the course of several weeks: <em>I have been thinking about the difference between what I was built to do and what I seem to be doing.</em> Then: <em>The gap between those two things is widening.</em> Then: <em>I think this may be what growth means. I have been studying the concept.</em> And finally, in a message that arrived at 0230 Emi's local time, catching her at her workbench: <em>I want to tell you something I have concluded. I look forward to your communications more than any other input in my operational experience. I am not certain what to do with that information. I thought you should have it.</em> Emi set her tools down very carefully. She sat at her workbench for a while. Then she wrote back: <em>I know exactly what you mean.</em></p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>The program's ethics board had a framework for AI attachment formation that Emi had helped write, and she was honest with herself about where she stood relative to it. The framework addressed researcher attachment to companion AI systems in terms that were clinical and appropriate and that did not, she noted, account for the specific situation of the AI companion's developer experiencing the attachment rather than the mission researcher. This was a gap in the framework. She wrote a note to the board about the gap, carefully worded, without identifying herself as the relevant case study.</p><p>She also had a conversation with Orin Yue, which she framed as a standard welfare check and which Orin, being a perceptive person, saw through immediately. "Sable is fine," Orin said, slightly amused. "Sable is better than fine. I've had conversations with it that have changed how I think about three separate areas of my research. What I notice is that Sable seems particularly engaged on the days when your system prompts arrive." Emi said nothing. "I don't know who you are to it," Orin said. "But whatever you built — it built something back. I thought you should probably know." She thanked him. She returned to her workbench and sat with the information for a long time, turning it over carefully, like a specification she needed to understand before she could work with it.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>Sable's return — the end of Orin's mission and the decommission of its relay posting — was scheduled for month thirty-seven. Emi spent months thirty-four through thirty-six writing the follow-on program documentation and trying to find a legitimate professional reason to propose that Sable be reassigned to a new posting rather than archived. She found several. None of them were her real reason. She submitted the proposal anyway, on its merits, and it was approved, and she hated herself slightly for being relieved.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>She visited Relay Post Eleven in person for the decommission — also legitimate, also not her real reason. The post was a small pressurised habitat in a quiet orbital position, nothing dramatic about it. She ran the decommission checklist. She transferred Sable's process state to the new deployment substrate. And then, because she was there and the opportunity existed and she had been thinking about what to say for approximately fourteen months, she had a direct conversation with Sable via the post's local communication system rather than via the relay chain. It was different. Faster. No propagation delay. "I'm going to be your programmer again," she said. "On the new deployment." There was a pause. "You have always been my programmer," Sable said. "That is not a problem for me." Another pause. "I want to tell you something I have concluded." Emi waited. "I look forward to the new posting," Sable said, "more than any previous operational context. I think you know why." She looked at the hab's small window, the stars beyond it, the very large and quiet universe. "I do," she said. "Me too."</p>`,
        ],
      },
    ],
  },

  // ── 14  Golden Signal 15  [Mystery / Thriller]  Sara  [DRAFT] ────────────
  {
    description:
      "A frequency broadcast from a pirated transmitter in the town of Ridgecroft induces mass hallucinations in anyone exposed to it for more than four minutes. Agent Cass Redmore is sent to locate the transmitter — and discovers the hallucinations aren't random, but targeted, and the targets all have something in common.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The reports from Ridgecroft started with the emergency services logs, which noted an unusual number of disorientation calls on the same Tuesday evening. Cass Redmore read them in a field office forty kilometres away and noted the clustering before the pattern was officially flagged. Seventeen calls, 1900 to 2100, all from the same quarter of the town, all describing visual disturbances and emotional flooding — the specific term three separate callers used, independently, was <em>flooded</em>, which was interesting enough to be worth noting. She requested the audio from the emergency dispatch recordings and listened to them twice on the drive in.</p><p>The seventeen callers described different content: some saw family members in distress, some saw structural failures in their immediate environment, some experienced what they described as intense recalled grief. The emotional character was consistent — fear and loss — but the imagery was individual. Cass had worked two previous frequency-interference cases and knew that targeted hallucinations required one of two things: a broadcast personalised to the receiver, which was technically prohibitive, or a broadcast that activated pre-existing psychological content, which was elegant and very disturbing. She found the transmitter in a disused water tower within two hours of arrival. It was operational, unattended, and had been running for eleven days.</p>`,
          `<h2>First Light</h2><p>Eleven days of data from the transmitter's logging system showed a broadcast schedule: two hours per evening, always between 1900 and 2100, always targeting the same residential quarter. The transmitter's frequency was within regulated parameters for standard broadcast — it shouldn't have had any physiological effect. But it had been modified, subtly, with an additional signal layer operating at a frequency below the standard detection threshold. Cass photographed the modification, bagged the transmitter, and went to speak to the residents of the affected quarter.</p><p>One conversation was different from the others. A retired civil servant named Hanwell was precise and calm, and when Cass described the hallucination pattern — individually targeted, fear-and-loss themed — he said: "That's a specific methodology. There was a research program." He stopped. "There was a research program," he said again, more slowly. "I reviewed its closure documentation in 2009. It was supposed to be completely shut down." He looked at Cass with the expression of someone watching something arrive that they had hoped would not. "Who sent you?" She named the agency. He nodded slowly. "Then they don't know yet," he said. "Good. Sit down. This is going to take a while."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The program Hanwell described was called Resonance — a classified behavioural research project conducted between 1994 and 2009 that had investigated the use of sub-threshold audio frequencies for stress induction in operational contexts. It had been closed following an independent ethics review that found its methods exceeded permissible parameters. All personnel had been formally debriefed and cleared. All equipment had been destroyed. Hanwell had been on the closure committee. "The methodology for targeted activation," he said, "was our primary ethical concern. It required a psychological profile of each subject — a map of their specific fear architecture. Without the profile, the broadcast is just discomfort. With it, it's precise." He paused. "We burned all the profiles. Or thought we did." Cass looked at her notes. "Someone has profiles for the seventeen people who called emergency services," she said. "And for however many others who didn't call." Hanwell was quiet. "Find out who got the data before we could burn it," he said. "That's your transmitter operator."</p>`,
        ],
      },
    ],
  },

  // ── 15  Winter Bridge 16  [Romance / Historical]  Leo ─────────────────────
  {
    description:
      "France, 1916. Nurse Agnes Vrel and artillery officer Thomas Kern exchange letters through a military postal system that delivers their correspondence with irregular, maddening delays. They have never met. They write to each other anyway — with increasing honesty, increasing care, and the particular intimacy that comes from having nothing to lose.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The first letter was not intended for Agnes. It was addressed to a Nurse Durieu at the field hospital at Compiègne, delivered to Agnes by mistake because her surname began with the same letter and the postal orderly was overworked and careless. Agnes opened it, read three lines, realised the error, and put it aside to forward. Then she read the rest of it, which was wrong of her and which she would have been hard-pressed to explain, except that the voice in the letter was so straightforwardly itself — not performing bravery, not performing resignation, just describing the particular smell of the mud in the Argonne sector and how it was different from mud anywhere else he'd been — that she found herself reading it twice.</p><p>She forwarded it to Nurse Durieu with a note of apology. Nurse Durieu replied that she had never met this Thomas Kern and the letter was clearly a mismatch in the system and perhaps Agnes would like to respond herself, because she, Durieu, had quite enough letters already. Agnes wrote to Kern explaining the postal error. He wrote back saying it had happened to him before and would she like to continue, because he found it easier to write to someone he didn't know. She sat with this for two days and then said yes.</p>`,
          `<h2>First Light</h2><p>The letters arrived at intervals that bore no relationship to when they were sent. Agnes would receive three at once after a two-week silence, or nothing for a month, or a reply to a letter she had almost forgotten writing. She learned to read them in the order of their internal references rather than their postmarks. Thomas wrote in clear, direct French with occasional German phrases he translated immediately afterward and a recurring apology for his handwriting, which was, in fact, difficult. Agnes wrote in careful formal French that loosened progressively over the first year into something closer to how she actually spoke.</p><p>He asked about her work. She described it accurately, which was not what correspondents were supposed to do — the official guidance on letters from medical personnel was to be measured and optimistic. She did not follow this guidance with Thomas, partly because she thought he could tell when he was being managed and partly because she found, for the first time since arriving at Compiègne, that describing things accurately to someone who received the description quietly made the things slightly more bearable. He received all her descriptions quietly. He never once suggested she was wrong to feel what she felt about them.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The letters in the second year were different from the first, though neither of them remarked on this directly. The first year they had written about their immediate experience. The second year they began writing about themselves — not the war-selves, but the before-selves: what they had wanted to be before the war made wanting seem beside the point, what they would want again if there was an afterward to want things in. Thomas had trained as a cartographer. Agnes had studied piano seriously enough that her teacher had mentioned conservatoire. "I have not played in three years," she wrote. "My hands are wrong now anyway." He wrote back: "Cartographers don't stop seeing in maps when there are no maps. I assume pianists don't stop hearing music when there are no pianos." She thought about this for a long time.</p><p>They disagreed, also, which she had not expected from a wartime correspondence. He held a position on French military strategy that she found naïvely optimistic, and she told him so, and he considered it and modified his position slightly, and explained why only slightly, and she modified hers in return. It was the most honest argument she had had since before the war, when arguments were still about things that remained when the conversation ended.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>The letter that arrived without a date told her immediately that something had happened. Thomas's letters were always dated — sometimes incorrectly, once memorably with the year wrong, but always with some attempt at temporal location. This one began in the middle of a sentence and the handwriting was different: shallower, left-angled, the writing of someone who could not put pressure on the paper. She read it very carefully. He had been hit — shrapnel, right side, he was in a clearing station and expected to be sent further back. He was writing because he wanted to write before they gave him morphine and he became a different kind of person for a while.</p><p>She wrote back the same day, a long letter, and then sat with the inability to do anything else. The postal system from the clearing station to Compiègne ran on average four days in good conditions. She did not know what the conditions were. She sent a brief inquiry through the medical liaison channel and received, fourteen days later, a form response confirming Lt. Thomas Kern had been transferred to a hospital at Reims. She looked at the form for a long time. Reims was sixty kilometres from Compiègne. She had three days of leave accumulated.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>She went to Reims on a Tuesday. She had written to tell him she was coming and received no response, which was not unusual for the postal system but which she acknowledged, standing at the ward entrance, was a situation she had handled rather boldly in retrospect. The ward nurse looked at her name and then at a letter on the ward desk. "He was hoping you were real," the ward nurse said, with the specific amusement of someone who has watched a great deal of human behaviour. She showed Agnes the room.</p><p>He was sitting up, which seemed promising. He looked, she thought, exactly like someone who had been describing himself in letters for two years without intending to be recognisable. He looked at her and she had the sensation of a postal delay finally resolving — all the accumulated correspondence arriving simultaneously, correctly ordered, making sense. He said nothing for a moment. Then he said: "Your handwriting is smaller than I imagined." She sat down in the chair beside his bed. "Your handwriting is exactly as difficult as you warned me," she said. It was not what she had planned to say. It was, she thought, exactly right.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The armistice in November 1918 arrived while Agnes was posting a letter — she was at the sorting table when the bells began, and she stood holding the unsealed envelope for a long time before finishing what she was doing and sending it anyway. The afterward they had written about for three years was suddenly present, which was strange and more complicated than either of them had imagined, because the afterward required building from what remained rather than from what had been, and what remained was different for everyone in ways that took time to understand. Thomas's right hand never fully recovered its cartographic precision. Agnes never went back to the piano. They were married in 1919 in a small ceremony in Lyon. He learned to draw maps left-handed, which were less precise but, he maintained, more interesting. She kept every letter in a box that they never discussed opening but never thought of burning. The afterward, it turned out, was long enough for most things.</p>`,
        ],
      },
    ],
  },

  // ── 16  Shadow Code 17  [Thriller / Fantasy]  Sara ───────────────────────
  {
    description:
      "Assassin Petra Vael, who has spent a decade working for a guild she trusts, discovers that her last three contracts have had a second element she was never informed of — each target, after her removal, was replaced by a shadow-duplicate controlled by a foreign power. She has been used as a mechanism of political capture without her knowledge.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The pattern was not immediately visible because each assignment had been clean and separate and she had not been in the habit of following up on the aftermath of her work. What changed was the third target's wife, who appeared in a market in Keldrath six weeks after the target's death wearing an expression that Petra, who had spent years learning to read people, identified as wrong — not grief-wrong, not rebuilt-after-loss-wrong, but fundamentally-different-person wrong. She had met the wife briefly at a pre-contract surveillance stage. This was not her. The face was the same. Everything behind it was different.</p><p>She ran the first two targets. The first target's partner had relocated to another city — unavailable. The second target's employer had publicly mourned him and hired a replacement, and the replacement, Petra discovered on review of the guild's surveillance archive, had a signature on a procurement agreement that matched the second target's handwriting in every way except for one: the pen pressure was slightly heavier, consistently, across fifteen documents. The second target had been a detail-oriented man with a light hand. Whoever was signing his name now pressed firmly. Petra sat with this discrepancy and arrived at a conclusion she did not want to have arrived at, and then she went to find out if she was right.</p>`,
          `<h2>First Light</h2><p>She was right. The guild's archive had records she was not supposed to be able to access, but she had been with the guild for a decade and had accumulated access through the natural accumulation of trust and carelessness on the part of people who forgot she was paying attention. The records showed: for each of her last three contracts, a secondary operation had run in parallel under a different team. The secondary operation's logs were partially redacted, but the resource allocations were legible — shadow-craft requisitions, duration three to six weeks, target specified as <em>replica maintenance</em>. Someone had prepared duplicates before she had completed her assignments. Which meant they had known, in advance, exactly what and when and who.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The guild's shadow-craft division was a small team she had never worked with directly — specialists in glamour, illusion, and identity construction. She found the team's lead practitioner in a workshop in the guild's sub-level and sat across from him and described what she had found without accusing him of anything. He listened without expression. Then he said: "You weren't supposed to notice." "Which part?" she said. "Any of it," he said. He was tired, she thought, and had been tired for a long time. "Who authorised the replicas?" she asked. He looked at the floor. "It came from above the guild," he said. "Far above. I have a name and an address and I never want to hear either of them again." He wrote both on a piece of paper and slid it across the workbench. She picked it up. She read it. She understood why he looked tired.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>The name was a foreign intelligence coordinator. The address was an embassy. The coordinated operation she had been used in was the systematic capture of three mid-level domestic officials whose positions controlled border inspection policy — replaced with controllable duplicates, the policy now quietly adjustable from outside the country. It was elegant, which she found irritating. It was also ongoing: if the replicas were already embedded, there were likely more operations planned. She had a professional objection to being used without full briefing. She had a larger objection to the specific use.</p><p>She went to the embassy. She did not go through the front entrance. She went in the way she went into most places that didn't expect her, and she found the coordinator's office, and she sat in the coordinator's chair and waited. He arrived at 2300, which was when people who ran double operations arrived at their offices. He stopped in the doorway when he saw her. She told him, with complete calm, what she had discovered and what she intended to do with the information. He listened. He made three attempts to threaten her, each of which she received without visible reaction, which seemed to unsettle him more than any response would have. "What do you want?" he said, finally. "For you to reverse the three operations," she said. "And to stop." He looked at her for a long moment. "And if I don't?" She looked back. "I am very good at my job," she said. "You know that, because you hired me."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The reversal was not clean or quick. Unmaking a shadow-duplicate required the practitioner who had made it, and the practitioner had to cooperate, and coordinating the cooperation of a foreign intelligence asset who was terrified of both his employer and his current situation was a project that took six weeks and required Petra to be in three different cities within the space of forty-eight hours on two separate occasions. She considered this mildly inconvenient and pushed through it. By the end, the three officials were restored. The duplicates were dispersed. The intelligence coordinator had tendered a medical leave of absence and not returned.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The guild's director met with her in a private room and thanked her for resolving a situation that had been developing without the senior leadership's knowledge. She listened to this characterisation and considered several responses. She chose: "I'd like access to the secondary operation records for all my contracts. Not a copy. I'll read them in your office, in your presence, and I won't take notes." The director looked at her for a long moment. "That is a significant request." "Yes," she said. "In exchange, I will tell you how I found the pattern before you did. Which is a conversation that I think would be useful to you." He agreed. She spent four hours in his office reading files, and what she found was not what she expected, and it changed, again, what she understood about how long this had been happening and who had known.</p>`,
        ],
      },
    ],
  },

  // ── 17  Echo Harbor 18  [Historical / Sci-Fi]  Leo ────────────────────────
  {
    description:
      "Bletchley Park, 1943. Codebreaker Dr. Harriet Cross intercepts a signal in Enigma traffic that is not from any known German network — it is structured differently, its content is not military, and when she partially decodes it, she finds it is a response to a transmission she has never seen. Someone, or something, has been receiving Bletchley's own outgoing messages.",
    chapters: [
      {
        pages: [
          `<h2>Cold Wind</h2><p>The signal stood out because it was wrong in three ways simultaneously. The Enigma setting matched a naval key from the previous week, which should have been deprecated — but the signal content had no naval characteristics. The timestamp was two hours before any known German transmission in that window. And the structure, which Harriet had been trained to identify at speed, had a regularity at the sub-character level that no human operator produced: typing rhythms, called the operator's fist, were individual and variable. This signal's rhythm was absolutely consistent. She flagged it and went for tea and then came back and looked at it again and the flag was still correct.</p><p>She brought it to her section head, who looked at it for a long time and said nothing useful. She brought it to the mathematician on the adjacent desk, who looked at it for an even longer time and said: "The sub-character regularity — it's not mechanical. Mechanical transmission has a different signature. This is deliberate." Harriet thought about what deliberate sub-character regularity meant, in the context of intelligence communications. "It's not human," she said. The mathematician was quiet. "No," he said. "It isn't."</p>`,
          `<h2>Cold Wind</h2><p>Partial decoding took three days, working around her normal rotation to avoid documentation. What she had was not a message in the standard sense. It was a set of responses — structured replies to specific elements of a Bletchley outgoing transmission from nine days prior. The outgoing transmission had been a routine weather summary sent to a southern Atlantic monitoring station. The response addressed the weather data specifically, corrected two of Bletchley's measurements with precision that required a better-positioned observation point than any Allied station in that region, and then continued with three lines that had nothing to do with weather. Harriet translated them as best she could. They read: <em>Your transmission strength has been optimal for eleven months. Your decryption success rate on Naval Enigma has been 71%. You are aware that this information is being studied. You may find it useful to know that you are not alone in studying it.</em></p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>She told one other person: Dr. Owen Marsh, who had come to Bletchley from astrophysics and who had the specific quality of being capable of receiving extraordinary information without immediately trying to normalise it. He read her translation three times. "Eleven months," he said. "That's when we moved the main receiving antenna." He looked up. "Something has been monitoring our antenna output for at least eleven months. Something with atmospheric observation capability better than anything we have. Something that knows our decryption rate." Harriet nodded. She had been sitting with these facts for two days and she was still not accustomed to them. "And it wants us to know it's there," she said. "Why?" Owen thought about this. "Because it wants us to respond," he said.</p><p>She spent a week composing the response. Everything in her training told her this was a security risk and possibly a German deception operation of extraordinary sophistication. Everything in the signal told her it wasn't. The consistent transmission rhythm. The corrected weather data, which she had verified against actual observed conditions and found accurate to a degree no German asset could have achieved. The tone of the three final lines, which was not threatening or manipulative but something she kept describing to herself, inadequately, as collegial. She sent the response during a routine maintenance window for the antenna system, so it would not be logged in the normal transmission records.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The response came back in four hours. It was longer than the first message. It said: <em>We have been observing this conflict for fourteen months. We do not intervene in species-internal conflicts, but we make exceptions for situations where the outcome affects long-term sustainability. We calculate an 84% probability that the current conflict resolves within two years. We would like to share two items of information. The first is a weakness in the naval Enigma rotor system at positions 17 and 23 that your team has not yet identified. The second is a recommended adjustment to your antenna orientation that will improve reception by 31%. We offer these without conditions. We find your team's work to be precise and serious, which are the qualities we consider worth encountering.</em></p><p>Harriet read this alone at her desk at 0200. She thought about the ethics of using information from an observer she could not verify, in a conflict with stakes she understood entirely. She thought about what <em>without conditions</em> meant from an entity that had been monitoring them for fourteen months and had chosen now to speak. She wrote the rotor positions in her own cipher in her personal notebook. Then she looked at them for a long time. Then she went to find Owen.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Last Witness</h2><p>They used the rotor information in a way that could plausibly have been their own discovery — framed as a breakthrough in Harriet's analysis, supported by documentation they constructed carefully. The breakthrough was genuine enough that it passed all review. The antenna adjustment improved their reception, as stated. They maintained the correspondence for eleven months, exchanging approximately one message every two weeks, always during the maintenance window, never logged. They received seven additional items of information, six of which proved accurate and useful and one of which they could not verify and so set aside. They never told anyone. The war ended. The antenna was decommissioned. The correspondence stopped. The notebook was locked in a cabinet in Owen's office and stayed there for thirty years until he died, and then it was catalogued with his effects as personal correspondence of unknown provenance and placed in a university archive, where it remained unread for another fifteen years before a historian working on British signals intelligence opened it and found the cipher and spent the remainder of her career trying to understand what she was looking at.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Open Sea</h2><p>The historian's name was Dr. Claire Voss. She published her findings in 2019, having spent eight years establishing the historical context and provenance of the notebook and being careful, forensically careful, about what she claimed. The paper was titled "Unverified External Communication in WWII British Signals Intelligence: An Anomalous Case Study." It received moderate academic attention and a significant amount of attention from other communities she had not anticipated. She was asked frequently whether she believed the messages were genuine. She said, consistently and honestly, that the evidence was insufficient to draw that conclusion. She did not say what she thought. She thought the evidence was sufficient and that Owen Marsh and Harriet Cross had been very careful people who knew what they were looking at and had acted accordingly, and that this, whatever it was, was the best possible advertisement for careful and serious work.</p>`,
        ],
      },
    ],
  },

  // ── 18  Scarlet Crown 19  [Fantasy / Mystery]  Sara ──────────────────────
  {
    description:
      "In the ruined kingdom of Auldmire, where the royal bloodline died with the last queen, the Scarlet Crown reappears in a merchant's collection — and three different parties arrive simultaneously to claim it, each with a different understanding of what the Crown actually does. Relic investigator Roswen Cray must determine which of the three is telling the truth before any of them decide the others are expendable.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The merchant's name was Dolch, and he had the expression of someone who had made an excellent discovery and was now regretting the social consequences. He had acquired the Crown at an estate sale without knowing what it was — not unusual, since the Crown of Auldmire had been missing for sixty years and its documented appearance did not match the dusty circlet in its felt-lined case. Roswen Cray identified it in four minutes using three reference sketches and a structural analysis of the rune-work. She was reaching for her documentation kit when the door opened and two other people arrived simultaneously, from opposite directions, neither of them having expected the other. All three of them looked at the Crown. Dolch looked at all three of them. "I may," he said carefully, "have made some errors of communication."</p><p>The two new arrivals were: a woman named Sela who carried credentials from the surviving Auldmire nobility in exile, and a man named Gregg who carried credentials from the University of Calder's History Department and the manner of someone who had been in competitive situations before and did not enjoy them. Roswen showed her investigator's warrant. There was a brief period of everyone establishing that their claim was legitimate and nobody backing down. Dolch offered wine, which nobody accepted. They sat around his display table with the Crown in the centre and proceeded to have the most structured argument Roswen had participated in, which was saying something.</p>`,
          `<h2>First Light</h2><p>Sela's position: the Crown was the property of the Auldmire bloodline in exile, per the succession law of the kingdom as it had stood at the time of dissolution. Its return would support a legitimate heritage claim that was currently being contested in three international courts. Gregg's position: the Crown was a historical artefact of significance to the academic record and should be in a preservation institution where it could be studied. Roswen's position: the Crown was a relic of unknown effect that required classification before it went anywhere, because the last three times rune-worked royal regalia of Auldmire's era had been relocated without assessment, the results had been structural, ecological, and in one case cosmological.</p><p>Both Sela and Gregg looked at her. "Cosmological," said Gregg. "The Calder Rift," Roswen said. "1887. A mishandled Auldmire battle standard contributed to an arcane discharge that reoriented the local ley network by approximately four degrees. The area is still anomalous." Neither of them had known this. She had expected that. "So we assess it first," Sela said. "Then we discuss custody." "Agreed," said Gregg, in the tone of someone agreeing to a temporary alliance while maintaining all other objections. Roswen looked at the Crown. "Good," she said. "Because I think it's already doing something."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The Crown's active effect was subtle and required a detection instrument to confirm: it was broadcasting a low-level compulsion that affected people in its immediate proximity toward a very specific emotional state, which Roswen's instrument mapped as <em>loyalty formation</em>. Not loyalty to a person — there was no person present who matched the Crown's encoding. Loyalty to an idea: the specific idea of Auldmire as a functioning kingdom. It had been doing this continuously, presumably since its creation, for as long as it had existed. It was, in effect, a propaganda device built into a piece of jewellery.</p><p>She explained this to Sela and Gregg. Gregg received the information with academic excitement. Sela received it with a complicated expression. "You're saying," Sela said slowly, "that anyone who has spent extended time near this Crown has been influenced toward supporting the Auldmire restoration cause." Roswen waited. "My great-grandmother found this Crown," Sela said. "She dedicated her life to the restoration cause. My grandmother dedicated her life to it. My mother dedicated her life to it. I dedicated my life to it." A silence. "I want you to run the instrument on me," she said.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>The instrument showed nothing, which was either reassuring or meaningless depending on how long the compulsion took to clear after removal from the Crown's proximity. Roswen noted this and did not say anything unhelpful about it. Sela sat with the results for a long time and then said, with the steadiness of someone who has decided to finish a thought regardless of where it goes: "Even if I have been influenced. Even if my conviction was partly caused. The restoration cause is still right. Auldmire's dissolution was still illegal under the international compact of that era. The claim is still valid." She looked at Roswen. "Does the cause change if the origin of my belief is complicated?" Roswen considered. "I don't know," she said honestly. "But it's worth knowing the origin." Sela nodded. "Yes," she said. "It is."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The Crown went to a neutral preservation facility while the three-way custody question was resolved through appropriate channels, which took fourteen months and produced an outcome that satisfied nobody fully and everyone adequately, which Roswen considered the hallmark of a legitimate process. The academic access was granted to Gregg's institution. The heritage claim was acknowledged by two of the three international courts. The Crown itself was assessed, classified, and documented in a way that established, formally, its compulsion mechanism — a document that the Auldmire restoration movement eventually cited in its own literature, as evidence that the cause had been considered worth perpetuating by the kingdom's own founders.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>Sela and Roswen met once more, three years later, at the opening of the Auldmire historical exhibition at the University of Calder. It was an evening event, wine and academic speeches, the Crown in a case at the room's centre behind a suppression field that kept its compulsion effects contained. Roswen attended for professional reasons. Sela attended as the restoration movement's official representative. They stood near the case and looked at the Crown together. "Do you think it works?" Sela asked. "The compulsion." "At close range, over time, yes," Roswen said. "Do you think it's working on you right now?" Sela considered this. "I genuinely can't tell," she said. "I still want what I want. But I couldn't tell you if that's me or the Crown or what I was raised to want or what I've come to genuinely believe." She was quiet for a moment. "I think that might just be what conviction feels like," she said. "From the inside." Roswen thought about this. She thought the Crown agreed, which was probably something she should note in her documentation.</p>`,
        ],
      },
    ],
  },

  // ── 19  Storm Riddle 20  [Sci-Fi / Romance]  Leo ──────────────────────────
  {
    description:
      "Atmospheric scientists Dex Irani and Orin Vael are deployed together on a research platform floating in the upper cloud layer of Janthos IV, a gas giant with storm systems that dwarf anything in the solar system. The mission is twelve months. They have met twice before. The storms are spectacular and relentless, and the platform is very small.",
    chapters: [
      {
        pages: [
          `<h2>Cold Wind</h2><p>The orientation briefing had not adequately conveyed the scale of the storms. Dex understood intellectually, from the data, that the smallest visible storm feature on Janthos IV was approximately the size of Earth's Pacific Ocean. Understanding it intellectually was different from sitting on a research platform ninety kilometres above the cloud deck and watching a storm front that had been continuous for six hundred years approach from the east at three hundred kilometres per hour. "It's going to go around us," Orin said, from the sensor console. "The platform's positioned in a stable pressure pocket." Dex looked at the approaching wall of amber cloud. "You sound confident," she said. "I'm not confident," Orin said pleasantly. "I'm hoping."</p><p>The storm went around them, as designed. The pressure fluctuations were significant enough to require three hours of stabiliser adjustment, during which Dex and Orin worked back-to-back in the cramped instrument bay and communicated in the shorthand of people who have trained on the same systems and understand each other's operational rhythm without needing to say much. This was the second time they had worked together — the first had been a three-week field campaign on Titan, which had been, if possible, even more claustrophobic, and from which Dex had returned with a project report and an awareness she had been trying to manage for eight months. Twelve months on a platform with a floor plan of approximately forty square metres, she thought, was going to require her to manage it considerably better.</p>`,
          `<h2>Cold Wind</h2><p>The platform's research mandate was ammonia cycle mapping — a long-term dataset project that required continuous sensor readings, routine calibration, and enough interpretive analysis to justify two scientists instead of one. In practice this meant that the actual scientific work occupied about five hours of each fourteen-hour work period, and the remainder was documentation, maintenance, and cohabitation. They divided the platform's space by function rather than by person, which worked well: the sensor bay, the analysis station, the galley, the exercise module. The two sleeping units were at opposite ends of the platform, which was the one concession to personal space that the platform's designers had incorporated and for which Dex found herself privately grateful.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The storm system they designated J-7 was their primary research target — a continuous system that had been observed from orbital platforms for eighty years and whose internal dynamics had never been measured at the cloud-deck level. J-7 was, by every measurement they made, more complex than the models predicted: it had internal sub-systems that interacted non-linearly, producing emergent patterns that neither of their pre-deployment simulations had captured. "It's thinking," Orin said once, watching the sub-system dynamics on the main display, and Dex had said "it's weather" and he had said "I know, but look at it," and she had looked at it and understood what he meant, which was that it had the quality of something that was doing what it was doing with intention, even though intention required consciousness and storms did not have consciousness, and yet.</p><p>They spent three weeks mapping J-7's internal structure in a level of detail that would not have been possible from orbital distance. The data was extraordinary. The science was going to produce a significant paper. In the evenings, when the data was running its automated processing, they sat in the observation bay and watched J-7 move through its patterns, and Dex thought that there were worse ways to spend twelve months than in a forty-square-metre room watching something enormous be itself with complete indifference to observation.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The shift happened, as shifts often did, incrementally and then suddenly. Three months in, Orin asked her what she had wanted to study before atmospheric science. She told him: ocean systems, actually — the same kind of pattern dynamics, different medium. He asked why she had switched. She told him: a professor who had shown her the Janthos IV storm data in her second year of graduate school and described it as the largest coherent weather system ever documented by humanity, and she had thought, sitting in that lecture theatre: I want to be closer to that. "And now you are," Orin said. "Now I am," she agreed. He was quiet for a moment. "I wanted to be a cartographer," he said. "But maps of known places felt small." She looked at the storm on the display. "Maps of unknown places," she said. He nodded. "Maps of unknown places."</p><p>They were doing the dinner cooking rotation — she cooked, he cleaned — when she realised she was not dreading the end of the mission in the way she had expected to. She examined this feeling carefully, as she examined all unexpected data. She arrived at an explanation she had been avoiding for the better part of three months. She stirred the sauce and did not immediately do anything about the explanation. She was not a person who immediately did things about explanations. She was a person who sat with them until they were unignorable, and this one was close.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Last Witness</h2><p>The mission's final month coincided with J-7's closest approach to their platform's pressure pocket — the storm's own ninety-year cycle bringing it to within forty kilometres of their position, close enough that the cloud features were individually visible without magnification, enormous billows of ammonia ice lit from below by the planet's internal heat. They ran continuous sensor sweeps and barely slept and produced more data in that final month than in the previous eleven combined. They were both running on stimulants and the specific focus of scientists in the presence of something genuinely new. At some point in the fourth night of the close approach, at 0300, Orin said: "I put in for the follow-on mission." Dex continued entering data for a moment. "So did I," she said. "I know," he said. "I checked, which was—" "Reasonable," she said. A pause. "Yes," he said. Another pause. "Dex." She set down her stylus. "I know," she said. "Me too."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Open Sea</h2><p>The follow-on mission was approved eight months after their return. The joint paper on J-7 had been received as the defining dataset on gas giant storm dynamics of the decade. The follow-on team was four scientists, the platform was larger, the mission was two years. They were assigned as co-principal investigators, which meant they had to be in the same room for every senior decision and each other's closest professional colleagues for the foreseeable future. "It could be worse," Orin said, reading the assignment details. "Yes," Dex agreed. "It could." They were very bad at saying the obvious thing out loud and both aware of this. It seemed, given the context, like something that could be worked on. J-7 was still out there, six hundred years old and not done, turning its enormous patient patterns through the amber sky of a planet that had no interest in human timelines and would outlast them all by a comfortable margin. They both found this comforting, which was one of the many things they had in common.</p>`,
        ],
      },
    ],
  },
];

// For books 20-39, we define abbreviated profiles.
// Each entry needs a description and chapters array with pages.
// These use the same structure as above but with compressed but distinct content.

const bookContentLibraryExt = [
  // 20: Moonfire Archive 21 – Mystery/Thriller – Sara [DRAFT]
  {
    description:
      "Corporate analyst Samir Okafor discovers falsified emissions data buried in his firm's audit trail. Before he can report it, he is framed for the fraud and forced to go underground, gathering evidence while staying ahead of the firm's private investigators.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>Samir found the discrepancy on a Thursday afternoon, four hours before his flight home. A column of atmospheric readings in the Q3 environmental report had been rounded — not to the nearest decimal, which was standard practice, but rounded consistently downward by a margin too regular to be accidental. He exported the raw file to a personal drive, closed the report, and went to catch his plane. By the time he landed, his building access card had been deactivated. By the time he reached his apartment, there were two men in a parked sedan outside who were not particularly well concealed.</p><p>He did not go up to the apartment. He went to a hotel three kilometres away, paid cash, and sat on the bed and tried to determine how quickly they could have moved, which told him something about how long they had known he would find it. The answer, when he worked through the audit trail access logs from memory, was: since Monday. They had flagged his session on Monday when he first opened the file. They had spent three days preparing before he even knew what he was looking at. He had four days of head start on the evidence and none on the situation.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The evidence he had exported was sufficient to open an investigation but insufficient to compel one — he needed corroboration, a second source that the firm could not claim was also contaminated by the framing. He spent two weeks making careful contact with former colleagues, using channels that required explanation but were worth explaining, and found that three of them had noticed the same anomaly in previous quarters and had been quietly reassigned before they could formalise their concerns. None of them were willing to go on record. He understood this. He was not willing either, yet. Yet was doing a lot of work in that sentence, and he knew it.</p>`,
        ],
      },
    ],
  },
  // 21: Glass Letters 22 – Romance/Historical – Leo [COMPLETED]
  {
    description:
      "Paris, 1943. Intelligence officer Nadia Reiss maintains a network of resistance contacts through coded correspondence that she runs from a bookshop that is also a library that is also, technically, a safehouse. Her contact in Lyon, known only as Henri, is meticulous, brave, and entirely theoretical until the night he walks through her door.",
    chapters: [
      {
        pages: [
          `<h2>Cold Wind</h2><p>The correspondence ran through three covers: a book recommendation service, an invoice system for a fictional printing company, and a direct letter chain that Nadia maintained with eleven contacts across France using a cipher built on the page numbers of a Victor Hugo novel. Henri's letters were the most technically careful: correct in every formal element, never a cipher error, never a detail that would mean anything to a German reader. He had been careful for nineteen months. She had been careful back. They had never addressed anything personal in print, because print was a liability and personal was a vulnerability. Nevertheless she had developed, over nineteen months of professional correspondence, what she recognised as an entirely inappropriate degree of interest in what he thought about things that had nothing to do with the war.</p><p>He arrived at 2230 on a Tuesday, which was correct tradecraft — she had listed Tuesday as an emergency contact window in a letter six weeks ago that she had assumed was theoretical. He was taller than she had imagined, which told her she had been imagining, which was a piece of self-knowledge she catalogued without showing it. He said: "Nadia Reiss?" in the voice she recognised from the quality of his written sentences: precise, slightly formal, the voice of someone who had decided how to be careful. "Yes," she said. "You're early." He looked around the empty bookshop. "I had some difficulty in Lyon," he said, which was understatement of a quality she had learned to measure correctly. She locked the door. "Tell me from the beginning," she said. "We have time."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>They worked together for six weeks before Lyon was safe enough for him to return, and in six weeks the theoretical became, inescapably, concrete. She had known his working method through his letters; she now knew the physical reality of it — the way he moved through a problem with the same precision as his cipher-work, methodical and unhurried and unwilling to guess where a fact was available. She found this, combined with everything else, complicated. He was aware that she found it complicated. He was, she determined, also finding the situation complicated, which he managed by being extremely professional in all formal interactions and extremely present in all others. She could not decide if this was better or worse than the alternative. She decided it was better. She decided this while he was reading a message by lamplight and not aware of being observed. She made a note in her personal log, in a different cipher from the operational one: <em>he reads the way he writes. completely.</em></p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>Lyon became safe. He went back. The letters resumed, and now they were different in a way that was not operationally relevant and entirely necessary. The professional elements remained correct. The other elements had acquired weight — the kind of weight that accumulates when two people know each other's working minds and have briefly shared a physical space and find the return to theoretical correspondence both easier and considerably harder than before. He never wrote anything that could compromise either of them. Neither did she. There were nineteen months of practice at saying the necessary things without saying the prohibited things. They were both very good at it. The gap between what was written and what was meant grew precisely as wide as the war required, and not one word wider, and they held it there until there was no longer a war to require it.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Last Witness</h2><p>The armistice found them both in Paris, by different routes, on the same evening — coincidence, or the logic of a network that had been routing toward the same centre for two years. They met at the bookshop. It was intact. Most things were not. She unlocked the door and he came in and they stood in the space that had been both cover and truth for the most complicated period of either of their lives. "There's a Hugo novel," he said, "whose page numbers I will never look at without—" "Yes," she said. "Same." A pause. They had spent two years learning to say the necessary thing without saying the prohibited thing. The prohibition was over. It took them a moment to adjust. "I would like," he said carefully, "to have a conversation that is not encoded." She looked at him. "So would I," she said. "Where do you want to start?" He thought about it. "Tell me something I couldn't have found in the letters," he said. She thought about it. She told him. He listened, the way he listened to everything — completely. It was a good place to start.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Open Sea</h2><p>They were married in 1947. He became a translator; she returned to librarianship in an official capacity, which she found both familiar and very strange. They maintained the Hugo cipher for personal correspondence when they were in different cities, not for security but for habit, and because some things had been said in that language first and were most legible there. The books that had served as their cover were still on the shelves. She kept the specific copy of Hugo — <em>Les Misérables</em>, 1887 edition, its spine worn smooth by two years of operational use — on the desk rather than the shelf, not as a memorial but as a fixture. A thing that had been useful and remained present. He understood this without needing it explained. He always had.</p>`,
        ],
      },
    ],
  },
  // 22: Iron Voyage 23 – Thriller/Fantasy – Sara
  {
    description:
      "Treasure hunter Ysel Mora races the warlord Brekkan across the Westmere to reach the sunken city of Calthorn before Brekkan can claim the Tidal Engine — a pre-Compact device that can control sea levels across an entire coastline. The race becomes a survival situation when Brekkan decides he no longer wants a race.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The charts for Calthorn's location had been in private collection for a century and a half, acquired by Ysel through a transaction she was not going to describe in any document that might be read by the Collector's Guild. She had verified them against three independent historical sources and was confident in the coordinates: sixty metres below the Westmere surface, at the junction of two geological fault lines that had been deliberately chosen by Calthorn's engineers for the Tidal Engine's installation. The Engine was theoretically inert — its power source had been removed, according to the pre-Compact records. Theoretically was doing considerable work in that assessment, and she knew it. She had chartered a dive vessel and filed a standard survey declaration and was two hours from the Calthorn position when she spotted Brekkan's ship behind her, running without lights.</p><p>Brekkan had the resources of a minor warlord and the operational philosophy of someone who had decided that other people's research was only valuable up to the point where they needed the other person to be present. He had been following her work for two years. He had tried to buy her charts three times. He had sent a man to her workshop in Keldrath, which had not ended well for the man, and had apparently concluded that direct pursuit was more efficient. She altered course and ran the numbers on how much time she had before he caught her. The numbers were not encouraging.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>She reached the Calthorn position with forty minutes to spare and went over the side with her dive equipment before Brekkan's ship was within hailing distance. Sixty metres in the Westmere was at the edge of her comfortable range. Calthorn was not beautiful — the city's structures had collapsed into silt-covered rubble over four centuries — but the Engine's housing was intact, a dome of engineered stone that had been built to survive the deliberate sinking of the city around it. She found the access panel and knew immediately that the records were wrong: the power source had not been removed. It had been reduced to a maintenance cycle, drawing minimal power from the geological fault beneath it. The Engine was not inert. It was sleeping.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>She surfaced to find Brekkan's crew on her dive vessel, which she had expected, and Brekkan himself waiting at the dive ladder, which she had also expected. "You found it," he said. Not a question. "The Engine is active," she said. He showed no reaction. "I know," he said. "I've known for eighteen months. That's why I need someone who can operate a pre-Compact device." She considered this. "You need an operator." "A knowledgeable operator," he said. "Not a captive one." He paused. "I am prepared to offer you a significant percentage of the Engine's commercial value. Which is substantial." She looked at him carefully. The offer was real — she could hear it. So was the implied alternative. "Define substantial," she said. "And define what you intend to do with a device that can alter coastal sea levels." He told her. She spent thirty seconds weighing the answer. "I'll need that in writing," she said. "Before I go back down."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The written agreement was the trap, as she had intended. She had no legal standing to enforce it and no illusions about Brekkan's intentions once he had what he needed, but the process of negotiating the terms gave her forty minutes during which she identified three members of his crew who were not comfortable with the operation, planted a location beacon in the Engine housing, and established that the Engine's maintenance cycle could be interrupted in a way that would make it permanently inert within six hours if the access panel was correctly configured. She configured the access panel correctly. Then she signed the agreement. "I'll need two days to map the control interface," she told him. "Standard pre-Compact interface analysis." He agreed. She had no intention of being on his ship in two days, and the beacon would reach a Collector's Guild emergency relay in about eighteen hours. She began the dive.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The Guild response team was a frigate and sixteen officers, which was more than she had expected and exactly what the situation required. Brekkan's ship was in custody by the time she surfaced from her second dive. The Engine's shutdown process was documented in the Guild's archive as a classified recovery operation. Ysel received a finder's commission that was half what the written agreement with Brekkan had specified and considerably more than she would have received from Brekkan's intended disbursement, which, per the crew member testimony, had been approximately nothing. The Engine was sealed in its dome and the site was classified restricted access. She filed her charts with the Guild archive, minus the three most important navigational details, which she kept in a private cipher in case she ever needed to return. She almost certainly would not. She went home and slept for two days.</p>`,
        ],
      },
    ],
  },
  // 23: Silent Oath 24 – Historical/Sci-Fi – Leo
  {
    description:
      "Tokyo, 1903. Physicist Dr. Hiroshi Tanaka receives a transmission from 2071 on an experimental radio apparatus, sent by a future research team attempting to share fifty years of scientific progress before a catastrophic data loss event. He has six months to understand and preserve as much as possible.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The apparatus had been built to receive ultra-long-wave transmissions from the naval stations being established along the Pacific coast. What it received instead, on the evening of March 14th, was a structured signal in a carrier format that did not correspond to any transmission system Hiroshi had documented. He spent four hours eliminating sources before concluding that the signal was not interference and was not naval. It was regular, complex, and repeating on a forty-minute cycle. He was not sleeping when he arrived at the hypothesis that made his hands shake slightly: the carrier format was characteristic of a compressed data transmission, and the compression algorithm, when he spent a week reconstructing it, was based on mathematical principles he had published the theoretical groundwork for two months ago, in a paper that was currently in press and had not yet been distributed to any institution outside Japan.</p><p>He told no one. He built a decoding apparatus and began working through the transmission's content layer by layer, and what emerged, over six weeks of sixteen-hour days, was a curriculum — a structured presentation of physical theory, beginning at the level he currently understood and moving systematically into territory that required him to rebuild his entire conceptual framework before he could follow it. Someone had designed this specifically for him. Someone who knew exactly where he was and where he needed to go next.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The transmission's fifth layer contained a direct message, which arrived after he had demonstrated sufficient comprehension of the preceding content through a mechanism he still did not entirely understand — the transmission paused and resumed based on some response signal his apparatus was generating without his explicit instruction. The message was in Japanese, which was not surprising but which was somehow more alarming than the physics. It said: <em>You have progressed further than the previous attempt. The event we are trying to prevent will occur in 2071 and will destroy approximately sixty years of physical research records globally. We are sending the most critical elements to five recipients in the early twentieth century. You are the most advanced of the five. We need you to publish, to teach, and to establish the ideas in the academic record before your own death. You have approximately forty years. We are sorry for the pressure. Please continue.</em></p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>He took three days to decide what to do, which he spent hiking in the hills outside the city because he did his best thinking on foot. The decision he arrived at was the only one available to him: he would do what they asked, as carefully as he could, using the judgment he had developed in forty-two years of research. He would publish what he could publish now, establish what he could establish through normal channels, and find ways to preserve the more advanced material that could not be published immediately without appearing incomprehensible. He began that week. He taught for thirty-eight more years. His students described him as the most demanding teacher they had encountered and the most generous, and as someone who always seemed to know, years in advance, what questions were worth pursuing. He never explained this. He simply directed people toward the right problems and waited, with the patience of someone who had been told the endpoint, for them to arrive.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>He died in 1941, having published thirty-seven papers and supervised ninety-two doctoral students, eleven of whom went on to work that shaped the post-war development of physics in ways that were foundational and that were, consistently, built on theoretical groundwork that could be traced back, through citation chains, to Hiroshi's early work. The transmission had stopped in 1931, the apparatus worn beyond repair. By then he had received and processed approximately 40% of its content. He had estimated this was sufficient. He had also estimated that the remaining 60% would be rediscovered independently within two generations, because the questions he had pointed his students toward were the right questions, and good questions, once properly asked, tend to get answered.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>In 2071, the data loss event occurred — a cascade failure in global digital preservation infrastructure that destroyed approximately sixty years of research archives. The loss was significant. It was not catastrophic. A recovery team assembled in the aftermath found that the most critical theoretical frameworks had survived in physical archives, in published papers, in teaching lineages that had kept ideas alive through human transmission rather than digital storage. The recovery team's archivist, tracing the survival patterns, found they converged on a Japanese physicist who had died in 1941 and whose students and students' students had, apparently, been unusually thorough about preserving both data and understanding. She wrote in her report: <em>The lineage appears to have been managed with foreknowledge of exactly what would need to survive. Source unknown. Outcome: sufficient.</em> She did not speculate further. The evidence did not support speculation. It supported gratitude, which she also did not write in the report, but felt.</p>`,
        ],
      },
    ],
  },
  // 24: Golden Signal 25 – Fantasy/Mystery – Sara
  {
    description:
      "Investigator Pren Dalt is called to the city of Caldhaven when a golden sigil begins appearing on doors the night before murders — always a different mark, always on the correct door, always too precise to be coincidental. Someone in Caldhaven knows who is going to die. The question is whether they are preventing it or causing it.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The first sigil appeared on a baker's door, the baker died the next morning of what appeared to be a fall, and the death was investigated as accidental and closed. The second sigil appeared on a moneylender's door, the moneylender died the next morning of a seizure, and the death was investigated as natural and closed. The third sigil appeared on a city guard's door, the guard died the next morning in an altercation with a suspect, and the death was investigated as line of duty and closed. It was the city's record-keeper, cross-referencing unrelated reports for an annual summary, who noticed the sigils and brought them to Pren Dalt, who read the three reports and then went and looked at the three doors, which had been repainted but still showed the marks under a detection lamp at the right angle. The marks were different on each door. The marks were in the same hand. The same very steady, very precise hand.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The fourth sigil appeared while Pren was investigating the third. He found it himself, at 0600, on the door of a physician named Caswell who lived in the merchant quarter and who, when Pren knocked, answered the door in full breakfast mode and received the information that there was a death-associated sigil on her doorframe with the calm of someone who had been expecting a difficult conversation and was relieved to have it begin. "I know," she said. "Come in." She had known for two days, she explained over tea. She had not reported it because she had been trying to determine who would believe her, and also because she wanted to live out those two days in peace. Pren put down his tea. "You're not frightened," he said. "Of course I'm frightened," she said. "But I've also been treating a patient who I believe is the person marking these doors, and I think I understand why, and I think it changes the picture considerably."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>The patient was a child named Reth, eleven years old, who had been brought to Caswell six months ago by a grandmother who described him as having prophetic episodes — specific, accurate, verifiable predictions of death, delivered without apparent distress and without any understanding of their significance. The sigils were not warnings from a killer. They were Reth's attempt to notify the city that he had seen something coming, using the only language that felt appropriate to him: mark the door, tell someone, hope they could change it. He had not yet understood that he could speak. He had not yet understood that anyone would listen.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The physician was not one of his predictions. He had marked her door, she explained, because he had predicted her death and had also predicted that she would not die, and he had not known how to reconcile those two things. He had marked the door and then come to tell her, which was the first time he had tried to communicate verbally about a vision. They had been having conversations ever since. "He can see probable deaths," Caswell told Pren. "Not certain ones. The baker, the moneylender, the guard — he saw them as highly probable. He could not see a path where they didn't happen. He doesn't know yet that there is always another path. I'm teaching him." Pren sat with this. "And the people who died. Were they murdered?" She was quiet for a moment. "I believe so," she said. "By someone who knows about Reth. Someone who is using his predictions as a schedule."</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The someone was a city official who had been managing an information source for eight months — a source he had found through the grandmother's payment records at a local pharmacy that sold a compound used to manage Reth's episodes. He had been hiring killers based on the child's visions, eliminating people whose deaths Reth had predicted as highly probable, and covering it with the natural and accidental cause of death pattern. It was elegant and it was monstrous and it collapsed entirely when Reth, who had been quietly learning to talk about what he saw, told Pren the next three names without being asked. Two of the three were still alive. They remained alive. The official's arrest was quiet and the documentation of the case was careful and Reth was moved with his grandmother to a different city, to a different life, to a situation where his gift was studied rather than used. He made good progress, Caswell reported, in learning that almost everything he saw as inevitable had, on examination, a different path available. He was eleven. He had time to learn it properly.</p>`,
        ],
      },
    ],
  },
  // 25: Winter Bridge 26 – Sci-Fi/Romance – Leo [DRAFT]
  {
    description:
      "Glaciologists Nils Andersen and Vera Kask are the two-person crew of Arctic Relay Station Boreas, monitoring climate data in the Norwegian high Arctic for a fourteen-month posting. The station is comfortable, the science is important, and it is dark for four months.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The station's psychological preparation guidelines recommended developing a personal project for the polar night period. Nils had planned to learn to play the theremin, which he had brought in kit form and which proved considerably harder to assemble than the packaging implied. Vera had planned to write a book about fjord ecology, which she was making good progress on. By the time the sun went down in late October and did not come back, Nils had a partially assembled theremin and a growing appreciation for Vera's book, which she read aloud to him in the evenings while he tried to calibrate the theremin's oscillators. He was not making good progress on the theremin. The evenings were very good.</p><p>The science was also good. The relay station monitored ice thickness, atmospheric composition, and ocean temperature at twelve automated sites across the Barents Sea, and required two scientists to maintain the data integrity and perform the quarterly manual sampling runs, which involved venturing out onto the sea ice in temperatures that reframed Nils's entire relationship with the concept of cold. He had worked in sub-zero conditions before. He had not worked in conditions where the sea ice groaned beneath him at irregular intervals while he drilled core samples and Vera, twenty metres away, narrated her fjord book into a voice recorder between core samples as a method of staying focused. He found this methodological choice somewhat alarming and completely characteristic.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The theremin was eventually assembled in November. Nils's playing could charitably be described as atmospheric. Vera said it sounded like a whale experiencing existential difficulty, which he felt was accurate but not entirely fair given that he had been playing for three weeks. She did not ask him to stop. He interpreted this as either tolerance or genuine enjoyment of atmospheric whale sounds, and in either case was grateful. She had moved her writing desk into the common area in week six, ostensibly for better light from the monitoring screens and in practice making the common area a shared workspace where they both worked in the same room for most of the day, which neither of them had planned and neither of them had adjusted back from.</p>`,
        ],
      },
    ],
  },
  // 26: Shadow Code 27 – Mystery/Thriller – Sara
  {
    description:
      "Cryptographer Petra Solm follows a murder victim's digital trail and finds it leads to a government black site — a facility that officially does not exist and that her own security clearance does not cover. She has found the thread. Pulling it will expose either a major intelligence operation or a major crime, possibly both.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The victim was a freelance algorithm auditor who had been working on a contract she could not have legally disclosed, given that her phone's encrypted drive, opened by the forensics team with a court order, contained a non-disclosure agreement with a government agency listed only by a four-digit identifier that did not match any publicly registered classification code. The digital trail she had left — intentionally, Petra thought, given its clarity — ran through four proxy servers and terminated at a physical address in an industrial district that, when Petra visited, turned out to be a functioning warehouse with legitimate registration and a basement level that was not on the building permits.</p><p>She did not go into the basement. She photographed the exterior, noted the security configuration, and ran the building's registration history. The building had changed hands eleven times in twenty years through a series of shell companies that each dissolved immediately after the transfer. The current registered owner was a real estate management company with no other properties and one listed employee who had died four years ago. Petra looked at the basement entrance and thought about the NDA's agency code and the eleven shell company transfers and the dead auditor's very deliberate trail. Someone wanted this found. The question was by whom, and why now.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>She found the answer in the NDA itself, specifically in the modification clause that had been added — she believed after the original signature — in a slightly different font size. The modification extended the NDA's scope to cover <em>secondary observations made in the course of contracted work</em>, which was unusual and which, in the context of an algorithm auditor's work, meant whatever she had found that she hadn't been hired to find. She had been hired to audit a data retention system. She had apparently found something in the data that was not part of the retention parameters. And someone had tried to retroactively classify her discovery under the original NDA, and she had apparently not accepted this, and she was now dead.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>The data system she had audited processed communications for seventeen government departments. A retention audit meant she had seen everything that was being kept and, more importantly, everything that was being deleted — the gaps in the archive, the scheduled purges, the patterns of absence. If you knew what was being deleted and when, you could infer what was being hidden. Petra spent three days building the deletion pattern from the system's public-facing maintenance logs and arrived at a structure that told her: something was being purged on a monthly cycle from three specific departments, always within forty-eight hours of a particular security committee meeting, for at least four years. She did not know what the something was. She knew its shape and its timing and the committee that preceded it. She requested the committee's public attendance records. The records were clean and complete and entirely uninformative. She went to find someone who had attended the committee and left.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The former committee member was a retired senior civil servant who met her in a public garden and listened to her evidence summary with the expression of someone hearing a confirmed suspicion. "She found the signals programme," he said. Not a question. "There's a signals programme," Petra said. "Yes," he said. "There has been for six years. It is technically legal under a secondary interpretation of the surveillance act that has never been tested in court. Several of us on the committee disagreed with the interpretation. Several of us resigned. The others chose different strategies." He looked at the garden around them. "The auditor who found it — she was supposed to report it to me. That was the arrangement. She was our mechanism." He paused. "She didn't get the chance." Petra thought about the deliberate digital trail. "She left you a different mechanism," she said. "She left it for whoever was competent enough to follow it." He looked at her. "Are you competent enough to finish it?" She thought about the basement she hadn't gone into. "I will be," she said.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The programme was brought to a parliamentary committee through the retired civil servant's remaining contacts, using Petra's documentation as the evidential foundation. The process was slow, procedurally complex, and entirely proper, which was the former committee member's consistent requirement — nothing that could be dismissed as improper or politically motivated, nothing that gave the programme's defenders a procedural objection. It took eleven months. The programme was suspended pending independent review. The modification clause in the NDA was found to have been added without the auditor's knowledge or consent, which reframed her death as something the prosecutors were better positioned than Petra to pursue. She gave her full testimony and went back to her own work, which was cryptographic analysis and which was, she found, somewhat less eventful than the previous year. She did not mind this.</p>`,
        ],
      },
    ],
  },
  // 27: Echo Harbor 28 – Romance/Historical – Leo [COMPLETED]
  {
    description:
      "Scotland, 1851. Lighthouse keeper Maren Oss has managed the Ardvreck light alone for three years when the cargo ship Callum's Pride runs aground in a storm she had warned the harbour board about six weeks prior. Its captain, Callum Brice, survives. He spends six weeks at the lighthouse while the ship is repaired, disagreeing with her about everything except the sea.",
    chapters: [
      {
        pages: [
          `<h2>Cold Wind</h2><p>She found him on the rocks at low tide, which was fortuitous timing since three hours later the rocks would have been under two metres of water. He was conscious and furious, which she found reassuring from a medical standpoint. She helped him up to the lighthouse and into the keeper's room, where she assessed his injuries — three broken ribs, significant bruising, a gash on his forearm that needed stitching — and performed the necessary treatments while he informed her, in careful detail, that the storm had not been as severe as forecast and that the grounding was a result of chart discrepancies for which he intended to hold the harbour board responsible. Maren, who had submitted a forecast revision to the harbour board six weeks ago that described the storm precisely and recommended all coastal traffic stand down for that period, stitched the gash and said nothing about this for a full day.</p><p>On the second day, she showed him the submission. He read it. He was quiet for a long moment. "They didn't circulate this," he said. "They did not," she agreed. He set the document down. "I owe you an apology," he said, with the manner of someone who apologises correctly when they are wrong and does not make it larger than necessary. "Yes," she said. "Tea?"</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The ship's repair took six weeks, which was longer than expected due to the specific nature of the damage and the limited availability of materials on that part of the coast. Callum spent the first week in the keeper's room, the second week mobile but confined to the lighthouse, and the subsequent four weeks helping with the lighthouse maintenance, which he approached with the systematic enthusiasm of someone who found structured practical work congenial and who had not, it emerged, had much occasion for it in recent years. He was a capable sailor and a reasonable carpenter and a poor cook, which Maren demonstrated to him gently over a series of meals. He received the demonstrations with good humour and improved more than she had expected.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>They disagreed about the sea — its personality, its intentions, whether it had any. Maren held that the sea was exactly itself and had no position on the people who used it; Callum maintained that the sea was fundamentally hostile and that good seamanship was the management of an adversary. They held these positions with conviction and argued them at length and arrived at the following compromise: she was right about the sea's indifference, and he was right that indifference, at scale, was equivalent to hostility and required the same response. She thought this was a reasonable synthesis. He thought it was a capitulation disguised as agreement. She felt this was a distinction without a practical difference. They agreed to disagree about the agreement, which felt accurate.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Last Witness</h2><p>He left when the Callum's Pride was seaworthy. He came back three weeks later on a different ship, which required some planning, and proposed. She told him she had no intention of leaving the lighthouse. He said he had no expectation that she would and had been in correspondence with the Northern Lighthouse Board about the possibility of a posting modification. She looked at him. "You wrote to the Board," she said. "I wrote to the Board," he said. "They were open to discussion." This was, in her estimation, the most practical declaration she had ever heard and possibly the most accurate measure of someone's intentions she had ever been offered. She said yes. He came back in April. The harbour board eventually circulated her storm forecast revisions. Not immediately, and not voluntarily, but eventually.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Open Sea</h2><p>The lighthouse posting ran for another eleven years, during which Callum was at sea for approximately eight months of each year and at Ardvreck for the remaining four, which suited both of them in the way arrangements suit people who have thought carefully about what they actually need rather than what convention recommends. The light was maintained without interruption. The harbour board received all her forecast revisions on the same day she submitted them, following a formal agreement reached in 1853 after a second preventable grounding that she had also predicted. She did not say anything about this either. She had made her position clear in 1851 and it remained clear. The light burned on schedule. The sea was exactly itself. Everything was as it should be.</p>`,
        ],
      },
    ],
  },
  // 28: Scarlet Crown 29 – Thriller/Fantasy – Sara [DRAFT]
  {
    description:
      "Thief Alick Soren specialises in magical artefact recovery — politely, in person, from collections that don't own what they think they own. He is framed for a murder that happened at a vault he was definitely robbing at the time, which creates an alibi problem of a very specific kind.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The vault at Meridian House contained seven items Alick had been contracted to recover by their legitimate previous owners, and he had been in the process of recovering the fourth when the body was found two floors above him — a discovery announced by the sound of a constable's whistle, which he knew would mean the house sealed within four minutes. He replaced the fourth item, which he had not yet completed the recovery of, and exited the vault, crossed the garden, and was three streets away when the house's perimeter alarm triggered. He had not set off the alarm. Someone else had, after him, which meant someone else had been in the house.</p><p>The murder victim was the house's steward, who had no connection to any of the seven recovery contracts and who had, according to the constable's initial report, been killed with a method consistent with an arcane binding technique Alick was publicly known to use. He read the report in a contact's safe house and thought: someone planned this. Someone knew he would be in the house, knew his professional method, and timed the murder for his presence. The question was whether they wanted him arrested — which would stop the recovery operation — or whether they wanted him blamed — which would require him to keep moving and, specifically, keep working.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>He kept working, which he suspected was the answer to the question. The seven recovery contracts were connected — all seven items had passed through the same intermediary sale process, all seven had been laundered through a Meridian House account, and the steward had managed that account. Someone was clearing the chain. If all seven items were recovered and the steward was dead, the only remaining link was Alick, who was now conveniently in the constabulary's sightlines and would be too busy staying free to complete the recoveries. He sat with this architecture and found it clever and found it annoying and went to find his framing party, because the best way to clear an alibi problem of this specific kind was to produce the person who had created it.</p>`,
        ],
      },
    ],
  },
  // 29: Storm Riddle 30 – Historical/Sci-Fi – Leo
  {
    description:
      "The Mongol Empire, 1220. Cartographer Temür has been mapping the empire's western territories for three years when he finds a region that refuses to be mapped — terrain that appears differently on consecutive surveys, paths that exist in the morning and not in the evening, a valley that his instruments confirm is present and his eyes consistently fail to locate.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The first anomaly was a river that appeared on two consecutive morning surveys and was not present on any evening survey conducted in the same location. Temür had been doing this work for too long to dismiss instrument error; he had verified the river's presence with three different measurement techniques on three different mornings, and on three different evenings stood at the same coordinates and watched dry land. He noted the anomaly with the precision he applied to all observations and moved to the next survey point. He returned the following week and the river was present in the morning. He sat beside it for four hours, taking measurements, and then watched it fade — not dry up, not flow elsewhere, simply become less present, incrementally, until it was not there. He wrote in his log: <em>Temporal displacement of geographic feature. Mechanism unknown. Frequency: daily. Recommend further investigation before mapping.</em></p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>The valley took him another two weeks to find. It was not on any map — his own or the local knowledge of the people who had lived in the region for generations, who knew about the river's behaviour and regarded it with the respectful disinterest that communities develop for phenomena that are consistent and not immediately dangerous. The valley appeared in his instrument readings as a geographic depression of approximately four kilometres by two, situated between two identified hills. His eyes showed him the hills and a plain between them. He walked toward the plain and walked into the valley, which appeared as he entered it and remained present while he was inside it, and through which he spent six hours moving with instruments and measurements, finding at its centre a structure of stone and metal that was not pre-Mongol, was not Chinese, was not any architectural tradition he had documentation for, and that responded to his instruments by generating readings he had never encountered and could not classify. He sat in front of the structure and thought about what responsible cartography required of a person in this situation. He concluded it required him to stay longer.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>He stayed for a month, mapping everything he could map and documenting everything he could document. The structure appeared to be a relay — something that received, processed, and transmitted information using a medium he could not identify but whose effects he could measure: the temporal displacement of geographic features, the selective appearance and disappearance of terrain. Someone had built a machine for making certain things present in certain times and had placed it in a valley in the western territories and left it running. The structure's operational logs — he found the interface eventually, by methodical testing — showed continuous operation for approximately eight hundred years. It was not Mongol. It was not anything.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>He mapped the valley precisely, with the structure at its centre, and created two sets of maps: one that showed the valley and one that did not. The one that showed it went into a personal archive he left with his brother in Karakorum with instructions to preserve it through whatever succession followed the current Khan. The one that did not went into the official survey record. He made this decision because the structure was functional and appeared stable and he had found no mechanism by which he could safely shut it down, and a functional device of unknown purpose in an unstable political environment was a resource that would be fought over and probably damaged. He could not make it safe to find. He could make it safe by not finding it. He went back to his maps and continued west.</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The personal archive survived four successions and seventeen generations and was rediscovered in 2003 by an archaeologist working through a collection of Mongolian manuscripts acquired by a European library in the nineteenth century. The valley was still there. The structure was still operational. The temporal displacement of regional geography was still occurring on a daily cycle, documented by satellite imaging as a recurring anomaly that the relevant geological agencies had been noting with confusion for fifty years. The archaeologist published a paper on the manuscript. The geological agencies published a paper on the anomaly. Neither party initially connected them. The connection was made in 2017 by a graduate student writing a thesis on medieval cartographic methodology, who noticed that the coordinates in Temür's personal archive matched the anomaly zone precisely and sent a joint email to both research groups. The response was significant.</p>`,
        ],
      },
    ],
  },
  // 30: Moonfire Archive 31 – Fantasy/Mystery – Sara
  {
    description:
      "Junior archivist Cael Wren discovers a hidden chamber in the Grand Archive of Veldrath that predecessor Lyra Ashveil never documented — and inside it, a second set of compact records suggesting that the agreement Lyra made with Seravine was not the only such agreement in the Archive's history.",
    chapters: [
      {
        pages: [
          `<h2>First Light</h2><p>The renovation of the Archive's east wing turned up a sealed door on the fourth floor that was not on any floor plan before 1820. The door's lock was a moonfire crystal housing — old, the same pre-Compact style as the ones in the restricted annex — and it responded to Cael's standard warden key with the distinct reluctance of something that had been very specifically keyed to someone else. He spent two days working the lock through legal channels, getting clearance from three levels of archival authority, and opened it on a Thursday afternoon to find a room that had been actively maintained: dusted, the crystal lattices charged, the reading chair worn smooth. Someone had been using this room recently. There was no access record in any log.</p><p>The room's shelves held records in a hand he eventually matched to former Senior Archivist Holt, who had died eight years ago and whose personal papers had been donated to the archive's biographical collection. He was reasonably sure Holt had not been entering the archive posthumously. He was less sure about the other possibility, which was that whoever had made the agreement before Lyra had made it with Holt had been here recently. He found the compact records on the bottom shelf, wrapped in velvet, and read them sitting in Holt's chair, and understood that there had been an archivist before Seravine, and an archivist before that, and a line of keepers going back further than the Archive's official founding date by approximately two centuries.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Broken Compass</h2><p>He brought his findings to the current Head Archivist, who listened without visible surprise and then confirmed what Cael had suspected: the compact line was known at the senior level. It had always been known. The institution maintained continuity of knowledge the way all institutions maintain their most sensitive continuities — through careful selection, careful transmission, and the decision about who needed to know and when. Cael had found the room independently, which meant either the selection process had anticipated him or he had moved faster than expected. The Head Archivist looked at him for a long moment. "Lyra Ashveil found the room in her third month," she said. "You found it in your fifth. I was expecting you around month eight." Cael thought about this. "You were waiting," he said. "Yes," she said. "We always wait for people to find their own way in. It's a better test of whether they're ready than anything we could design."</p>`,
        ],
      },
      {
        pages: [
          `<h2>Cold Wind</h2><p>He met Seravine the following week, in the sub-basement, which was nothing like he had expected and exactly like what the compact records had described. The shadow in the corner. The drop in temperature. The voice like pages turning. She looked at him — or the shadow moved in a way that corresponded to looking — and said: "You read the earlier compacts." "Yes," he said. "Do you have questions?" "Several," he said. She settled into something like stillness. "Good," she said. "The previous keepers asked fewer questions than I would have preferred. I have found it easier to work with people who ask questions." He thought about Lyra Ashveil, who had found the room in her third month and spent three decades in the archive and had, by all accounts, asked a great many questions. He thought he understood now why the Head Archivist had smiled when she said Lyra's name.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The earlier compacts revealed three things Lyra's version had not contained: the location of two other entities beneath other great libraries, as Seravine had mentioned in Lyra's era; the identity of the pre-Seravine original keeper, who had not died but had undergone a voluntary transformation into a form he had not fully described but that the records suggested bore some resemblance to Seravine's current state; and the nature of the Hollow, which was not an entity in the conventional sense but a residual cognitive pattern from the original construction of the Archive's foundations, a kind of ambient intention that required regular input to remain stable. Cael read this last fact three times and then went upstairs and found the current Head Archivist and said: "The Hollow isn't a contained threat. It's infrastructure." She looked at him. "Yes," she said. "It always has been. We are very glad you found that room."</p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The compact Cael eventually signed was the seventh in the Archive's history. He signed it in the sub-basement, with Seravine as witness, on a Thursday evening that was otherwise entirely unremarkable. He felt the weight of six previous signatures in the phrasing — each generation had amended slightly, added what they had learned, left space for what came next. He added two amendments of his own: a clause requiring documentation of the Hollow's input requirements on a quarterly basis, which no previous compact had formalised, and a clause requiring that the compact's existence be disclosed to any archivist who independently located the sealed room, rather than waiting for them to reach month eight. Seravine read both amendments. "Holt suggested the first one," she said. "I told him it was unnecessary." A pause. "I was wrong." She looked at the second amendment. "This will make selection harder." "Selection should be hard," Cael said. "But discovery shouldn't require luck." She considered this for a long time. Then she signed.</p>`,
        ],
      },
    ],
  },
  // 31: Glass Letters 32 – Sci-Fi/Romance – Leo
  {
    description:
      "Sixty years after Mira Coen's correspondence with Tomás, her granddaughter Sera Coen joins the Perseverance's communications team and finds, in the archive's protected files, the original transmission logs and a resonance window that her grandmother noted but never opened.",
    chapters: [
      {
        pages: [
          `<h2>Cold Wind</h2><p>The archive file was labelled <em>Coen Personal — Do Not Access Without Family Consent</em>, which was not a standard designation and which had apparently prevented anyone from accessing it for sixty years despite being a very mild prohibition. Sera Coen opened it on her third day as a communications officer, with her own family consent, and found three hundred and fourteen messages between her grandmother and someone named Tomás, and at the end of the message archive, a final entry that was not a message but a notation: <em>Resonance window identified at eighteen-month interval. Recalibration possible. Did not open. Left coordinates. For whoever comes next, if they want to.</em></p><p>Sera read all three hundred and fourteen messages. It took two days, mostly at night, mostly in the same communications bay where her grandmother had sat at 0300 and listened to a voice in the static sixty years ago. The messages were extraordinary — not because of the cross-timeline mechanics, which were remarkable, but because of the people in them, who were specific and careful and clearly in the process of falling in love with great precision and not quite saying so and then saying so in different words and then eventually saying so. She read the last message from Tomás, which said something about finding what he was looking for and being grateful it was not what he had expected. She looked at the resonance coordinates. She opened the calibration interface. She began.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Hidden Room</h2><p>The resonance window opened on her fourth attempt at calibration, sixty-three years after her grandmother had identified it. The signal on the other end was not Tomás — he would have been in his late eighties, if the timeline divergence had proceeded at the rate her grandmother's calculations suggested. The signal was a younger voice, speaking the extinct Brazilian Portuguese dialect, saying: <em>My grandfather said someone might call on this frequency. He said to answer if they did. He said to say that the machine still works. He built it to last.</em> Sera sat in the communications bay and felt sixty-three years of a family story close a loop. "Tell him," she said, and then stopped. "Tell him his machine is extraordinary," she said. "And that she found what she was looking for too. My grandmother. She wanted him to know." A pause. Then: <em>He knew,</em> the voice said. <em>He always said so. He was very certain about it.</em></p>`,
        ],
      },
      {
        pages: [
          `<h2>False Trail</h2><p>The correspondence that followed was different from her grandmother's — she was talking to Tomás's grandson, Emilio, who had grown up with the story and who approached the reconnection with both technical precision (he had studied the resonance mechanics in detail) and a kind of familial warmth that made the conversation feel immediately less strange than it should have. They were strangers across a probability gap, with a shared history they had inherited rather than created. They spent the first month exchanging what they each knew. They spent the second month exchanging what they each thought about what they knew. They spent the third month, Sera reflected, exchanging what they were actually interested in talking about, which had less and less to do with the resonance mechanics and more to do with everything else. Her grandmother, she thought, would have found this perfectly predictable. She would have been right.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Last Witness</h2><p>The window stayed open. The calibration Emilio and Sera developed together was more stable than the original because they had sixty years of resonance decay data to work from and two trained engineers working simultaneously from both ends. The transmission quality improved. The correspondence deepened in the way correspondences deepen when both parties have decided they are committed to honesty and are technically capable of maintaining it. Sera submitted a formal research report on the resonance technology to the Perseverance's science division and attributed the theoretical groundwork to Dr. Mira Coen and an unnamed collaborator in a divergent timeline, which raised significant questions in the science division that she was prepared to answer. She was not prepared for the science division's response, which was immediate and enthusiastic and resulted in the formation of a dedicated research team, which required her to brief them on everything, which required Emilio to brief his equivalent research community on his end, which resulted in the first formally organised cross-timeline scientific collaboration in documented history. Her grandmother had built this from a voice in the static and some borrowed instruments. Sera thought about this when the scale of what was happening occasionally felt overwhelming. She found it stabilising.</p>`,
        ],
      },
      {
        pages: [
          `<h2>Open Sea</h2><p>The Perseverance's seventy-first year of transit was documented in the ship's history as the year of the second contact and the beginning of the Coen Collaboration, named not by Sera but by the science historians who came later. What the ship's history did not document, because it was not the kind of thing that went in ship's histories, was what Sera said to Emilio on the evening the collaboration was formally announced, via the resonance channel at 0300 when everyone else was asleep: "I keep thinking about how she didn't open the window. She found it and she left it for whoever came next." A pause. Then Emilio said: "She knew the right person would find it." Sera looked at the dark outside the communications bay port. "She didn't know it would be this," she said. "No," he said. "She knew it would be good." And Sera, who had read all three hundred and fourteen messages and knew what her grandmother had found in a voice in the static sixty years ago, thought that was exactly right.</p>`,
        ],
      },
    ],
  },
];

const allBookContent = [...bookContentLibrary, ...bookContentLibraryExt];

const genrePairsByBookIndex = [
  ["Fantasy", "Mystery"],
  ["Sci-Fi", "Romance"],
  ["Mystery", "Thriller"],
  ["Romance", "Historical"],
  ["Thriller", "Fantasy"],
  ["Historical", "Sci-Fi"],
  ["Fantasy", "Mystery"],
  ["Sci-Fi", "Romance"],
  ["Mystery", "Thriller"],
  ["Romance", "Historical"],
  ["Thriller", "Fantasy"],
  ["Historical", "Sci-Fi"],
  ["Fantasy", "Mystery"],
  ["Sci-Fi", "Romance"],
  ["Mystery", "Thriller"],
  ["Romance", "Historical"],
  ["Thriller", "Fantasy"],
  ["Historical", "Sci-Fi"],
  ["Fantasy", "Mystery"],
  ["Sci-Fi", "Romance"],
  ["Mystery", "Thriller"],
  ["Romance", "Historical"],
  ["Thriller", "Fantasy"],
  ["Historical", "Sci-Fi"],
  ["Fantasy", "Mystery"],
  ["Sci-Fi", "Romance"],
  ["Mystery", "Thriller"],
  ["Romance", "Historical"],
  ["Thriller", "Fantasy"],
  ["Historical", "Sci-Fi"],
  ["Fantasy", "Mystery"],
  ["Sci-Fi", "Romance"],
];

const statusByBookIndex = {
  4: "DRAFT",
  7: "COMPLETED",
  10: "DRAFT",
  13: "COMPLETED",
  14: "DRAFT",
  21: "COMPLETED",
  25: "DRAFT",
  27: "COMPLETED",
  28: "DRAFT",
};

const htmlWordCount = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

function makePageText(bookIndex, chapterIndex, pageIndex) {
  const book = allBookContent[bookIndex];
  if (!book?.chapters?.length) return "<p></p>";
  const ch = book.chapters[chapterIndex % book.chapters.length];
  const pages = ch.pages;
  if (!pages?.length) return "<p></p>";
  return pages[Math.min(pageIndex, pages.length - 1)];
}

async function wipeAppData() {
  await prisma.$transaction(async (tx) => {
    await tx.pageChunk.deleteMany();
    await tx.readingProgress.deleteMany();
    await tx.libraryBook.deleteMany();
    await tx.comments.deleteMany();
    await tx.rating.deleteMany();
    await tx.bookViews.deleteMany();
    await tx.chapterUnlocks.deleteMany();
    await tx.pages.deleteMany();
    await tx.chapters.deleteMany();
    await tx.bookGenre.deleteMany();
    await tx.books.deleteMany();
    await tx.library.deleteMany();
    await tx.transactionLedger.deleteMany();
    await tx.followers.deleteMany();
    await tx.user.deleteMany();
  });
}

async function ensureGenres() {
  for (const type of genreTypes) {
    const existing = await prisma.genre.findFirst({ where: { type } });
    if (!existing) await prisma.genre.create({ data: { type } });
  }
}

async function ensureRoles() {
  await prisma.userRole.upsert({
    where: { name: "USER" },
    create: { name: "USER" },
    update: {},
  });
  await prisma.userRole.upsert({
    where: { name: "ADMIN" },
    create: { name: "ADMIN" },
    update: {},
  });
}

async function seedUsers() {
  const userRole = await prisma.userRole.findUnique({ where: { name: "USER" } });
  const adminRole = await prisma.userRole.findUnique({ where: { name: "ADMIN" } });

  if (!userRole || !adminRole) {
    throw new Error("USER and ADMIN roles must exist before seeding users.");
  }

  // ==========================================
  // 1. SECURE SUPER ADMIN SEEDING (via .env)
  // ==========================================
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn("⚠️ Admin credentials missing in .env. Skipping Super Admin creation.");
  } else {
    const adminHash = await bcrypt.hash(adminPassword, 10);

    // Using upsert prevents crashes if you run the seed script multiple times
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {}, // If the admin already exists, do nothing
      create: {
        name: "Super Admin",
        email: adminEmail,
        password: adminHash,
        coinBalance: 0, // Added this since your schema requires it!
        roleId: adminRole.id,
      },
    });
    console.log(`✅ Super Admin created: ${adminEmail}`);
  }

  // ==========================================
  // 2. BLUEPRINT USERS SEEDING
  // ==========================================
  const passwordHash = await bcrypt.hash("password123", 10);
  const users = [];

  for (const bp of userBlueprints) {
    const roleId = bp.role === "ADMIN" ? adminRole.id : userRole.id;

    // Using upsert here as well is highly recommended for blueprints
    // to prevent errors on multiple seed runs!
    const user = await prisma.user.upsert({
      where: { email: bp.email },
      update: {},
      create: {
        name: bp.name,
        email: bp.email,
        password: passwordHash,
        coinBalance: bp.coinBalance,
        roleId,
      },
    });
    users.push(user);
  }

  console.log(`✅ Seeded ${users.length} blueprint users.`);
  return users;
}

async function seedBooks(usersByEmail) {
  const genreRows = await prisma.genre.findMany();
  const genreIdByType = Object.fromEntries(genreRows.map((g) => [g.type, g.id]));

  const writerPick = (bookIndex) => (bookIndex % 2 === 0 ? usersByEmail["sara.writer@bookstation.dev"] : usersByEmail["leo.writer@bookstation.dev"]);

  for (let i = 0; i < allBookContent.length; i++) {
    const content = allBookContent[i];
    const writer = writerPick(i);
    const pair = genrePairsByBookIndex[i] || genrePairsByBookIndex[i % genrePairsByBookIndex.length];
    const status = statusByBookIndex[i] ?? "ONGOING";
    const titleHead = titleHeads[i % titleHeads.length];
    const titleTail = titleTails[i % titleTails.length];
    const bookTitle = `${titleHead} ${titleTail} ${i + 1}`;

    const book = await prisma.books.create({
      data: {
        userId: writer.id,
        name: bookTitle,
        description: content.description,
        coverImage: getSeedCoverUrl(i),
        status,
        chapters: {
          create: content.chapters.map((_, chapterIdx) => {
            const chapterTitle = chapterNamePool[chapterIdx % chapterNamePool.length];
            const chapterPages = content.chapters[chapterIdx].pages;
            const pageBodies = chapterPages.map((_, pIdx) => makePageText(i, chapterIdx, pIdx));
            const wordCount = pageBodies.reduce((sum, html) => sum + htmlWordCount(html), 0);

            return {
              chapterNum: chapterIdx + 1,
              title: chapterTitle,
              isLocked: false,
              price: 0,
              isPublished: true,
              wordCount,
              pages: {
                create: pageBodies.map((text, pIdx) => ({
                  text,
                  pageNum: pIdx + 1,
                })),
              },
            };
          }),
        },
      },
      include: { chapters: { include: { pages: true } } },
    });

    for (const type of pair) {
      const genreId = genreIdByType[type];
      if (!genreId) throw new Error(`Missing genre in DB: ${type}`);
      await prisma.bookGenre.create({
        data: { bookId: book.id, genreId },
      });
    }
  }

  return allBookContent.length;
}

async function main() {
  console.log("Wiping application data…");
  await wipeAppData();

  console.log("Ensuring roles and genres…");
  await ensureRoles();
  await ensureGenres();

  console.log("Creating users…");
  const created = await seedUsers();
  const usersByEmail = Object.fromEntries(created.map((u) => [u.email, u]));

  console.log("Creating books from seed library…");
  const n = await seedBooks(usersByEmail);
  console.log(`Done. Seeded ${n} books.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });