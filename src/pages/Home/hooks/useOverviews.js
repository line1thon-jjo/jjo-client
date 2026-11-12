import { useEffect, useState } from "react";

import { getOverview } from "@/api/reports";

export function useOverviews(currentId, previousId) {
  const [loaded, setLoaded] = useState({ key: null, overview: null, previous: null });
  const key = currentId ? `${currentId}:${previousId ?? ""}` : null;

  useEffect(() => {
    if (!currentId) return;
    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
      getOverview(currentId, { signal }),
      previousId ? getOverview(previousId, { signal }).catch(() => null) : null,
    ])
      .then(([overview, previous]) => {
        if (!signal.aborted) setLoaded({ key: `${currentId}:${previousId ?? ""}`, overview, previous });
      })
      .catch(() => {});

    return () => controller.abort();
  }, [currentId, previousId]);

  return loaded.key === key ? loaded : { overview: null, previous: null };
}
