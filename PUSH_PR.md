# Push & Create PR

The landing page is committed on branch `feature/cold-email-landing-page`.
Run these commands to push and create the PR:

```bash
# 1. Push the branch
git push origin feature/cold-email-landing-page

# 2. Create the PR (requires gh CLI authenticated)
gh pr create \
  --title "Add cold email landing page at /get-started" \
  --body "## What

Adds a dedicated cold email landing page at \`/get-started\` for driving traffic from outbound campaigns.

### Features
- **Dark theme** (bg-gray-950) standalone landing page
- **YouTube video embed** (ID: 0jUQf0cS7L0) in the hero section
- **noindex/nofollow** meta — isolated from SEO
- Full conversion funnel: Hero → Problem/Agitation → System Overview → Case Studies → About Austin → Qualifier → Market Exclusivity → Booking CTA
- Uses existing \`(default)\` layout (Header + Footer + AOS animations)
- Responsive design with scroll animations via AOS \`data-aos\` attributes

### Route
\`/get-started\` — intended for cold email CTAs only

### TODOs
- [ ] **Austin's headshot**: Add photo to \`/public/images/austin-wilson.jpg\` and uncomment the \`<Image>\` component in the About section (placeholder SVG currently shown)
- [ ] **Booking link**: Replace the placeholder CTA href with the actual Calendly/GHL booking link (currently points to \`/qualify\`)
- [ ] **Optional**: Consider a dark-mode variant of the site header for this page, since the default header has light-colored text

### Testing
Visit \`/get-started\` after deploy. Verify:
1. Video plays correctly
2. All sections render with dark theme
3. CTA buttons scroll to #booking section
4. Page is not indexed (check robots meta tag)
" \
  --base main
```

Delete this file after PR is created — it's not meant to be committed.
