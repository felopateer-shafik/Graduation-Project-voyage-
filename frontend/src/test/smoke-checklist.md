# Voyage Browser Smoke Checklist

Run this checklist on desktop and mobile widths after each gated phase:

- Home: hero loads, navbar search resolves known countries/cities, and hero flight search opens matching results.
- Explore: category filters work, query strings filter or resolve, and every landmark card opens a detail page.
- Auth: register, resend OTP, verify, login, `/auth/me`, logout, and protected route redirects behave as expected.
- Checkout: wallet and card payment confirmations use backend totals and show EGP only.
- Profile: wallet, loyalty tier, redemption, avatar controls, and history render useful loading/error/empty states.
- Wishlist: add, duplicate add, remove, clear all, refresh persistence, and unauthenticated redirect work.
- Search: flights, hotels, tours, packages, map, deals, and support have no blank panels, overflow, or dead controls.

