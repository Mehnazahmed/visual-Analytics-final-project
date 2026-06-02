import { useEffect, useState } from "react";

export default function usePostcards() {
  const [postcards, setPostcards] = useState([]);

  useEffect(() => {
    fetch("/data/postcards_geocoded.json")
      .then((res) => res.json())
      .then((data) => setPostcards(data));
  }, []);

  return postcards;
}
