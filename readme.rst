Introduction
-------------

This project should include all that is needed to get started with frontend development.
The project source files include a base index.html file, as well as a structured scss folder
where all of the CSS source is located. This folder organziation is described below.


SCSS Files
===========

The source .scss files are located in src/static/scss/**

Bootstrap 4 alpha and fontawesome are both built as part of the compile process for base.scss.
The build files are generated in /static/css/base.css. This file should not be committed to git,
but built as needed.

HTML Files
===========
HTML files are located in the src/html folder. Additional pages can be added to a new directory with an index.html
file, or added to a different file, but the 2nd approach requires you name the file itself.

The https://www.npmjs.com/package/gulp-connect package is used to serve the local files for development.
This package is configured in gulpfile.js to include both src/html and src as base directories, so that the html
can load files from the /static/* paths.

Place any additional assets in the /static/* location. Add additional directories for fonts, images, etc. as needed,
and you will be able to refer to them directly as '/static/img/*' in the html files.

Project Requirements
----------------------

You will require a working and updated nodejs installation to run this project. I recommend::

    node >= 6.x
    npm => 3.8.x

If your system uses older versions, it may well work, but I cannot vouch for it. When in doubt, upgrade.

Build System
==============

This project uses gulp for building. To get started, you need to update with npm::

    npm install

This should install all of the requirements. If nodejs and npm are properly installed, you should not have issues.
If you do have issues, the most likely source would be the sass builds, which require source code compiling.

Check Stack Overflow or other online resources for a resolution to any issues you have.

Building and Serving the files
-------------------------------

Review the gulpfile.js for details about the available gulp tasks. The default gulp task will compile the scss files,
 and start a development server. This server will live-reload for you, so that changes you make to .scss files or .html
 will be reloaded automatically. This should result in a very usable development environment for your frontend work.

Build and Start Server::

    gulp

Build files only::

    gulp build




