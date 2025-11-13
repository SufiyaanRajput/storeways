import React, { useEffect, useRef } from "react";

export default function RedocEmbed() {
  const ref = useRef(null);

  useEffect(() => {
    // dynamically load the UMD bundle
    const script = document.createElement("script");
    script.src = "https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js";
    script.onload = () => {
      window.Redoc.init("/openapi.json", { scrollYOffset: 60 }, ref.current);
    };
    document.body.appendChild(script);
  }, []);

  return <div ref={ref} style={{ height: '90vh', overflowY: 'hidden', overflowY: 'scroll' }}/>;
}