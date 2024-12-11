import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
  theme: {
    extends: {
      fontFamily: {
        roboto: ["var(--font-roboto)"],
      },
    },
  },
  plugins: [],
};

export default config;
