# Oren Herbalist Website

A static Hebrew website for Oren Herbalist with dedicated pages for treatments,
products, workshops, and educational videos.

## Local preview

Run `python3 -m http.server 8000 --bind 127.0.0.1`, then open
`http://localhost:8000/index.html`.

Add `?feedback=1` to any page URL to enable the private feedback interface.

## Contact form

The homepage contact form uses FormSubmit to send enquiries to
`liora1018@gmail.com`. Name, email, and message are required; phone is optional.
The form uses a standard POST with CAPTCHA enabled and `_autoresponse` configured
to send the visitor a Hebrew confirmation and a copy of their submission.
FormSubmit does not support autoresponses for AJAX forms or with CAPTCHA disabled:
<https://formsubmit.co/documentation>.

Visitors complete verification and see the result on FormSubmit. The site does
not show a premature success message, clear the entered fields, or automatically
retry. Returning with Back restores the submit button. A direct email link is
also available; messages sent through that link bypass the form confirmation.

Before relying on the form in production, submit a clearly labelled test from the
hosted website, open FormSubmit's activation email in the recipient inbox, and
activate the form if prompted. Check Spam as well. Then submit another test and
complete CAPTCHA and confirm that both the recipient email and the sender's copy
arrive, and that Reply on the recipient email addresses the visitor. Browser checks
with simulated responses cannot verify activation or inbox delivery.

If the recipient changes, update the form's `action` and direct email link in
`index.html`, then activate the new address. FormSubmit setup
and activation help: <https://formsubmit.co/help>.
