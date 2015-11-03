# i18n4React

[React-Intl](https://github.com/yahoo/react-intl) CLI for extracting strings for globalization.


## Installation

    $ npm install -g git+https://git@github.com:ZBoxApp/i18n4react.git

## Options
The CLI help will display this:

    Usage:
      i18n4react [OPTIONS]

    Options:
      -e, --extract PATH     input directory
      -o, --output PATH      output directory (Default is i18n)
      -l, --lang [LANG]      Set the default language to name the merged output
                             file  (Default is en)
      -v, --version          Display the current version
      -h, --help             Display help and usage details


## Usage

    $ i18n4react -e <directory with react-intl jsx files> -o <output directory> -l en-US

## License

(The MIT License)

Copyright (c) 2012 Sudhakar Mani

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