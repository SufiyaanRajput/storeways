const getConfig = () => ({
  plugins: [
    {
			key: 'storage',
      resolve: `./storage/LocalFileStorage`,
      options: {
        uploadDir: "uploads", // relative to your project root
      },
    },
  ],
});

export default getConfig;