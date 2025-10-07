onkeyup = e => e.keyCode == 13 && chrome.tabs.query({ active: !0, currentWindow: !0 }, async tabs => {
  let count = +document.body.lastChild.value;
  if (count) {
    let tab = tabs[0];
    let { url } = tab;
    let result =/(?<!%[0-9A-Fa-f]{0,2})\d+(?!.*?(?<!%[0-9A-Fa-f]{0,2})\d)/.exec(url);
    if (result) {
      let n = result[0];
      let nLen = n.length;
      let i = result.index;
      let s0 = url.slice(0, i);
      let s1 = url.slice(i + nLen);
      let isPositive = count > 0;
      let index = tab.index + isPositive;
      let tabIds = Array((count = isPositive ? count : -count) + 1);
      let f = n[0] != "0" ? () => --n : () => (--n + "").padStart(nLen, "0");

      n = +n + (isPositive && count + 1);
      tabIds[i = 0] = tab.id;
      while (
        tabIds[++i] = chrome.tabs.create({
          url: s0 + f() + s1,
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