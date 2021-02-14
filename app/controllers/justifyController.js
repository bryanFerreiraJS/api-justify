const { ErrorHandler } = require('../middlewares/error')

const justifyController = {

  returnJustifiedText: (req, res, next) => {
    try {

      const textJustification = (wordsOfParagraph) => {

        // If a word is longer than 80 characters, we throw an error.
        for (const currentWord of wordsOfParagraph) {
          if (currentWord.length >= 80) {
            throw new ErrorHandler(403, 'Response code 403 (A Word Is Larger Than 80 Characters)')
          }
        }

        let explodedLinesOfParagraph = [[]]
        let indexOfCurrentExplodedLine = 0
        for (const currentWord of wordsOfParagraph) {
          // If it's the first word of the paragraph, it's inserted
          if (explodedLinesOfParagraph[indexOfCurrentExplodedLine].length === 0) {
            explodedLinesOfParagraph[indexOfCurrentExplodedLine].push(currentWord)
          }
          // Else, if adding this word doesn't exceed the limit of 80 characters of the line, it's inserted
          else if ((explodedLinesOfParagraph[indexOfCurrentExplodedLine].join(' ').length + currentWord.length + 1) <= 80) {
            explodedLinesOfParagraph[indexOfCurrentExplodedLine].push(currentWord)
          }
          // Else, we back to the line
          else {
            explodedLinesOfParagraph[++indexOfCurrentExplodedLine] = []
            explodedLinesOfParagraph[indexOfCurrentExplodedLine].push(currentWord)
          }
        }

        for (const indexOfCurrentExplodedLine in explodedLinesOfParagraph) {
          let pastedLine = explodedLinesOfParagraph[indexOfCurrentExplodedLine].join(' ')
          let numberOfSpaceCharacters = 80 - pastedLine.length

          // If this is the last line of the paragraph
          if (indexOfCurrentExplodedLine == explodedLinesOfParagraph.length - 1) {
            explodedLinesOfParagraph[indexOfCurrentExplodedLine] = appendSpaces(pastedLine, numberOfSpaceCharacters)
          }

          // Else
          else {
            const cloneOfCurrentExplodedLine = explodedLinesOfParagraph[indexOfCurrentExplodedLine]
            const numberOfSpacingsBetweenWordsInCurrentExplodedLine = cloneOfCurrentExplodedLine.length - 1
            numberOfSpaceCharacters = 80 - cloneOfCurrentExplodedLine.join('').length
            let extraSpaces = numberOfSpaceCharacters % numberOfSpacingsBetweenWordsInCurrentExplodedLine
            const numberOfSpaceCharactersPerSpacing = Math.floor(numberOfSpaceCharacters / numberOfSpacingsBetweenWordsInCurrentExplodedLine)
            pastedLine = ''
            for (let indexOfCurrentWord = 0; indexOfCurrentWord < cloneOfCurrentExplodedLine.length; indexOfCurrentWord++) {
              let addOneSpace = false
              if (extraSpaces > 0) {
                addOneSpace = true
                extraSpaces--
              }
              const numberOfSpaceDistributionManagement = numberOfSpaceCharactersPerSpacing + (addOneSpace ? 1 : 0)
              if (indexOfCurrentWord == cloneOfCurrentExplodedLine.length - 1) {
                pastedLine += cloneOfCurrentExplodedLine[indexOfCurrentWord]
              } else {
                pastedLine += appendSpaces(cloneOfCurrentExplodedLine[indexOfCurrentWord], numberOfSpaceDistributionManagement)
              }
            }
            explodedLinesOfParagraph[indexOfCurrentExplodedLine] = pastedLine
          }
        }
        return explodedLinesOfParagraph
      }

      const appendSpaces = (string, numberOfSpaceCharacters) => {
        for (let currentSpaceCharacter = 0; currentSpaceCharacter < numberOfSpaceCharacters; currentSpaceCharacter++) {
          string += ' '
        }
        return string
      }

      res.type('text/plain')
      
      // If text only contains whitespace (ie. spaces, tabs or line breaks)', send a empty string
      if (!req.body.replace(/\s/g, '').length) {
        res.status(200).send('')
      }

      const textSeparatedByLineBreaks = req.body.split(/\n/)
      let paragraphsOfText = ['']
      let textJustified = []

      // Management of line breaks, to get as close as possible to the result of the attached example
      textSeparatedByLineBreaks.forEach((elem) => {
        if (elem) {
          paragraphsOfText[paragraphsOfText.length - 1] += elem
        } else {
          paragraphsOfText.push('')
        }
      })
      for (paragraph of paragraphsOfText) {
        paragraph = paragraph.trim()
        textJustified.push(textJustification(paragraph.split(/\s/)))
      }
      textJustified = textJustified.map(elem => elem.join('\r\n'))
      textJustified = textJustified.join('\r\n')
      res.status(200).send(textJustified)
    } catch (error) {
      next(error)
    }
  }
}


module.exports = justifyController
