import { useEffect, useState } from 'react'

export function useActiveSection(ids, offset = 0.28) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!nodes.length) return undefined

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: `-${offset * 100}% 0px -45% 0px`, threshold: [0.08, 0.25, 0.5] },
    )

    nodes.forEach((node) => io.observe(node))
    return () => io.disconnect()
  }, [ids, offset])

  return active
}
