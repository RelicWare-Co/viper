import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import devServer from "@hono/vite-dev-server";
import bunAdapter from "@hono/vite-dev-server/bun";
import { telefunc } from "telefunc/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		devServer({
			adapter: bunAdapter,
      entry: './src/server/main.tsx',
      injectClientScript: false,
      exclude: [ // We need to override this option since the default setting doesn't fit
        /.*\.tsx?($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /.*\.(svg|png)($|\?)/,
        /^\/@.+$/,
        /^\/favicon\.ico$/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/
    ]
    }),
		TanStackRouterVite({ autoCodeSplitting: true, routeFileIgnorePattern: "(telefunc|telefunc\.ts)" }),
		viteReact(),
		telefunc()
	],
	test: {
		globals: true,
		environment: "jsdom",
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"@tabler/icons-react":"@tabler/icons-react/dist/esm/icons/index.mjs",
		},
	},
});
