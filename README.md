# WhistleX

Intel decentralized marketplace prototype.

## Overview

This repo contains a static prototype of the WhistleX intel marketplace dashboard. It showcases a
slick, modern layout with mock data for active whistleblower pools, recently released intel, and a
headline ticker powered by JavaScript. Ratings are surfaced in the UI and mirrored by a sample SQL
schema that demonstrates how upvotes and downvotes can be curated off-chain while pools remain on a
smart contract.

## Getting Started

Open `index.html` in any modern browser to explore the dashboard demo. The UI is fully static and
only relies on the bundled `css/styles.css` and `js/app.js` assets.

## SQL Ledger

A demo schema for whistleblower intel and the rating system lives at `sql/ratings_schema.sql`. It
creates tables for intel metadata and ratings, plus a materialized view with aggregate scores and
sample seed data to power local prototypes.
