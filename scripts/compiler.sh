#!/bin/sh

rm -rf source/db-fixed.csv
rm -rf source/icons.json
rm -rf source/icons-config.json

rm -rf packages/react/src
rm -rf packages/react/es
rm -rf packages/react/lib
rm -rf packages/react/styles
rm -rf packages/react/icons.json

rm -rf packages/svg/src
rm -rf packages/svg/es
rm -rf packages/svg/lib
rm -rf packages/svg/icons.json

rm -rf packages/vue/src
rm -rf packages/vue/es
rm -rf packages/vue/lib
rm -rf packages/vue/styles
rm -rf packages/vue/icons.json

rm -rf packages/vue-next/src
rm -rf packages/vue-next/es
rm -rf packages/vue-next/lib
rm -rf packages/vue-next/styles
rm -rf packages/vue-next/icons.json

pnpm esno scripts/build-icons.ts
pnpm esno scripts/build-code.ts
