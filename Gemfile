source "https://rubygems.org"

# Ruby version: see .ruby-version (4.0.2 for local + GitHub Actions).
# Ruby 3.4+ / 4.0: stdlib moved to gems; Jekyll 4.3 + Liquid + safe_yaml need these.
gem "csv"
gem "base64"
gem "bigdecimal"

gem "jekyll", "~> 4.3.4"
# CVE-2026-35611 / GHSA-h27x-rffw-24p4 (ReDoS in URI templates); fixed in 2.9.0+
gem "addressable", ">= 2.9.0"

# Prefer 2.x (sassc) over 3.x (sass-embedded + native protobuf); fewer platform/Ruby issues locally + on CI.
gem "jekyll-sass-converter", "~> 2.2"

gem "minima", "~> 2.5"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-autoprefixer"
end

gem "kramdown-parser-gfm"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:windows, :jruby]

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.0" if Gem.win_platform?

# WEBrick is not in Ruby 3.0+ default gems; needed for `jekyll serve`.
gem "webrick", "~> 1.8"
