# launch

From the project root, run:

```bash
bundle exec jekyll serve --host 127.0.0.1 --livereload --force_polling
```

- **`--force_polling`**: macOS + Cursor/VS Code often miss native file events; polling makes rebuilds reliable so LiveReload can fire.
- **`--host 127.0.0.1`**: open the site at **http://127.0.0.1:4000/** (not `localhost` only) so the injected LiveReload script loads `livereload.js` from the same host.

Leave the terminal open. In the Jekyll log you should see **LiveReload: Browser connected** after a normal browser tab loads the page. Use a regular browser window (Chrome/Safari/Firefox); embedded/simple preview panes sometimes block WebSockets.

Stop with Ctrl+C.

This command will be available in chat with /launch
