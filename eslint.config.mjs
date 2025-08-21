import next from "eslint-config-next";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    // --- ADICIONAMOS A SEÇÃO DE REGRAS AQUI ---
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Desliga a regra que proíbe o uso de 'any'
    },
  },
  ...next.configs.recommended,
  ...next.configs["core-web-vitals"],
);