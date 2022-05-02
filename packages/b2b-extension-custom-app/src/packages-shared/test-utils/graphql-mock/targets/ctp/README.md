# Schema for CTP target in MC

`schema.graphql` contains the Types exposed by CTP API. Every time that the API has introduced new Types, Queries or Mutations, we need to update our local `schema.graphql`

### Pre-requisite

##### Install `graphql-cli`

```bash
❯ npm i -g graphql-cli
```

##### Copy `graphqlconfig-template` to `.graphqlconfig`

```bash
❯ cp graphqlconfig-template .graphqlconfig
```

##### Create an API client and retrieve an OAuth token for project `test-with-empty-data-95`

1. you'll find the UI to create an API client under `Settings -> Developer Settings` in Merchant Center
2. run the curl script that you receive once you confirmed creating an API client, you copy the `access_token` and run it as a bash `export` (see below)

### Updating

```bash
❯ export AUTH_TOKEN={access_token}
❯ graphql get-schema
```
