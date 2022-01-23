# invchars-check

**WARN: The project is in the testing phase, consider that the result is not necessarily the one expected.**

Scan the folders to detect invisible chars

## Install

This script is intended to work as a global package:

```bash
git clone https://github.com/Yarflam/invchars-check.git &&
npm i -g invchars-check
```

## Usage

Execute the command:

```bash
invchars-check
```

Output:

```text
exploit.example.js (2 errors)
	chr=133	2:26
	chr=133	2:34
```

About: `exploit.example.js` is a vulnerability model for the `test` command.

## Versions

-   **v0.1.0**: 1st test version

## Author

-   Yarflam - _initial worker_

## Licence

MIT License - Copyright (c) 2022 Yarflam

## Documentations

-   [isthe.com](http://www.isthe.com/chongo/tech/comp/ansi_escapes.html)
-   [proteansec.com](https://www.proteansec.com/linux/blast-past-executing-code-terminal-emulators-via-escape-sequences/)
-   [eso.org](https://www.eso.org/~ndelmott/ascii.html) / [charset.org](https://www.charset.org/utf-8)
