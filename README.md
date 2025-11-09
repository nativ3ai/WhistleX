# WhistleX

Intel decentralized marketplace prototype.

## Overview

This repo contains a static prototype of the WhistleX intel marketplace dashboard. 

## Getting Started

Open `index.html` to display the DEMO. The UI is fully static and
only relies on the bundled `css/styles.css` and `js/app.js` assets.

## SQL Ledger

A demo schema for whistleblower intel and the rating system lives at `sql/ratings_schema.sql`. It
creates tables for intel metadata and ratings, plus a materialized view with aggregate scores and
sample seed data to power local prototypes.
