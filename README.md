# WombleBot
Little Discord bot I'm going to try work on. Plays Mafia (or it will when it works).

### TO ADD TO A SERVER, MESSAGE ME ;)

### LIST OF TASKS TODO:
Immediate
- Sort win conditions
- Chat perms for players (voice and text)
- Error checking (List below)

Long-term
- Get people to test!
- Add a suicide command
- Reform mafia kill selection

Test state changes I will have to revert:
- !addme currently adds a bunch of meaningless tags, want to return this to the "add player" function
- game timers too short
- Have to stop votes from stacking
- Prevent users from voting for themselves

Errors/Issues:
- Sometimes the program ints randomly, may be do to unorthodox structure :)
- Entering some 2-param commands with one param breaks program
- Limiting scope of commands in general needs to be solved, eg: starting a new game when current game is in progress
- Need more console logs so I have the full story before every error