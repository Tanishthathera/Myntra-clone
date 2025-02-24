import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatusActions } from "../store/fetchStatusSlice";
import { itemsActions } from "../store/itemsSlice";

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) {
      console.log("🚀 Data already fetched, skipping API call.");
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        dispatch(fetchStatusActions.markFetchingStarted());

        const response = await fetch(
          "https://myntra--backend.vercel.app/api/items",
          {
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            signal: signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { items } = await response.json();

        if (!items || !Array.isArray(items)) {
          throw new Error("Invalid data format received from API");
        }

        dispatch(fetchStatusActions.markFetchDone());
        dispatch(fetchStatusActions.markFetchingFinished());
        dispatch(itemsActions.addInitialItems(items));

        console.log("✅ Data fetched successfully:", items);
      } catch (error) {
        if (error.name === "AbortError") {
          console.warn("⚠️ Fetch request was aborted.");
        } else {
          console.error("❌ Error fetching data:", error);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchStatus.fetchDone, dispatch]); // ✅ Only runs when `fetchDone` changes

  return null;
};

export default FetchItems;
