FXTableFilter (Fast eXtensible TableFilter)
======================================

FX TableFilter is a JQuery plugin that adds filter capabilities to an HTML table. This plugin is a rewrite of the PicNet Table Filter, it is intended to be Faster and more eXtensible. It works on larger tables and custom filters can be added.

Demos can be found here: [http://henla464.github.io/FXTableFilter/](http://henla464.github.io/FXTableFilter/)

The rewrite has focused on:
* Performance. To make it work better on larger tables, with more columns and rows.
* Extensibility. Possible to add custom filters. Several example are included, for example filters using date pickers so one can choose a "from" and "to" date.
* Getting rid of the dependence of the closure library
* Making the code easier to read and understand for someone new to the code

Main disadvantages compared to the PicNet Table Filter
* Requires a bit more configuration to use


Version History
=============
Version 5
- Changed to only use a single tableFilter() function (best practice). 
  * tableFilterReload() -> is now called like tableFilter('reload')
  * tableFilterClear -> tableFilter('clearAllFilters')
  * tableFilterApplyFilter -> tableFilter('applyFilter')

Version 4
- Added a tableFilterReload() function to reload the internal cache with new/changed/updated rows

Version 3
- Changes to configuration, added support for multiple header rows
- Added possibility to exclude some columns, so that the values are not stored internally
- Added several new demo pages

Version 2
- First version uploaded to github
- Bugfixes

Version 1
- Initial version
