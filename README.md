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
          project-file: examples/kanban-project/project.md
          issues-directory: examples/kanban-project/ISSUES

```

## Inputs

| Input Name | Required | Default | Description |
|---|---|---|---|
| `github-token` |  |  | The GitHub token used to create an authenticated client |
| `project-file` | no |  | Path to a markdown file. Front matter content can be used to set project name, description and columns. If either a vaild file path or project-name is given, a project will be created. |
| `project-name` | no |  | Name to use for project. If a vaild file path or project-name is given, a project will be created. |
| `project-description` | no |  | Description to use for the project. |
| `column-names` | no | 'To Do' | Column names to create and add issues to. Can be either a single name to create one column, or list of names to create multiple columns. |
| `issues-directory` | no | '.github/ISSUES/' | Relative path to look for issue files. |

## Similar Projects

If you just need to create a single issue there is [JasonEtco/create-an-issue](https://github.com/JasonEtco/create-an-issue).
