const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('./linked-list-router')
const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )
      const firstWord = await LanguageService.getWord(
        req.app.get('db'),
        language.head
      )
      res.json(LanguageService.serializeWord(firstWord[0], language))
      
      next()
    } catch (error){
      next(error)
    }
  })

  languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    const { guess } = req.body
    if (!guess) {
      return res.status(400).json({
        error: `Missing 'guess' in request body`
      })
    }
    try {
      let user_id = req.user.id
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        user_id
      )
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        language.id
      )
      let word =words.find(a => a.id === language.head)
      
      let memory_value = word.memory_value
      
      let correct_count= word.correct_count
      let incorrect_count=word.incorrect_count
      let total_score = language.total_score
      if (guess === word.translation){
        correct_count++
        total_score++
        memory_value*=2
        if (memory_value>16){
          memory_value=16
        }
      }
      else {
        incorrect_count++
        memory_value=1
      }
      let db = req.app.get('db')
      
      let a = words.find(w => w.id = language.head)
        if (a.next ===null){
        let idx = a.id-29
        let nums = [idx+1,idx+2,idx+3,idx+4,idx+5,idx+6,idx+7,idx+8,idx+9,idx+10,idx+11,idx+12,idx+13,idx+14,idx+15,idx+16,idx+17,idx+18,idx+19,idx+20,idx+21,idx+22,idx+23,idx+24,idx+25,idx+26,idx+27,idx+28,idx+29]
        words.forEach(w => nums=nums.filter(a => a!=w.next))
        a.next = nums[0]
        db('word')
          .where({ id })
          .update({
            next:nums[0]
          })
          .then(()=>{})
      }
             
      if (memory_value!==16){
        let M = memory_value
        let tmpNode = a
        let tmpId = a.id
        let tmpNext =a.next
        
        for (let i = 0; i<M; i++){
          if (tmpNode.next===null){
            let odx = tmpNode.id-words.length
            let nums = [odx+1,odx+2,odx+3,odx+4,odx+5,odx+6,odx+7,odx+8,odx+9,odx+10,odx+11,odx+12,odx+13,odx+14,odx+15,odx+16,odx+17,odx+18,odx+19,odx+20,odx+21,odx+22,odx+23,odx+24,odx+25,odx+26,odx+27,odx+28,odx+29]
            words.forEach(w => nums=nums.filter(a => a!=w.next))
            tmpNode.next = nums[0]
            let id = tmpNode.id
            db('word')
            .where({ id })
            .update({
              next:nums[0]
            }).then(()=>{})
          }
          tmpId = tmpNode.id
          tmpNext = tmpNode.next
          tmpNode = words.find(o => o.id===tmpNext)
        }
          if (memory_value==6){
            memory_value=16
          }
          LanguageService.updateNext(db, tmpNode.id, language.head)
          .then((res)=> {
            console.log(res)
          })
          LanguageService.updateWord(db, language.head, correct_count, incorrect_count, memory_value, tmpNode.next)
          .then((res)=>{
            console.log(res)
          })
        }
        else{
          memory_value=6
          await LanguageService.updateWord(db, language.head, correct_count, incorrect_count, memory_value, word.next)
        }
        
      let word2 = await LanguageService.getWord(
        req.app.get('db'),
        word.next
        )
        let nextWord = word2[0].original
        db('language')
        .where({ user_id: user_id })
        .update({
          total_score,
          head: word2[0].id
        })
        .then(()=>{
          console.log('updated score')
        })
      


      res.json({
        totalScore: total_score,
        wordCorrectCount: word2[0].correct_count,
        wordIncorrectCount: word2[0].incorrect_count,
        answer: word.translation,
        isCorrect: guess === word.translation,
        nextWord
      })

      next()
    }
    catch(err){
      next(err)
    }

  })
  module.exports = languageRouter