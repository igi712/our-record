# our-record
Magia Record Live2D home viewer. No build step: it's plain HTML and JS, and `index.html` links to the viewer, homescreen, quotes, and sound mode.

## [main hub](https://igi712.github.io/our-record/)
[**Homescreen**](https://igi712.github.io/our-record/quotes.html#/MyPage)  
View the Magia Record homescreen  
[**Quotes**](https://igi712.github.io/our-record/quotes.html)  
Play quotes for each playable unit  
[**Sound Mode**](https://igi712.github.io/our-record/sound.html)  
Play the OST  
[**Live2D Viewer**](https://igi712.github.io/our-record/viewer.html)  
View Live2D models for each playable units  

Attach `?id=1001` to the end of the Homescreen and Quotes pages, and replace with the character's ID of your choice to view them quickly. Character IDs can be found by going to the [Magia Record Wiki](https://magireco.fandom.com/wiki/Magia_Record_English_Wiki) and going to the page of your character. Also helpful might be [this page](https://magireco.fandom.com/wiki/Category:Magical_Girl_by_ID) which lists characters in order by their ID.

> `1XXX` is main story characters original to the Magia Record game.  
> `2XXX` is characters from the original anime (including Nagisa).  
> `3XXX` is side story characters original to the Magia Record game.  
> `4XXX` is crossover characters, including from other branches of the Madoka franchise as well as non-Madoka characters.

###### [Puella Magi Wiki](https://wiki.puella-magi.net/Category:Magia_Record_Units_by_ID)

## run it
1. Needs http (ES modules), so navigate to the repo root
2. Run `python3 -m http.server 8000`
3. Open http://localhost:8000/ to view the hub


With auto-reload, watching only root + `magica` (skips the huge `assets/` etc):

```
npx --yes browser-sync start --server --files "*.html, magica/**/*" --port 8000 --no-open --no-notify
```

## notes
- Live2D models/BGM live in `assets/ma-re-data/` (local-only, not deployed). Missing = falls back to remote, don't panic.
- `S` stop, `C` snapshot. Mic lipsync needs https or localhost.
