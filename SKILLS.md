# SKILLS.md

Guidance for agents working in this repository.

## Core Rules

- **Prefer WebStorm.** When a JetBrains/WebStorm MCP tool can accomplish the task, use it instead of
  shell commands or generic file tools. Prefer IDE-native navigation, refactoring, builds,
  inspections, and run configurations over text-level equivalents.
- **Do not overwrite existing files.** Always check whether a file exists before writing or creating
  it. If it exists, read it and edit in place instead of replacing it. Never clobber user work.
- **Use Playwright to check after front-end editing.** After changing any front-end code, verify the
  result in a browser with the Playwright MCP tools (navigate, snapshot, console/network checks)
  before considering the task complete.

## Built-in Tools

| Tool        | Description                                                                                                               |
|-------------|---------------------------------------------------------------------------------------------------------------------------|
| `bash`      | Execute shell commands in a persistent session. Use for git, builds, tests, package managers. Prefer `workdir` over `cd`. |
| `read`      | Read files/directories with line numbers. Supports offset/limit and images/PDFs.                                          |
| `write`     | Create or overwrite a file. **Check existence first — do not overwrite existing files.**                                  |
| `edit`      | Exact string replacement in a file. Read the file before editing.                                                         |
| `glob`      | Fast file matching by glob pattern (e.g. `src/**/*.ts`).                                                                  |
| `grep`      | Regex content search with file/line output. Filter with `include`.                                                        |
| `task`      | Launch a subagent (`explore` or `general`) for multi-step research or parallel work.                                      |
| `todowrite` | Maintain a structured task list for multi-step work.                                                                      |
| `question`  | Ask the user a clarifying question with selectable options.                                                               |
| `webfetch`  | Fetch and convert a URL to markdown/text/html.                                                                            |
| `skill`     | Load a specialized skill's instructions into the conversation.                                                            |
| `compress`  | Collapse older conversation ranges into dense summaries for context management.                                           |

## MCP Servers & Tools

### webstorm (JetBrains IDE MCP) — preferred

| Tool                                        | Description                                                         |
|---------------------------------------------|---------------------------------------------------------------------|
| `webstorm_get_all_open_file_paths`          | List paths of all open editor files.                                |
| `webstorm_open_file_in_editor`              | Open a file in the IDE editor.                                      |
| `webstorm_read_file`                        | Read project files, dependencies, and decompiled class/jar sources. |
| `webstorm_create_new_file`                  | Create a new file (optionally with content).                        |
| `webstorm_search_file`                      | Find files by glob within the project.                              |
| `webstorm_search_text`                      | Text search across project files with coordinates.                  |
| `webstorm_search_regex`                     | Regex search across project files with coordinates.                 |
| `webstorm_search_symbol`                    | Semantic symbol search (classes, methods, fields).                  |
| `webstorm_get_symbol_info`                  | Quick-documentation info for a symbol at a position.                |
| `webstorm_analyze_calls`                    | Call hierarchy (incoming/outgoing calls) for a symbol.              |
| `webstorm_rename_refactoring`               | Context-aware project-wide symbol rename.                           |
| `webstorm_reformat_file`                    | Apply IDE formatting to files.                                      |
| `webstorm_apply_patch`                      | Apply Codex/unified-diff patches inside the project.                |
| `webstorm_list_directory_tree`              | Tree view of a project directory.                                   |
| `webstorm_get_file_problems`                | Inspections/errors for a single file.                               |
| `webstorm_lint_files`                       | Lint multiple files (errors/warnings).                              |
| `webstorm_build_project`                    | Build the project or specific files; returns errors.                |
| `webstorm_get_run_configurations`           | List run configurations or discover run points in a file.           |
| `webstorm_execute_run_configuration`        | Run a configuration or a code-location run point.                   |
| `webstorm_execute_terminal_command`         | Run a shell command in the IDE terminal.                            |
| `webstorm_execute_tool`                     | Invoke an IDE MCP tool dynamically.                                 |
| `webstorm_get_project_dependencies`         | List project dependencies and versions.                             |
| `webstorm_get_project_modules`              | List project modules and types.                                     |
| `webstorm_get_repositories`                 | List VCS roots in the project.                                      |
| `webstorm_git_status`                       | Git status for one or more repositories.                            |
| `webstorm_generate_inspection_kts_api`      | Inspection KTS API docs for Java/Kotlin.                            |
| `webstorm_generate_inspection_kts_examples` | Example inspection.kts templates.                                   |
| `webstorm_generate_psi_tree`                | PSI tree for Java/Kotlin snippets.                                  |
| `webstorm_run_inspection_kts`               | Compile and run an inspection.kts against a target file.            |
| `webstorm_list_database_connections`        | List configured DB connections/data sources.                        |
| `webstorm_create_database_connection`       | Create a DB connection.                                             |
| `webstorm_edit_database_connection`         | Edit an existing DB connection.                                     |
| `webstorm_test_database_connection`         | Test a DB connection.                                               |
| `webstorm_list_database_schemas`            | List schemas for a connection.                                      |
| `webstorm_introspect_schema`                | Introspect/refresh schema metadata.                                 |
| `webstorm_list_schema_object_kinds`         | Supported object kinds (table, view, routine, ...).                 |
| `webstorm_list_schema_objects`              | List objects in a schema.                                           |
| `webstorm_get_database_object_description`  | Structure of a table/view/routine.                                  |
| `webstorm_preview_table_data`               | Preview table rows as CSV.                                          |
| `webstorm_execute_sql_query`                | Run a SQL query on a connection.                                    |
| `webstorm_fetch_query_result`               | Page through a previous query result.                               |
| `webstorm_list_recent_sql_queries`          | Recent/running queries for a connection.                            |
| `webstorm_cancel_sql_query`                 | Cancel a running query by session ID.                               |

### filesystem (MCP)

| Tool                                   | Description                                                   |
|----------------------------------------|---------------------------------------------------------------|
| `filesystem_read_text_file`            | Read a file as text (optional head/tail).                     |
| `filesystem_read_multiple_files`       | Read several files in one call.                               |
| `filesystem_read_file`                 | Read full file contents (deprecated; prefer read_text_file).  |
| `filesystem_read_media_file`           | Read image/audio as base64 content block.                     |
| `filesystem_write_file`                | Create/overwrite a file. **Do not overwrite existing files.** |
| `filesystem_edit_file`                 | Line-based edits with git-style diff (supports dryRun).       |
| `filesystem_create_directory`          | Create nested directories.                                    |
| `filesystem_list_directory`            | List directory contents ([FILE]/[DIR]).                       |
| `filesystem_list_directory_with_sizes` | List directory contents with sizes.                           |
| `filesystem_directory_tree`            | Recursive JSON tree of a directory.                           |
| `filesystem_move_file`                 | Move/rename a file or directory.                              |
| `filesystem_search_files`              | Recursively find files/dirs by glob.                          |
| `filesystem_get_file_info`             | File/directory metadata.                                      |
| `filesystem_list_allowed_directories`  | Directories this server may access.                           |

### playwright (MCP)

| Tool                                  | Description                                          |
|---------------------------------------|------------------------------------------------------|
| `playwright_browser_navigate`         | Navigate to a URL.                                   |
| `playwright_browser_navigate_back`    | Go back in history.                                  |
| `playwright_browser_snapshot`         | Accessibility snapshot (preferred over screenshots). |
| `playwright_browser_find`             | Search the snapshot for text/regex.                  |
| `playwright_browser_click`            | Click an element.                                    |
| `playwright_browser_type`             | Type text into an editable element.                  |
| `playwright_browser_fill_form`        | Fill multiple form fields.                           |
| `playwright_browser_select_option`    | Select dropdown option(s).                           |
| `playwright_browser_hover`            | Hover an element.                                    |
| `playwright_browser_drag`             | Drag and drop between elements.                      |
| `playwright_browser_drop`             | Drop files/data onto an element.                     |
| `playwright_browser_file_upload`      | Upload file(s) via file chooser.                     |
| `playwright_browser_press_key`        | Press a keyboard key.                                |
| `playwright_browser_handle_dialog`    | Accept/dismiss a dialog.                             |
| `playwright_browser_wait_for`         | Wait for text to appear/disappear or time to pass.   |
| `playwright_browser_evaluate`         | Evaluate JS on the page or an element.               |
| `playwright_browser_run_code_unsafe`  | Run arbitrary Playwright code (RCE-equivalent).      |
| `playwright_browser_take_screenshot`  | Capture a screenshot (css/device scale).             |
| `playwright_browser_resize`           | Resize the browser window.                           |
| `playwright_browser_console_messages` | Retrieve console messages.                           |
| `playwright_browser_network_requests` | List network requests.                               |
| `playwright_browser_network_request`  | Full details of one request.                         |
| `playwright_browser_tabs`             | List/create/close/select tabs.                       |
| `playwright_browser_close`            | Close the page.                                      |

### context7 (MCP)

| Tool                          | Description                                         |
|-------------------------------|-----------------------------------------------------|
| `context7_resolve-library-id` | Resolve a library name to a Context7-compatible ID. |
| `context7_query-docs`         | Fetch up-to-date docs/code examples for a library.  |

### gh_grep (MCP)

| Tool                   | Description                                                 |
|------------------------|-------------------------------------------------------------|
| `gh_grep_searchGitHub` | Search real-world code patterns across public GitHub repos. |

### MCP resources

| Tool                          | Description                                      |
|-------------------------------|--------------------------------------------------|
| `list_mcp_resources`          | List resources exposed by connected MCP servers. |
| `list_mcp_resource_templates` | List parameterized resource templates.           |
| `read_mcp_resource`           | Read a resource by server + URI.                 |

## Workflow

1. **Explore** with `webstorm_search_symbol` / `webstorm_search_text` /
   `webstorm_list_directory_tree` before reaching for shell.
2. **Understand** with `webstorm_analyze_calls` and `webstorm_get_symbol_info`.
3. **Edit** with `webstorm_apply_patch` or `edit`; never overwrite existing files.
4. **Verify** with `webstorm_lint_files` / `webstorm_get_file_problems` / `webstorm_build_project`.
5. **Run** via `webstorm_get_run_configurations` + `webstorm_execute_run_configuration`.
