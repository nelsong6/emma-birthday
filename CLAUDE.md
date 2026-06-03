# emma-birthday

Static birthday book for Emma at `birthday.emma.romaine.life`. A friend's
birthday gift: a few full-screen photo pages turned like a book, with looping
background audio. Intentionally tiny and low-stakes — tested against prod.

Served from AKS (namespace `emma-birthday`) by a Node+Express container that
static-serves `frontend/` (no frontend build step). The shared Envoy Gateway +
cert-manager + external-dns provide routing, TLS, and DNS. The GitHub repo,
Azure AD identity, AcrPush, and the ArgoCD Application live in
`romaine-life/infra-bootstrap` (`tofu/main.tf` app module + `k8s/apps/emma-birthday.yaml`).

## Layout

- `frontend/` — `index.html`, `styles.css`, `app.js`, plus `images/` and
  `audio/`. Content is data-driven by `frontend/pages.js` (page list +
  audio filename) so non-code edits don't touch app logic.
- `backend/server.js` — minimal Express: `/health` + static serve of
  `frontend/`.
- `k8s/` — Helm chart (`Chart.yaml`, `values.yaml`, `templates/`): Deployment,
  Service, ServiceAccount (`infra-shared`), Certificate, XListenerSet,
  HTTPRoute. All hostnames are `birthday.emma.romaine.life`.
- `.github/workflows/build-and-deploy.yaml` — build → ACR push → `sed`
  image-tag bump on `k8s/values.yaml` committed back to main → ArgoCD deploys
  → release tag. Mirrors my-homepage.

## Conventions

- Audio autoplay is gated behind the "Tap to begin" cover (browser policy).
- Photos must be resized before committing (phone originals bloat the repo +
  image). See `frontend/images/README.md`.
- Pod is static-only; no Azure SDK calls, so workload identity isn't needed —
  the `infra-shared` ServiceAccount is kept only for pattern consistency.
