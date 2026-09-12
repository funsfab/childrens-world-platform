CHILDREN WORLD PLATFORM - BUILD PACK 15 v0.1
Seven-Issue Correction Batch
Date: 12 September 2026

BASE
Built directly from Build Pack 14 v0.1, preserving the existing child-facing prototype, EN/FR system, music system, assets, country flags, visuals, question banks and five protected responsive modes.

THIS PACK FIXES THE SEVEN ISSUES FROM THE LATEST TESTING ROUND
1. Mobile portrait and mobile landscape horizontal page movement/overflow.
2. Public Demo status incorrectly opening the Family Trial flow.
3. Build Your City being too easy once the obvious required buildings are placed.
4. Brain Battle losing the active question/progress when EN/FR is changed mid-battle.
5. Brain Battle Master Mission completion having only one replay route.
6. Creator Studio Open Mission not opening a meaningful creative workspace.
7. Flag Quest wrong-answer correction disappearing too quickly, especially in Capitals mode.

IMPORTANT UPLOAD NOTE
Extract this ZIP, then upload/replace the files in the GitHub repository while preserving the folder structure.

NEW FILE
- js/creator.js

IMPORTANT MODIFIED FILES
- css/style.css
- js/access.js
- js/common.js
- js/city.js
- js/challenge.js
- js/game.js
- js/i18n.js
- city-builder.html
- challenge.html
- creator.html
- game.html
- functionality-audit.html

KEY BEHAVIOUR CHANGES
- The landing page now contains decorative elements within their own containers and the root document is constrained to the viewport. Mobile portrait/landscape should no longer pan sideways.
- Public Demo is now a status indicator, not a shortcut to registration. Start Family Trial remains a separate action.
- Build Your City now requires every essential service, at least 5,000 citizens, Education 50+, and a final emergency reserve between GBP 30,000 and GBP 70,000. A clean solution is possible with the GBP 2.35m budget.
- Brain Battle stores the active run on-device. Changing EN/FR reloads the page but restores the same tier, question, score, streak and answered-state feedback instead of restarting.
- After Master Mission, children can either Play Master Mission Again or Start Again from Explorer.
- Creator Studio Open Mission now opens a structured mission workspace with mission brief, planning prompts, design-choice chips, project notes, save/continue, clear draft and return-to-list controls.
- Flag Quest wrong answers and time-outs now keep the correct answer visible until the child presses Next question. Correct answers continue at game pace.

PROTOTYPE NOTE
This is still a browser/localStorage prototype. Secure family accounts, subscriptions, cloud progress, production CMS/admin roles and database-enforced access remain future backend work.
