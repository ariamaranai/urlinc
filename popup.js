{
  let { tabs } = chrome;
  onkeyup = e => e.keyCode === 13 && tabs.query({ active: !0, currentWindow: !0 }, ts => {
    let count = document.body.lastChild.value;
    if (!count)
      return close();

    let tab = ts[0];
    let { url } = tab;
    let result = /(?<!%[0-9A-Fa-f]{0,2})\d+(?!.*?(?<!%[0-9A-Fa-f]{0,2})\d)/.exec(url);
    if (!result)
      return close();

    let n = result[0];
    let nLen = n.length;
    let isZeroStart = n[0] === "0";
    let i = result.index;
    let s0 = url.slice(0, i);
    let s1 = url.slice(i + nLen);
    let index = tab.index;
    n = +n;
    (count = +count) > 0 ? (++index, n += count + 1) : (count = -count);
    i = 0;
    while (
      tabs.create({
        url: s0 + (isZeroStart ? (--n + "").padStart(nLen, "0") : --n) + s1,
        active: !1,
        index
      }),
      n && ++i < count
    );
    return close();
  });
}
