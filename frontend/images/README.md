# Photos

Drop Emma's birthday photos here, named to match `frontend/pages.js`
(e.g. `01.jpg`, `02.jpg`, ...).

**Please resize before committing.** Phone photos are often 4–12 MB each;
that bloats the git repo and the container image. Aim for max ~2000px on the
long edge and < ~600 KB each. Quick options:

```sh
# macOS (sips, built in) — resize a copy to 2000px long edge:
sips -Z 2000 IMG_1234.jpg --out 01.jpg

# ImageMagick:
magick IMG_1234.jpg -resize 2000x2000\> -quality 82 01.jpg
```
