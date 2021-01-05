const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UserService = {
  hasUserWithUserName(db, username) {
    return db('user')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
    }
  },
  populateUserWords(db, user_id) {
    return db.transaction(async trx => {
      const [languageId] = await trx
        .into('language')
        .insert([
          { name: 'Spanish', user_id },
        ], ['id'])

      const seq = await db
        .from('word_id_seq')
        .select('last_value')
        .first()

      const languageWords = [
      ['práctica', 'practice', 2],
      ['hola', 'hello', 3],
      ['casa', 'house', 4],
      ['desarrolladora', 'developer', 5],
      ['traducir', 'translate', 6],
      ['asombrosa', 'amazing', 7],
      ['perra', 'dog', 8],
      ['feliz', 'happy', 9],
      ['jugar', 'gamble', 10],
      ['computadora', 'computer', 11],
      ['flores', 'flowers', 12],
      ['tocar', 'play', 13],
      ['amor', 'love', 14],
      ['divertida', 'fun', 15],
      ['baño', 'bathroom', 16],
      ['trabajo', 'work', 17],
      ['dinero', 'money', 18],
      ['dormir', 'sleep', 19],
      ['luna', 'moon', 20],
      ['estrellas', 'stars', 21],
      ['avión', 'airplane', 22],
      ['caminata', 'hike', 23],
      ['navegar', 'surf', 24],
      ['por favor', 'please', 25],
      ['gracias', 'thank you', 26],
      ['ayuda', 'help', 27],
      ['fuego', 'fire', 28],
      ['película', 'movie', 29],
      ['gata', 'cat', null],
      ];

      const [languageHeadId] = await trx
        .into('word')
        .insert(
          languageWords.map(([original, translation, nextInc]) => ({
            language_id: languageId.id,
            original,
            translation,
            next: nextInc
              ? Number(seq.last_value) + nextInc
              : null
          })),
          ['id']
        )

      await trx('language')
        .where('id', languageId.id)
        .update({
          head: languageHeadId.id,
        })
    })
  },
}

module.exports = UserService;