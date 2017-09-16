# Commit Browser

## View Live at https://kevincolten.com/commit-browser

## Features
### Built from scratch with React using minimum libraries (not just using `create-react-app`)
### Type-ahead instant search results ("debounced", of course)
### One click event listener per table (not for every row)
### Minimalist, yet functional, design

## Try it out
1. Search for a user or organization in the search box
2. Navigate or search through the repositories and commits to view the commits!

## Set up locally
1. `yarn install` or `npm install`
2. `yarn start` or `npm start`

## Notes
### Obviously a bad idea to expose your API token on the front end and in the repo.
### If accessing over http, try using Google Chrome. Firefox demands https when sending authentication headers.
### Repositories are sorted by "Most recently updated", then by "Forks".
