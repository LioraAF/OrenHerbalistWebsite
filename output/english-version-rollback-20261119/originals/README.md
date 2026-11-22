# Oren Herbalist Website

A static Hebrew website for Oren Herbalist with dedicated pages for treatments,
products, workshops, and educational videos, plus a Vercel contact endpoint.

## Local preview

Run `python3 -m http.server 8000 --bind 127.0.0.1`, then open
<http://127.0.0.1:8000/>. After changing gallery folders, run
`node scripts/gallery-folders.cjs` and refresh the page.

This previews static pages only; it cannot run `/api/contact`. Until the endpoint
is available, the form suggests contacting via WhatsApp. Add `?feedback=1` to
any page URL for the private feedback interface.

## Temporary Drive video library

The 37 shared Drive videos are listed in `js/drive-videos.js`; their thumbnails
are stored in `images/video-thumbnails/`. They appear alongside the existing
YouTube videos, 12 at a time. Drive playback loads only when a card is opened.
Keep the Drive files viewable by anyone with the link for public playback.
Titles and topics are editable working labels based on the visible thumbnails.
To migrate an entry to YouTube, fill its `youtubeId` with the YouTube video ID;
the player and external viewing link then switch automatically.

## Gallery image folders

| Folder | Where the images appear |
| --- | --- |
| `images/home-gallery/` | Home page’s two rotating story photos |
| `images/main-gallery/` | Home page’s wide product photo section |
| `images/treatment-gallery/` | Treatment page’s two photo sections |
| `images/products/gallery/` | Products page’s rotating gallery |
| `images/products/gifts/` | Products page’s gift gallery |
| `images/workshops/` | Adult workshops gallery and rotating workshop photo sections; the page header keeps its chosen fixed image |
| `images/workshops-kids/` | Kids gallery; the large kids section photo keeps its chosen fixed image |
| `images/backup/` | Storage only; excluded from every gallery |

Every image directly inside each gallery folder is included. Subfolders, hidden
files, and non-images are ignored. Supported formats: JPG, JPEG, PNG, WebP, AVIF,
GIF, and SVG. Filenames may include Hebrew and spaces. Empty folders show no
photos and disable their gallery controls. A missing folder behaves as empty.

Move a photo into `images/backup/` to exclude it without deleting it. A photo
copied into multiple gallery folders appears in each; removing one copy affects
only that gallery. No automatic curation or duplicate removal is performed.

`images/products/main/` and `images/products/hover/` contain individually assigned
product-card photos, rather than galleries; keep their existing filenames when
replacing a card photo. Branding, icons, backgrounds, profile photos, and video
thumbnails also retain their individual assignments.

Vercel automatically runs `node scripts/gallery-folders.cjs` before deployment to
regenerate `js/gallery-images.js`. Folder changes affect the live public site
after deployment. To refresh the generated file manually, run that same command.

## Contact email setup: Resend and Vercel

The contact form posts to `/api/contact`, a Vercel Node.js function. It submits two
separate messages to Resend: the enquiry to `liora1018@gmail.com`, and a Hebrew
confirmation containing the same submitted details to the visitor. Replies to
an enquiry go to the visitor; replies to a confirmation go to Liora's Gmail.
The sending address defaults to `contact@orenherbalist.com`; this does not create
an inbox at that address. FormSubmit is no longer used.

### 1. Verify the sending domain

1. Create a free account at <https://resend.com/signup>.
2. In Resend, open **Domains**, choose **Add domain**, and enter
   `orenherbalist.com`. Use the sending setup; leave inbound receiving disabled.
3. If Resend offers **Auto Configure**, use it to connect Vercel and add the
   required sending records automatically. Otherwise use the manual steps below.
   Resend shows the exact DNS records for the domain. Keep this page open.
4. Open Vercel's **Domains** area, select `orenherbalist.com`, and open its DNS
   records. Add each required sending record from Resend, matching its type,
   name, value, and MX priority where shown. Keep existing records. In particular,
   do not replace the root domain's existing mail MX records or website records.
5. Return to Resend and choose **Verify DNS Records**. Wait until it shows
   **Verified** before testing real delivery.

The values are account-specific; copy them from the Resend dashboard.
Official guide: <https://resend.com/docs/guides/dns/vercel>.

### 2. Create a sending key

In Resend, open **API Keys** and create a key named `Oren website`, with
**Sending access**, restricted to `orenherbalist.com`. Store it directly in
Vercel as `RESEND_API_KEY` below. Do not put it in chat, Git, HTML, or browser JS.
Guide: <https://resend.com/docs/dashboard/api-keys/introduction>.

### 3. Configure the on-page spam check

The endpoint requires Cloudflare Turnstile verification before sending either
email. Turnstile has a free plan and can be used with a Vercel-hosted domain;
there is no need to move DNS to Cloudflare.

1. Open <https://dash.cloudflare.com/>, create/sign in to a free account, and open
   **Turnstile**.
2. Add a widget named `Oren contact`, with **Managed** mode.
3. Add the hostnames `orenherbalist.com` and `www.orenherbalist.com`.
4. Copy the widget's **Site key** and **Secret key** into Vercel as described below.
   The site key is public; the secret key stays on the server.

Guide: <https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/>.

### 4. Set Vercel environment variables

Open the website project in Vercel, then **Settings → Environment Variables**.
Add these for **Production** (and Preview only if intentionally testing there):

| Name | Value |
| --- | --- |
| `RESEND_API_KEY` | The private Resend sending key |
| `CONTACT_FROM_EMAIL` | `contact@orenherbalist.com` |
| `TURNSTILE_SITE_KEY` | The public Turnstile site key |
| `TURNSTILE_SECRET_KEY` | The private Turnstile secret key |

The environment variable names and placeholders are also in `.env.example`.
Real `.env` files and `.vercel` configuration are ignored by Git. The endpoint
returns only the public site key to the browser. Missing configuration disables
sending and suggests contacting via the WhatsApp button.

Production requests are accepted only from `https://orenherbalist.com` and
`https://www.orenherbalist.com`. For a trusted preview or local Vercel dev server,
set `CONTACT_ALLOWED_ORIGINS` to its exact origin (comma-separated for multiple
origins), and add its hostname to the Turnstile widget. Do not use wildcards.
A plain Python static server cannot run the function.

### 5. Deploy and verify real delivery

Deploy this code to the existing Vercel website project after configuring the
variables. Environment variable changes require a new deployment. The build
command in `vercel.json` generates the workshop gallery; the Node.js function in
`api/` requires no npm dependencies.

1. Open the contact form on `https://orenherbalist.com`.
2. Complete the on-page check, enter a clearly labelled test message using an
   inbox you can check, and submit once.
3. Confirm that the enquiry arrives at `liora1018@gmail.com` and the copy arrives
   at the sender's address. Check Spam as well.
4. Confirm that **Reply** from each email addresses the intended recipient.
5. In Resend's email logs, verify both messages' delivery status. API acceptance
   is not proof of inbox delivery. Account/domain verification or limits can
   still prevent sending; resolve those in Resend before relying on the form.

## Validation and behavior

Run `node --test tests/contact.test.cjs` for backend tests with simulated external
services. These tests send no email and do not verify DNS, account approval, or
live delivery. Browser verification likewise uses simulated provider responses.

Name, email, and message are required; phone is optional. Server validation,
honeypot filtering, explicit origin checks, and verified Turnstile tokens protect
the endpoint. Consider an additional Vercel Firewall rate limit on POST requests
to `/api/contact` if traffic or abuse increases.

The page stays in place and clears fields only after Resend accepts both emails.
On a failure it retains the message and asks the visitor to verify again before
retrying. During sending, fields cannot be edited and duplicate clicks are blocked.
Retries reuse an idempotency key for the same enquiry within Resend's 24-hour
window; there are no automatic retries. The floating WhatsApp button remains available as another way to get in touch.
