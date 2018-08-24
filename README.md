# WombleBot
Little Discord bot I'm going to try work on. Plays Mafia (or it will when it works).

### TO ADD TO A SERVER, MESSAGE ME ;)

### LIST OF TASKS TODO:
Immediate
- Implement night action effects on game state
- Sort win conditions

Long-term
- Chat perms for players (voice and text)
- Error checking (List below)
- Get people to test!

Test state changes I will have to revert:
- !addme currently adds a bunch of meaningless tags, want to return this to the "add player" function
- game timers too short
- Have to stop votes from stacking

Errors/Issues:
- Reset votes every day (ABSOLUTE STRESS)
- Sometimes the program ints randomly, may be do to unorthodox structure :)
- Entering some 2-param commands with one param breaks program
- Limiting scope of commands in general needs to be solved