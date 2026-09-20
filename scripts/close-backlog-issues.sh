#!/usr/bin/env bash
# Closes and labels the GitHub issues handled by the 2026-09 backlog work
# (branch fix/backlog-2026-09) and opens the tracking issues for the epics.
#
# Run it AFTER the branch is merged into master, with the gh CLI logged in:
#   gh auth login
#   DRY_RUN=0 scripts/close-backlog-issues.sh
# Without DRY_RUN=0 it only prints what it would do.
set -euo pipefail

REPO="TonyGermaneri/canvas-datagrid"
DRY_RUN="${DRY_RUN:-1}"
BRANCH_NOTE="Handled on branch \`fix/backlog-2026-09\` (see CHANGELOG \"Unreleased\"). Ships in the next release."

run() {
  if [ "$DRY_RUN" = "0" ]; then "$@"; else printf '[dry-run] %q ' "$@"; echo; fi
}

close_with() { # issue comment
  # comment first: it also works on issues GitHub already auto-closed from
  # the "Fixes #N" keywords in the commits and the pull request
  run gh issue comment "$1" --repo "$REPO" --body "$2" || true
  run gh issue close "$1" --repo "$REPO" || true
}

label() { # issue labels...
  local n="$1"; shift
  run gh issue edit "$n" --repo "$REPO" --add-label "$*" || true
}

echo "== labels"
for l in "confirmed:Bug confirmed against source" "needs-repro:Could not reproduce yet; needs a browser reproduction" \
         "epic:Tracking issue for a group of related requests" "docs:Documentation" "enhancement:Feature request"; do
  run gh label create "${l%%:*}" --repo "$REPO" --description "${l#*:}" --force || true
done

echo "== fixed on the branch"
FIXED="587 458 583 444 448 193 160 530 503 431 460 263 418 226 554 566 256 328 230 567 574 \
514 472 473 338 455 237 289 239 311 512 549 250 157 521 \
540 568 562 563 548 509 335 577 520 517 385 351 360 576 262 242 \
474 552 116 248 254"
for n in $FIXED; do
  close_with "$n" "Fixed. $BRANCH_NOTE Each fix has a regression test in \`test/regressions.js\` or \`test/needs-repro.js\` named after the issue."
done

echo "== already fixed on master, verified with a test"
declare -A VERIFIED=(
  [518]="Fixed in 0.4.7 (f36f904). A regression test for pasting with reordered columns is part of the suite."
  [559]="Fixed in 0.4.7 by #560 (clearing uses the view row index)."
  [469]="Fixed in 0.4.1 by #470."
  [209]="Double-clicking a header border calls fitColumnToValues, which dispatches resizecolumn."
  [190]="Grouped column headers shipped in 0.4.0 (#443)."
  [249]="Use \`grid.viewData\` for the filtered and sorted rows and \`grid.data\` (or \`grid.boundData\`) for the unfiltered data."
  [241]="Verified with a test: data appended while a filter is active is shown once the filter is cleared."
  [215]="Verified with a test: filters are re-applied to replaced data; \`setFilter()\` with no arguments clears them all."
  [264]="The ascending arrow now points up (see drawOrderByArrow)."
  [506]="Verified with a test on current master: pasting a single cell with an earlier hidden column lands in the clicked cell."
  [98]="Verified with a test on current master: height auto plus a horizontal scroll bar does not add a vertical scroll bar."
  [253]="Verified with a test on current master: gotoCell brings the target column and row into view."
  [228]="Verified with a test on current master: ArrowUp returns to row 0 and scrolls to the top."
  [127]="Verified with a test on current master: non-Latin text edits are stored and drawn."
  [272]="Verified with a test on current master: getCellAt over a frozen row returns the frozen row."
  [313]="Verified with a test on current master: the edit input follows scrolling. gotoCell no longer re-applies its target a frame later, which could undo a scroll made right after beginEditAt."
)
for n in "${!VERIFIED[@]}"; do close_with "$n" "${VERIFIED[$n]} $BRANCH_NOTE"; done

echo "== duplicates"
close_with 573 "Duplicate of #100 (merged cells)."
close_with 424 "Duplicate of #100 (merged cells)."
close_with 224 "Duplicate of #314 (treeHorizontalScroll is documented as reserved/not implemented for now)."

echo "== answered / not an issue"
close_with 580 "Yes. The open backlog was audited in September 2026, every open PR was merged and about sixty issues were fixed or verified on \`fix/backlog-2026-09\`."
close_with 511 "Closing: not an issue with the library."
close_with 471 "Closing: not an issue with the library. The three items (#472, #473, #474) are fixed."
close_with 349 "IE11 support was dropped in 0.3.2; the browserslist target is \`defaults, not IE 11\`. The v0.24.x patch branch remains available for anyone who needs it."
close_with 96 "Closing: documentation internationalisation is not planned."
close_with 77 "Closing: moving sort/filter to a worker is not planned; sorting and filtering are synchronous by design so the API stays simple."
close_with 575 "Row drag-and-drop already exists: set \`allowRowReordering: true\` and drag the row header."
close_with 516 "Out of scope for the grid. \`grid.data\` (unfiltered) or \`grid.viewData\` (as displayed) can be handed to SheetJS, jsPDF or similar."
close_with 362 "\`style.width\`/\`style.height\` are the grid's own styles (100% or px). Set them after creating the grid or through \`style\` in the constructor; the parent must have a size for percentages to work. The docs now cover sizing in Getting started."
close_with 290 "\`grid.fitColumnToValues(name)\` (or with no argument for every column) sizes a column to its values including the header; \`autoResizeColumns: true\` does it automatically."
close_with 337 "Thanks. The scrolling item was #313 (verified fixed), innerHTML rendering and the third-level tree grid are tracked in the tree grid epic."
close_with 186 "The documentation site with runnable examples (Docusaurus) replaced the old demo page."

echo "== epics"
create_epic() { # title body issues...
  local title="$1" body="$2"; shift 2
  local url
  if [ "$DRY_RUN" = "0" ]; then
    url=$(gh issue create --repo "$REPO" --title "$title" --label epic --body "$body") || return 0
    echo "created $url"
  else
    echo "[dry-run] create epic: $title"; url="<epic-url>"
  fi
  for n in "$@"; do
    close_with "$n" "Consolidated into the tracking issue $url so the related requests are planned together."
  done
}
create_epic "Epic: spreadsheet-parity UX" "Consolidates the November 2021 design requests: select-all modes, ctrl-selection semantics, move a range by dragging, entering data within a selection, text overflow/wrapping modes, protected ranges, tagged ranges/tables, external objects, mouseDown vs mouseUp selection timing, copy/paste customisation, zoom, move styles." \
  438 437 436 435 434 433 429 428 427 423 422 421 415 414 413 408 231 459
create_epic "Epic: frozen panes" "Bugs reported around the 0.4.4 frozen markers: marker hidden while dragging (#479), freeze line on scrolled content (#525), freeze pane swapping columns (#439), freezing all columns hides headers (#463). Needs browser reproductions on current master; getCellAt over frozen rows is verified working (#272)." \
  479 525 439 463
create_epic "Epic: tree grid" "Child grid improvements: more tree examples (#187), connecting lines (#128), context menu overlap on parent rows (#210), third-level scroll input position (#33), child grid spawning refactor (#102), treeHorizontalScroll (#314)." \
  187 128 210 33 102 314
create_epic "Epic: touch and mobile" "Safari mobile scrolling performance (#139), iPad touch release animation (#206), zoom scrolling the location (#87), touch resize/reorder handles (#51)." \
  139 206 87 51
create_epic "Epic: performance" "Column selection on very large data sets (#425; the selection model was rewritten in 0.4.6), drag overlay latency (#417)." \
  425 417
create_epic "Epic: data model" "DataProvider interface / virtualised data (#145, #346), force canvas mode without web components (#320), unify style/attribute setters (#169), cell/header class and style objects (#142)." \
  346 145 320 169 142
create_epic "Epic: TypeScript" "dist/types.d.ts is now a module with a smoke test, but the generated declarations still have internal errors (skipLibCheck needed) and instance methods are inferred from JSDoc. Track the migration and declaration clean-up (#347)." \
  347
create_epic "Epic: editing features" "Undo/redo (#581), merged cells (#100), loading state (#131), filter icon (#81), crisp 1px lines (#315), print view (#101)." \
  581 100 131 81 315 101
create_epic "Epic: test debt" "Thirteen tests are still skipped (five touch, three scrolling, two public-interface, two attributes, one context-menu) and the resizeAfterDragged column test fails; un-skip or rewrite them and add a coverage threshold (#58)." \
  58

echo "== still open: needs a browser reproduction"
for n in 475 406 416 430 321 149 84 97; do label "$n" needs-repro; done
echo "done"
