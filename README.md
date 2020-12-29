# Personal Website

This site is built using [Hugo](https://gohugo.io/). To build the site for
deployment run `hugo`.

## Development

Run the Hugo server locally to continually build with `hugo server --watch`.

To make the server available to outside devices bind the address with
`hugo server --watch --bind 0.0.0.0`.

## Deployments

This repo has a GitHub Action for continuous deployment which will build the site and
commit to the `gh-pages` branch. To run this process manually run `hugo` which will
write out the compiled site.

