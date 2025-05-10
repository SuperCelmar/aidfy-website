"use client"

import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud"

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 40,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
    // dragControl: false,
  },
}

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#080510"
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff"
  const colorToUse = icon.hex || fallbackHex; 

  return renderSimpleIcon({
    icon: {
        ...icon,
        hex: colorToUse,
    },
    bgHex,
    fallbackHex: colorToUse,
    minContrastRatio: theme === "dark" ? 2 : 1.2,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  })
}

export type IconEntry =
  | { type: 'slug'; slug: string }
  | {
      type: 'custom';
      title: string;
      path: string;
      hex?: string;
    };

export type DynamicCloudProps = {
  iconEntries: IconEntry[];
}

type FetchedIconData = Awaited<ReturnType<typeof fetchSimpleIcons>>

export function IconCloud({ iconEntries }: DynamicCloudProps) {
  const [fetchedData, setFetchedData] = useState<FetchedIconData | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const slugsToFetch = iconEntries
      .filter((entry): entry is { type: 'slug'; slug: string } => entry.type === 'slug')
      .map(entry => entry.slug);

    if (slugsToFetch.length > 0) {
      fetchSimpleIcons({ slugs: slugsToFetch }).then(setFetchedData);
    } else {
      setFetchedData({ simpleIcons: {}, allIcon: {} } as FetchedIconData);
    }
  }, [iconEntries]);

  const allIconObjects = useMemo((): SimpleIcon[] => {
    if (!fetchedData) return [];

    return iconEntries.map(entry => {
      if (entry.type === 'slug') {
        return fetchedData.simpleIcons[entry.slug] || null;
      }
      return {
        title: entry.title,
        path: entry.path,
        hex: entry.hex || (theme === 'light' ? '#333333' : '#dddddd'),
      } as SimpleIcon;
    }).filter(icon => icon && icon.path) as SimpleIcon[];

  }, [iconEntries, fetchedData, theme]);

  const renderedIcons = useMemo(() => {
    return allIconObjects.map((icon) =>
      renderCustomIcon(icon, theme || "light"),
    );
  }, [allIconObjects, theme]);

  if (fetchedData === null && iconEntries.some(e => e.type === 'slug')) {
    return <div style={{minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center"}}>Loading icons...</div>;
  }
  if (renderedIcons.length === 0 && (fetchedData !== null || iconEntries.every(e => e.type === 'custom'))) {
    return <div style={{minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center"}}>No icons to display.</div>;
  }

  return (
    // @ts-ignore - Reinstated for Cloud component's children prop
    <Cloud {...cloudProps}>
      <>{renderedIcons}</>
    </Cloud>
  );
} 