import { useEffect } from "react";
import { useLocation, useNavigation } from "react-router-dom";

function getScrollPosition(key: string) {
  const pos = window.sessionStorage.getItem(key);
  return pos && /^[0-9]+$/.test(pos) ? parseInt(pos, 10) : 0;
}

function setScrollPosition(key: string, pos: number) {
  window.sessionStorage.setItem(key, pos.toString());
}

/**
 * Source: https://github.com/remix-run/react-router/pull/10468#issuecomment-1577239850
 * Given a ref to a scrolling element, keep track of its scroll
 * position before navigation and restore it on return (e.g., back/forward nav).
 * Note that `location.key` is used in the cache key, not `location.pathname`,
 * so the same path navigated to at different points in the history stack will
 * not share the same scroll position.
 */
export function useScrollRestoration(el: React.RefObject<HTMLElement>) {
  const key = `scroll-position-${useLocation().pathname}`;
  const { state } = useNavigation();
  useEffect(() => {
    if (state === "loading") {
      setScrollPosition(key, el.current?.scrollTop ?? 0);
    } else if (state === "idle") {
      el.current?.scrollTo(0, getScrollPosition(key));
    }
  }, [key, state, el]);
}
