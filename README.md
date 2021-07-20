# Create Issues Action

A GitHub Action that creates new issues from files in a directory.

## Usage

```yaml
name: Create Issues

on:
  create:

jobs:
  create:
    name: Create project and issues
    runs-on: ubuntu-latest
    if: ${{ github.ref == 'refs/heads/new-branch' }}
    steps:
      - uses: actions/checkout@v2

      - name: Create issues
        uses: markpatterson27/create-issues@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

```

## Inputs

| Input Name | Required | Default | Description |
|---|---|---|---|
| `github-token` |  |  | The GitHub token used to create an authenticated client |

## Similar Projects

If you just need to create a single issue have a look at [JasonEtco/create-an-issue](https://github.com/JasonEtco/create-an-issue).
