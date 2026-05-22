const version = process.versions.node
const [major, minor] = version.split('.').map(Number)

const isSupported =
  (major === 20 && minor >= 19) ||
  major === 22 ||
  major === 24

if (!isSupported) {
  console.error(
    [
      `Unsupported Node.js version: ${version}.`,
      'Use Node.js 20.19+, 22.x, or 24.x for this project.',
      'The current toolchain crashes on Node.js 25 before Vite can print a useful error.'
    ].join(' ')
  )
  process.exit(1)
}
