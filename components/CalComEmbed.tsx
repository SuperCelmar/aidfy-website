'use client';

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface CalComEmbedProps {
  namespace?: string;
  calLink: string;
  style?: React.CSSProperties;
  config?: any; // Consider defining a more specific type if Cal.com provides one
  hideEventTypeDetails?: boolean;
  theme?: "light" | "dark" | "auto";
}

export default function CalComEmbed({
  namespace = "default-namespace", // Provide a sensible default or make it required
  calLink,
  style = {width:"100%",height:"100%",overflow:"scroll"},
  config = {"layout":"month_view"}, // Default config now includes the layout. User can override by passing a config prop.
  hideEventTypeDetails = false,
  theme = "auto", // Default theme to auto, can be overridden
}: CalComEmbedProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({namespace});
      cal("ui", { 
        "hideEventTypeDetails": hideEventTypeDetails,
        "theme": theme // Pass theme to cal("ui",...)
      });
    })();
  }, [namespace, hideEventTypeDetails, theme]); // Added theme to dependencies

  // Ensure the config prop also reflects the theme
  const effectiveConfig = {
    ...config,
    theme: theme,
  };

  return <Cal namespace={namespace}
    calLink={calLink}
    style={style}
    config={effectiveConfig} 
  />;
}; 