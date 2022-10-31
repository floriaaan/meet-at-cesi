export const fetchXHR = async (
  method: "GET" | "POST",
  url: string
): Promise<unknown | { status: number; statusText: string }> => {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send();
  });
};

import { useEffect, useReducer, useRef, useState } from "react";

interface State<T> {
  data?: T;
  error?: Error;
  loading: boolean;
  payload?: T | Error;
}

// type Cache<T> = { [url: string]: T };

// discriminated union type
type Action<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: Error };

/**
 * It fetches data from a given url and stores it in a cache
 * @param {string} [propsURL] - The url to fetch data from.
 * @param {any} [session] - The session object to use for authentication.
 * @param {RequestInit} [options] - RequestInit
 * @returns The state object.
 */
export function useFetchXHR<T = unknown>(url: string): State<T> {
  // const cache = useRef<Cache<T>>({});

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
    loading: true,
    payload: undefined,
  };
  const [data, setData] = useState<T | undefined>(undefined);

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...initialState, loading: true };
      case "fetched":
        setData(action.payload);
        return {
          ...initialState,
          data: action.payload,
          loading: false,
        };
      case "error":
        return {
          ...initialState,
          error: action.payload,
          loading: false,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // Do nothing if the url is not given
    if (!url) return;

    const fetchData = async () => {
      dispatch({ type: "loading" });

      try {
        const response = await fetchXHR("GET", url);

        const body = JSON.parse(response as unknown as string) as T;

        dispatch({ type: "fetched", payload: body });
        if (cancelRequest.current) return;
      } catch (error) {
        dispatch({ type: "error", payload: error as Error });
        if (cancelRequest.current) return;
      }
    };

    void fetchData();

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      cancelRequest.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { ...state, data };
}
