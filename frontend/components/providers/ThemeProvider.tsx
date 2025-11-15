"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children, ...props }: { children: ReactNode; attribute?: string; defaultTheme?: string; enableSystem?: boolean }) {
  return (
    <NextThemesProvider
      attribute={props.attribute ?? "class"}
      defaultTheme={props.defaultTheme ?? "dark"}
      enableSystem={props.enableSystem ?? true}
    >
      {children}
    </NextThemesProvider>
  );
}
