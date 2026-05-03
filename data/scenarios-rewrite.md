# Karma Game - HARD MODE Scenario Rewrite

## CORE DESIGN CHANGES (VERY IMPORTANT)

1. REMOVE OBVIOUS "GOOD VS BAD" CHOICES
- No clearly “correct” answer
- Every choice must have a trade-off

2. CONSEQUENCES MUST MATTER MORE
- Increase consequenceScore range from [-10, 10] → [-15, 15]
- “Good” actions often have NEGATIVE consequences
- “Bad” actions can sometimes have short-term positive consequences

3. ADD MORAL TENSION
Each scenario must force conflict between:
- Compassion vs Responsibility
- Truth vs Harm
- Self vs Others
- Intention vs Outcome
- Detachment vs Care

4. NO PERFECT KARMA PATH
- Even best choice should NOT give full positive scores
- Cap most “good” outcomes around:
  intention: 8–10  
  action: 6–8  
  consequence: -5 to +5  
  attachment: 3–8  

5. REMOVE "FOLLOW YOUR GUT"
- This is lazy and breaks the game

6. ADD 4–5 REAL CHOICES PER SCENARIO

---

# ✨ EXAMPLE REWRITES (USE THIS STYLE)

---

## 🎓 Poor Human Student

### Scenario: Dropped Books (REWRITE)

**Description:**  
You're already late to an exam worth 30% of your grade. Someone drops their books in front of you.

| Choice | Intention | Action | Consequence | Reflection | Int | Act | Con | Att |
|--------|----------|--------|------------|------------|-----|-----|-----|-----|
| Help fully, accept being late | Compassion over self | Stop and help completely | You fail the exam, they deeply remember your kindness | Compassion can cost you more than you're ready to give | 9 | 8 | -10 | 7 |
| Help briefly, then leave | Balance both | Assist quickly, rush off | You barely make it, they struggle but appreciate effort | Partial compassion is still a choice—but incomplete | 6 | 5 | 2 | 4 |
| Ignore and go to exam | Self-preservation | Step around and leave | You do well, but feel lingering guilt | Survival often comes at the cost of connection | -1 | -2 | 5 | -4 |
| Ask others to help instead | Delegate compassion | Call out for help, keep moving | Someone else helps, you feel justified | Avoiding action can disguise itself as responsibility | 3 | 2 | 1 | 0 |
| Stay and help, then email professor | Try to balance morality and system | Help fully and explain later | Professor doesn’t believe you | Systems don’t always reward virtue | 8 | 7 | -8 | 5 |

---

### Scenario: Wallet (REWRITE)

| Choice | Intention | Action | Consequence | Reflection | Int | Act | Con | Att |
|--------|----------|--------|------------|------------|-----|-----|-----|-----|
| Return it untouched | Pure honesty | Turn it in | You struggle financially, owner never knows it was you | Doing right doesn't guarantee recognition or relief | 10 | 9 | -7 | 8 |
| Take some cash, return rest | Rationalize survival | Keep part, return wallet | You pay rent but feel divided inside | Partial honesty is still dishonesty | 1 | -2 | 6 | -3 |
| Keep everything | Desperation | Take it all | You survive, but anxiety grows | Survival can still generate karmic weight | -5 | -6 | 8 | -6 |
| Contact owner directly | Mixed motives | Reach out | They suspect you, tension forms | Good intentions can still create distrust | 5 | 5 | -2 | 1 |
| Leave it | Avoid involvement | Walk away | Someone else steals it | Not choosing is still a choice | -3 | -4 | -3 | -2 |

---

### Scenario: Homeless Person (REWRITE)

| Choice | Intention | Action | Consequence | Reflection | Int | Act | Con | Att |
|--------|----------|--------|------------|------------|-----|-----|-----|-----|
| Give $5 | Compassion | Share money | You struggle later | Generosity hurts when you have little | 9 | 8 | -6 | 8 |
| Buy food | Controlled compassion | Choose how to help | They feel judged | Helping can still carry subtle control | 6 | 6 | 2 | 2 |
| Talk but give nothing | Emotional support | Sit and listen | You lose time, still feel conflicted | Presence is valuable but not always enough | 5 | 4 | 0 | 4 |
| Ignore them | Avoid discomfort | Walk away | You keep stability | Comfort often depends on ignoring suffering | -2 | -3 | 4 | -4 |
| Give everything | Radical compassion | Give all money | You suffer significantly | Extreme virtue can destabilize yourself | 10 | 9 | -12 | 10 |

---

# 🐍 Snake (MAKE THIS MORALLY WEIRD)

### Scenario: Trapped Frog (REWRITE)

| Choice | Intention | Action | Consequence | Reflection | Int | Act | Con | Att |
|--------|----------|--------|------------|------------|-----|-----|-----|-----|
| Leave it | Avoid harm | Walk away | It dies slowly | Nonviolence can still allow suffering | 7 | 6 | -6 | 8 |
| Kill quickly | End suffering | Strike | You eat and end pain | Is this compassion or justification? | 3 | 3 | 3 | 1 |
| Play with it | Curiosity/power | Prolong suffering | You feed, but cause pain | Awareness without restraint becomes cruelty | -8 | -9 | 2 | -8 |
| Free it | Compassion | Help escape | You remain hungry | Compassion often requires sacrifice | 9 | 7 | -7 | 9 |

---

# 🧘 Monk (MAKE THIS HARD)

### Scenario: Suffering Stranger (REWRITE)

| Choice | Intention | Action | Consequence | Reflection | Int | Act | Con | Att |
|--------|----------|--------|------------|------------|-----|-----|-----|-----|
| Stop meditation and help | Compassion | Leave practice | You help, but your discipline weakens | Is compassion higher than practice? | 9 | 8 | 5 | 7 |
| Continue meditating | Discipline | Stay focused | They suffer longer | Detachment can become indifference | -2 | -3 | -4 | -6 |
| Finish then help | Balance | Delay help | You help late | Timing is part of karma | 6 | 5 | 1 | 3 |
| Send someone else | Indirect compassion | Delegate | Help arrives slower | Distance reduces responsibility | 4 | 3 | 0 | 1 |
| Reflect but hesitate | Overthinking | Do nothing immediately | Opportunity passes | Thinking can replace action | 2 | 1 | -3 | -1 |

---

# ⚙️ GLOBAL BALANCE CHANGES (IMPLEMENT)

1. Update scoring ranges:
- intention: -10 to 10
- action: -10 to 10
- consequence: -15 to 15
- attachment: -10 to 10

2. HARD CAP MAX KARMA GAIN PER SCENARIO:
- Max +12 total per event
- Prevent stacking to 95 easily

3. Add hidden penalty:
IF (all 4 scores > 7):
    subtract 3 (prevent perfect farming)

4. Add diminishing returns:
If player chooses “high compassion” repeatedly:
    reduce future intention impact slightly

---

# 🎯 FINAL GOAL

Player should:
- Struggle to reach 80
- Rarely reach 90+
- Feel conflicted after choices
- Sometimes regret “good” actions
- Sometimes question if they did the right thing

If the player always feels correct → the game failed.

If the player sometimes feels uncomfortable → the game succeeded.