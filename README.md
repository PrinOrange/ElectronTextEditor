## Cross platform Text-Editor with Electron React

## Usage

Please install dependencies first

```bash
npm install
```

Package build for current platform:

```bash
npm run package
````

Can also be packaged and built for other platforms

````
npm run package -- --mac
npm run package -- --linux
````

Note: Cross-platform packaging builds need to be submitted to https://service.electron.build , but this website has been crashed down, so there may be some problems with cross-platform packaging. Therefore, it is recommended to switch to the corresponding platform to package. You can use WSL packaging in Windows platform.

## License

MIT © [Carbland](./LICENSE)
