function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies['hash-base']) {
    pkg.dependencies['hash-base'] = 'github:asoltys/hash-base'
  }
  if (pkg.dependencies && pkg.dependencies['cipher-base']) {
    pkg.dependencies['cipher-base'] = 'github:asoltys/cipher-base'
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}
