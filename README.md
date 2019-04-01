# Optimizely Integration Prototype

## Configuration

1. Install extension to the space

```bash
contentful use space <space-id>
yarn extension:create
yarn extension:local
```

2. Serve the extension from localhost

```bash
yarn serve
```

3. Provide Optimizely API Token and projectId

- Go to `Settings` -> `Extensions` -> `Optimizely Extension` in the web app and fill in missing required fields.
- API Token should be generated on Optimizely website in `Profile` -> `API Access` section.
- Project ID can be found in URL on project page: `v2/projects/<project id>/experiments`

4. Add new `experiment` field to `Call to Action` content model.