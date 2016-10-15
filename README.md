# i18n4mm

CLI to sort Mattermost i18n files.


## Installation

    $ npm install -g git+https://git@github.com:enahum/i18n4mm.git

## Options
The CLI help will display this:

    Usage:
      i18n4mm [OPTIONS]
    
    Options: 
      -o, --output PATH      Output directory (Default is i18n)
      -s, --sort STRING      Sort platform or webapp i18n file
      -p, --prop STRING      The property to use when sorting
      -f, --filename FILE    JSON file
      -v, --version          Display the current version
      -h, --help             Display help and usage details


## Sort platform i18n files

    $ i18n4mm -s platform -o <output directory> -p <property> -f <file>

## Sort webapp i18n files

    $ i18n4mm -s webapp -o <output directory> -f <file>


## License

(The MIT License)

Copyright (c) 2016 Elias Nahum

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.