## What
New landing page for cold email campaign traffic at `/get-started`.

## Changes
- New page: `app/(default)/get-started/page.tsx` (560 lines)
- Dark theme (bg-gray-950) matching cold email landing page design
- YouTube video embed (0jUQf0cS7L0)
- Sections: Hero, Problem/Agitation, The System (4-step flow), Case Studies, About Austin, Fit/Not Fit, Market Exclusivity, Booking CTA
- noindex/nofollow (cold email traffic only)
- Mobile responsive

## TODOs
- [ ] Add Austin's headshot to About section (placeholder currently)
- [ ] Replace Calendly placeholder with actual booking link
- [ ] Verify Tailwind classes match existing theme config

## Testing
- `npm run dev` then visit `http://localhost:3000/get-started`
