# Shared Components

These are angular componenets that made more sense to not be contained within a module. 


## User View

Basic component that will display the user details if there is a user logged in. Calls `authService.getLocalUserVar()` and then saves that user object. The html side will render the info 

## News View

Component that renders all the news articles from the DB. TODO there needs to be pagination added to the module so once there are lots of news events it wont render all of them and increase the component height.

TODO the formatting also needs to be fixed up, add more contrast in the white boxes and then general formatting of the news article. Possibility of using a rich text editor from PrimeNG to add html markup tags to the news article text. See https://www.primefaces.org/primeng/showcase/#/editor

# NewEmailAccount

This component spawns a hovering modal that prompts the user to enter an email address. Does typechecking for email format, and then will return the input data to the place that called the component in the first place.

```js
// Example on how to call MatDialogRef components

console.log('Spawning NewEmailAccountComponent');
    this.msgs = [];

    // open the modal and send what the prompt should be..
    const dialogRef = this.dialog.open(NewemailaccountComponent, {
      width: '350px',
      data: 'Enter New Admin Email Address:'
    });

    // After user hits nevermind or submit, wait on the returned result data
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        console.log(result);
        // DO SOMETHING WITH THE USER INPUT
      } else {
          // Else no result returned...
      }

    });
```

# Confirmation Dialog

This component just spawns a "yes/no" modal like the `NewEmailAccount` component with the ability to pass a message to it. See the above code snippit about how to call the `NewEmailAccount` modal and just replace references with the config dialog.

