Getting started
===============

This guide explains how to work on Emma Allen's personal website. The site is
a small collection of HTML, CSS, JavaScript and media files. GitHub Pages
publishes those files directly, so there is no application to install and no
build step to run.

What you will need
------------------

You only need Git, a text editor and Python 3. Python is used to preview the
site locally. It is not used by the published website.

Get the project
---------------

Clone the repository and enter its folder.

.. code-block:: console

   git clone https://github.com/ejallen471/ejallen471.github.io.git
   cd ejallen471.github.io

If you already have a copy, update it before starting.

.. code-block:: console

   git pull

Find your way around
--------------------

The homepage sits at the top level. Other pages and their supporting files are
grouped by purpose.

.. code-block:: text

   index.html
   pages/
   projects/
   stylesheets/site.css
   scripts/
   assets/

``index.html``
   The homepage.

``pages``
   The main About, CV, Projects and Contact pages.

``projects``
   The detailed pages and documents for individual projects.

``stylesheets/site.css``
   The shared colours, typography, spacing and layout.

``scripts``
   The optional interactive behaviour used by the site.

``assets``
   Images, videos and PDF documents.

Preview the site
----------------

From the repository root, start a local web server.

.. code-block:: console

   python3 -m http.server 8000

Open ``http://localhost:8000`` in a browser. Leave the command running while
you work, then press ``Ctrl C`` to stop it.

Using a local server matters because links and media paths can behave
differently when an HTML file is opened directly from your computer.

Make a change
-------------

Edit the existing HTML when changing words or page structure. Edit
``stylesheets/site.css`` when changing presentation shared across the site.
Keep images and documents inside ``assets`` rather than placing them beside a
page.

Paths are relative to the file containing them. A link from the homepage to
the About page looks like this.

.. code-block:: html

   <a href="pages/about.html">About</a>

The return link in ``pages/about.html`` moves up one folder.

.. code-block:: html

   <a href="../index.html">Home</a>

Preview every edited page at both wide and narrow browser sizes. Check that
navigation, images, downloads and external links still work.

Add a page
----------

Create a new HTML file in ``pages`` and follow the structure of a nearby page.
Use the shared stylesheet so the new page remains consistent.

.. code-block:: html

   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>Page title | Emma Allen</title>
       <link rel="stylesheet" href="../stylesheets/site.css">
     </head>
     <body>
       <main>
         <h1>Page title</h1>
         <p>Replace this with your content.</p>
       </main>
     </body>
   </html>

Add the page to the navigation only when visitors need to find it from every
part of the site. Use the same label and destination everywhere.

Review your work
----------------

Before publishing, inspect the exact changes that Git will record.

.. code-block:: console

   git status
   git diff

Look for accidental edits, missing files and private information. Large media
files deserve particular attention because they slow the site for visitors.

Publish
-------

Commit the finished change and push it to the repository.

.. code-block:: console

   git add path/to/changed-file
   git commit -m "Describe the website update"
   git push

GitHub Pages serves this site from the repository root. Once the publishing
workflow finishes, the update appears at
``https://ejallen471.github.io``. If it does not appear immediately, check the
latest Pages deployment on GitHub and refresh after a short wait.

Common problems
---------------

Page not found
   Check the spelling and capitalisation of the file path. GitHub Pages treats
   capital letters as distinct.

Missing image or stylesheet
   Confirm that the path is relative to the current HTML file. Files inside
   ``pages`` usually need ``../`` before ``assets`` or ``stylesheets``.

Old content still visible
   Refresh the page without using the browser cache, then confirm that the
   latest deployment completed successfully.

Layout works on a computer but not a phone
   Confirm that the viewport element is present and test the relevant rules in
   ``stylesheets/site.css`` at a narrow width.
