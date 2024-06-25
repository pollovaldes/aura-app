Comment format for copyright (put inside Settings.json). 
It requires this extension: https://marketplace.visualstudio.com/items?itemName=doi.fileheadercomment

"fileHeaderComment.parameter": {
    "*": {
      "commentbegin": "/*",
      "commentprefix": " *",
      "commentend": " */",
      "company": "Aura Residuos Sustentables",
      "name": "Luis Arturo Valdes Romero"
    }
  },
  "fileHeaderComment.template": {
    "*": [
      "${commentbegin}",
      "${commentprefix} Created on ${date}",
      "${commentprefix}",
      "${commentprefix} Copyright (c) ${year} ${company}",
      "${commentend}"
    ]
  }