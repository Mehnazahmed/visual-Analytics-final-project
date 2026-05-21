import { useEffect, useState } from "react";

export default function usePostcards() {
  const [postcards, setPostcards] = useState([]);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => setPostcards(data.data));
  }, []);

  return postcards;
}
