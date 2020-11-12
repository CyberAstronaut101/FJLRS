# Models

This folder contains the the MongoDB schema declarations for the API.

There are a lot of extra models here that will be paired down eventually, but I am leaving them for now to serve as reference.

Big thing to note about models, there should be a function called `toClient` that should look like the following:

```js

SchemaName.method('toClient', function() {
  var obj = this.toObject();
  console.log('Renaming UID of db entry...');
  // console.log('Before: ');
  // console.log(obj);
  // Rename the Fields

  // Rename the DeptInfo id
  obj.id = obj._id;
  delete obj._id;

  return obj;
}
```

Basically all this function does is change `_id` to `id` before returning data to the client. I have this function defined because Angular really didnt like fields that were prefixed with a `_`. I cant remember the exact reason but it makes it easier to handle data. Basically before returning any data from the API the API routes should call `<DATA>.toClient` in order to update the id fields. NOTE if there are going to be nested references the `toClient` function should handle renaming the id fields as well. 