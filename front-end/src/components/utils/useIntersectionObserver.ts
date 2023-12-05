import {useCallback, useRef} from "react";

const useIntersectionObserver = (options:any, cb:any, dependency: any[]) => {
  const observer = useRef<IntersectionObserver | null>(null)

  return useCallback((node: any) => {
    if (!node) {
      if (observer.current) {
        observer.current.disconnect()
      }
      return
    }

    observer.current = new window.IntersectionObserver(cb, options)
    observer.current.observe(node)
  }, dependency)
}

export default useIntersectionObserver;