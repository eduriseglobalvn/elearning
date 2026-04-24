declare module "@mui/icons-material/*" {
  import type { ComponentType, SVGProps } from "react";

  type MuiIconProps = SVGProps<SVGSVGElement> & {
    fontSize?: "inherit" | "small" | "medium" | "large" | string;
    title?: string;
  };

  const Icon: ComponentType<MuiIconProps>;
  export default Icon;
}
