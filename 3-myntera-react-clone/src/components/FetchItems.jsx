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

    dispatch(fetchStatusActions.markFetchingStarted());

    fetch(
      "https://myntra-clone-3ysrm455q-tanishthatheras-projects.vercel.app/api/items",
      {
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        signal: signal,
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(({ items }) => {
        if (!items || !Array.isArray(items)) {
          throw new Error("Invalid data format received from API");
        }

        dispatch(fetchStatusActions.markFetchDone());
        dispatch(fetchStatusActions.markFetchingFinished());
        dispatch(itemsActions.addInitialItems(items));
        console.log("✅ Data fetched successfully:", items);
      })
      .catch((error) => {
        console.error("❌ Error fetching data:", error);
      });

    return () => {
      controller.abort();
    };
  }, [fetchStatus, dispatch]);

  return null;
};

export default FetchItems;
