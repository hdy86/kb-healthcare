"use client";

import Loading from "./loading";
import useStore from "@stores/index";

export default function FullLoading() {
  const { loading } = useStore((state) => state);

  return loading && <Loading className='full' size={80} />;
}
