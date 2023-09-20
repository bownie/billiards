module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          minify: {
            compress: false,
            mangle: false,
            format: { comments: "all" },
          },
        },
      },
    ],
    "^.+\\.html?$": "jest-html-loader",
  },
  coveragePathIgnorePatterns: ["node_modules", "gltf.ts"],
  coverageReporters: ["text", "json"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    ".*GLTFExporter": "<rootDir>/test/mocks/gltfexporter.ts",
    ".*GLTFLoader": "<rootDir>/test/mocks/gltfloader.ts",
    ".*/sound": "<rootDir>/test/mocks/mocksound.ts",
  },
}
