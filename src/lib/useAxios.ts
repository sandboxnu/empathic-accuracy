import { useEffect, useCallback } from "react";
import Axios from "axios";

// Fetch data with axios and enforce ordered delivery via cancellation
export function useAxios<T>(
  url: string,
  onSuccess: (data: T) => void,
  deps: unknown[]
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memo = useCallback(onSuccess, deps);
  useEffect(() => {
    let canceled = false;
    Axios.get(url)
      .then(({ data }) => {
        if (!canceled) {
          memo(data);
        }
      })
      .catch((e) => console.log(e));
    return () => (canceled = true);
  }, [memo, url]);
}
