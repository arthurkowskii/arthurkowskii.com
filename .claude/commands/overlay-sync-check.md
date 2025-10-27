# Overlay Sync Check - Verify Dual Rendering System

Command to verify that project pages and overlay system stay synchronized after changes.

## Usage
```bash
/overlay-sync-check [project-slug]
```

## Actions
1. Check project page renders correctly at `/projects/[slug]`
2. Verify overlay opens and displays same content when electron clicked
3. Test asset loading in both contexts (page vs overlay)
4. Validate bento layout works in both rendering modes
5. Check for content discrepancies between page and overlay
6. Verify navigation and URL handling

## Critical Checks
- **Content Consistency**: Same text, images, layout in both contexts
- **Asset Loading**: Videos, images load properly in overlay
- **Interactive Elements**: Buttons, links work in overlay mode
- **Styling**: CSS applies correctly in both contexts
- **Performance**: Overlay opens smoothly without lag

## When to use
- After updating any project markdown file
- After modifying ProjectBento component
- After changing asset references or paths
- Before committing project content changes
- When troubleshooting overlay display issues