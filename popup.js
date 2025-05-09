onkeyup = e => e.keyCode == 13 && chrome.tabs.query({ active: !0, currentWindow: !0 }, async tabs => {
  let count = +document.body.lastChild.value;
  if (count) {
    let tab = tabs[0];
    let url = tab.url;
    let result = /^(.*?)(\d+)(?!.*\d)(.*)$/.exec(url);
    if (result) {
      let n = result[2];
      let nLen = n.length;
      let i = result.index;
      let isPositive = count > 0;
      let index = tab.index + isPositive;
      let tabIds = Array((count = isPositive ? count : -count) + 1);
      let f = n[0] != "0" ? () => --n : () => (--n + "").padStart(nLen, "0");

      n = +n + (isPositive && count + 1);
      tabIds[i = 0] = tab.id;
      while (
        tabIds[++i] = chrome.tabs.create({
          url: result[1] + f() + result[3],
          active: !1,
          index
        }),
        i < count && n
      );

      tabIds = await Promise.all(tabIds);
      i = 0;
      while (
        tabIds[++i] = tabIds[i].id,
        i < count
      );

      let { groupId } = tab;
      chrome.tabs.group(
        groupId < 0
          ? { tabIds }
          : ((n = await chrome.tabs.query({ groupId })), isPositive && n.at(-1).active)
            ? { groupId, tabIds: tabIds.concat(n.map(v => v.id)) }
            : !isPositive && n[0].active
              ? { groupId, tabIds: n.map(v => v.id).concat(tabIds) }
              : { tabIds }
      );
    }
    close();
  }
});