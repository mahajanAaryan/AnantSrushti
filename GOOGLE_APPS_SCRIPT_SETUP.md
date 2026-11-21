# Connect booking inquiries to Gmail

The site is static, so Google Apps Script is used as the email sender. Booking details are emailed by Google to `shrushtianant@gmail.com`.

## One-time Google setup

1. Create or use a dedicated Google account for sending website inquiries, then sign in to it and open [script.google.com](https://script.google.com/). The script will send as this account and deliver inquiries to `shrushtianant@gmail.com`.
2. Create a new project, replace the contents of `Code.gs` with the contents of `google-apps-script/Code.gs`, and save.
3. Choose **Deploy → New deployment → Web app**. Set **Execute as** to **Me** and access to **Anyone**, then deploy and approve Google's Mail permission prompt.
4. Copy the Web app URL ending in `/exec`.
5. Paste that URL into `BOOKING_EMAIL_ENDPOINT` near the top of `assets/js/main.js`, between the quotes, and publish the site files. (This project has already been connected to the deployment URL provided.)

The public access setting lets guests submit without signing in. The script sends the booking details using Google's send-only `MailApp` service; it cannot read the sender account's inbox. A hidden honeypot filters basic bot submissions, but a dedicated sender account helps isolate the risk because the public endpoint can still be abused to send unwanted mail. After setup, submit one test inquiry and confirm the message arrives in the Gmail inbox (and check Spam if needed).


Until the endpoint URL is added, the booking form clearly tells visitors to call or WhatsApp instead of claiming that their inquiry was sent.

