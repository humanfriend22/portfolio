// Where an image name typed in front matter or Markdown is looked for, best match first. `dir` is the
// project-relative folder of the file that mentions it (src/content/projects/deda). Extensions are optional.
export const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg'];
export const GLOBAL_IMAGES = 'src/content/images';

export function imageCandidates(name, dir) {
  const bare = name.replace(/^\.\//, '');
  return [`${dir}/${bare}`, `${dir}/images/${bare}`, `${GLOBAL_IMAGES}/${bare}`].flatMap((base) => [
    base,
    ...IMAGE_EXTS.map((ext) => `${base}.${ext}`),
  ]);
}
