const generateUniquePublicId = (filename) => {
    return `${filename}-${Date.now().toString().slice(-6)}`
}

module.exports = generateUniquePublicId;