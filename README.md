# Create Issues Action

[![units-test](https://github.com/markpatterson27/create-issues/actions/workflows/test.yml/badge.svg)](https://github.com/markpatterson27/create-issues/actions/workflows/test.yml)

A GitHub Action that creates new issues from template files in a directory. An issue will be created for each valid file found in the directory. Front matter attributes in each file can be used for issue settings.

A project can be optionally created, that the issues are then added to. Project details can be provided either from a file with front matter attributes, or from action inputs. Action inputs will override file contents.

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
      - uses: actions/checkout@v3

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
| `column-names` | no | 'To Do' | Project column to create and add issues to. Can be either a single name to create one column, or list of names to create multiple columns. |
| `issues-directory` | no | '.github/ISSUES/' | Relative path to look for issue files. |

## Outputs

There are no action outputs.

## Similar Projects

If you just need to create a single issue there is [JasonEtco/create-an-issue](https://github.com/JasonEtco/create-an-issue).
