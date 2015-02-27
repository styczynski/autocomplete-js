# autocomplete-js
The simplest jQuery plugin for creating autocomplete boxes with dynamically generated suggestions.

## Usage
Just place a `<div>` element enywhere and use the javascript:

```javascript
var ac = $('#div').autocomplete({
  options: ["apple", "bannana", "strawberry", "pineapple"]
});
```

You can also directly access suggestions and input history:

```javascript
ac.options = ["nope"]; //override suggestions list
ac.historyInput = []; //clear history
```

## Constructor properties

Here is a list of all available initial properties:

| property                       | type    | meaning                                                              |
|--------------------------------|---------|----------------------------------------------------------------------|
| inputWidth                     | String  | CSS width of the input box                                           |
| dropDownWidth                  | String  | CSS width of the dropdown list                                       |
| fontSize                       | String  | CSS size of the text                                                 |
| fontFamily                     | String  | CSS font family                                                      |
| formPromptHtml                 | String  | HTML code for the prompt                                             |
| color                          | String  | Text color                                                           |
| hintColor                      | String  | Text color of the suggestion hint                                    |
| backgroundColor                | String  | CSS background color for the dropdown                                |
| dropDownBorderColor            | String  | CSS suggestions drop down border color                               |
| dropDownZIndex                 | Integer | CSS z-index of the drop down list.                                   |
| dropDownOnHoverBackgroundColor | String  | CSS background color of the selected drop down suggestion item       |
| enableHistory                  | Bool    | Enable browsing the input history.                                   |
| inputHistory                   | Array   | Override the input history.                                          |
| classes.input                  | String  | Set the class name for the input component.                          |
| classes.dropdown               | String  | Set the class name for the drop down component.                      |
| classes.hint                   | String  | Set the class name for the hint text component.                      |
| classes.wrapper                | String  | Set the class name for the wrapper component.                        |
| classes.prompt                 | String  | Set the class name for the prompt component.                         |
| classes.hoverItem              | String  | Set the class name for the hovered suggestions list item.            |
| classes.row                    | String  | Set the class name for the suggestions list row.                     |
| maxSuggestionsCount            | Integer | Set the maximum suggestion entries number.                           |
| suggestionBoxHeight            | String  | CSS height of the suggestion box.                                    |
| options                        | Array   | All strings that will be displayed as suggestions for the input box. |

## Useful methods/fields of the autocomplete

Here is the list of all useful autocomplete methods and fields:

| Field                 | Type          | Meaning                                                                        |
|-----------------------|---------------|--------------------------------------------------------------------------------|
| startFrom             | Integer       | The index the input string is matched from for suggestions                     |
| options               | Array         | All string suggestions.                                                        |
| inputHistory          | Array         | History of the input.                                                          |
| dropDown              | JQuery object | The drop down component.                                                       |
| formPrompt            | JQuery object | The propmpt component                                                          |
| hint                  | JQuery object | The hint component                                                             |
| input                 | JQuery object | The input box object                                                           |
| formWrapper           | JQuery object | The wrapper component.                                                         |
| historyBrowsingActive | Bool          | The bool value indicating if the user currently is browsing the input history. |
| historyIndex          | Integer       | The currently browsed history index.                                           |


| Method name       | Description                         |
|-------------------|-------------------------------------|
| hideDropDown()    | Hides a drop down suggestions list. |
| getText()         | Obtains the input text.             |
| setText(String)   | Sets the input text.                |
| repaint()         | Refreshes the autocomplete box.     |
| getInputHistory() | Get the input history array.        |
| onHistoryNext()   | Simulate a history browsing event.  |
| onHistoryPrev()   | Simulate a history browsing event.  |
