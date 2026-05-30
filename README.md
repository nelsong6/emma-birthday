# emma-birthday

A little birthday book for Emma, at **https://birthday.emma.romaine.life**.

A handful of full-screen photo "pages" you turn through, with looping
background music. Tap **Tap to begin** to start (that first gesture also
unlocks audio, which browsers block until the user interacts).

## Making it yours

Everything you'll want to edit lives in `frontend/`:

1. **Photos** → drop resized images into `frontend/images/` (see the note in
   that folder — please downsize phone photos first).
2. **Pages** → edit `frontend/pages.js`: one entry per page, with optional
   `image`, `title`, and `text`. Add/remove/reorder freely.
3. **Music** → drop a track into `frontend/audio/` and set its filename in
   `pages.js` (`window.BIRTHDAY_AUDIO`). Set to `''` to disable audio.

No build step — `frontend/` is served as-is.

## Run locally

```sh
cd backend && npm install && node server.js
# open http://localhost:3000
```

## How it's hosted

Served from AKS (namespace `emma-birthday`) by a tiny Node+Express container
that static-serves `frontend/`, behind the shared Envoy Gateway. DNS
(`birthday.emma.romaine.life`) is created by external-dns from the HTTPRoute
hostname, and cert-manager issues the TLS cert. The repo, Azure identity, and
ArgoCD wiring live in `nelsong6/infra-bootstrap`.

Push to `main` → GitHub Actions builds the image, pushes to ACR, bumps the
tag in `k8s/values.yaml`, and ArgoCD deploys it.
