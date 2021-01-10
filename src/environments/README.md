# Environments within Angular Application

Within Angular we have two environment files. Environment files are used to pass top level config to the application during compilation and have a large effect on how the application functions. We can exapand the keys within the environment object and can access the values like  

There are two files; `environment.prod.ts` and `environment.ts`

When local developement server is started with `ng serve` the `enviornment.ts` file is used:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080/api"           // NOTE this port should match whatever port the Node API server is using
};
```


When the production files are compiled using `ng build --prod` the `enviornment.prod.ts` file is used:

```typescript
export const environment = {
  production: true,
  apiUrl: "https://fjlrs.com/api"
};
```