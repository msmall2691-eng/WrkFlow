#!/usr/bin/env bash
# Packages the Instant Quote WordPress plugin with the current widget.
# Output: dist/mstudio-instant-quote.zip (dist/ is gitignored; the zip is
# what gets sent to a customer, not something served from the site).
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=plugins/wordpress/mstudio-instant-quote
mkdir -p "$SRC/assets" dist
cp public/embed/quote.js "$SRC/assets/quote.js"
rm -f dist/mstudio-instant-quote.zip
(cd plugins/wordpress && zip -qr ../../dist/mstudio-instant-quote.zip mstudio-instant-quote)
echo "dist/mstudio-instant-quote.zip"
