const path = require('path')

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['encrypted-tbn0.gstatic.com', 'images.unsplash.com', 'ik.imagekit.io', 'localhost'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
