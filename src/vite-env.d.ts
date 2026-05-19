/// <reference types="vite/client" />

declare module "motion/react" {
  import { motion as m, AnimatePresence as AP } from "motion";
  export const motion: typeof m;
  export const AnimatePresence: typeof AP;
}

declare module "*.png" {
  const value: string;
  export default value;
}
