#!/bin/sh
set -eu

version=$(node -p "JSON.parse(require('node:fs').readFileSync('dist/manifest.json', 'utf8')).version")
package_version=$(node -p "JSON.parse(require('node:fs').readFileSync('package.json', 'utf8')).version")
test "$version" = "$package_version"
test "$(find dist -type f | wc -l | tr -d ' ')" = 5
for file in manifest.json content.js popup.js popup.html LICENSE; do
  test -s "dist/$file"
done
mkdir -p release
rm -f "release/github-ja-ui-$version.zip"
output="$(pwd)/release/github-ja-ui-$version.zip"
(
  cd dist
  zip -q -X "$output" manifest.json content.js popup.js popup.html LICENSE
)
test "$(unzip -Z1 "$output" | wc -l | tr -d ' ')" = 5
unzip -t "$output"
echo "$output"
