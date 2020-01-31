const config = {

  production: {

    email: {
      EMAIL_FROM: 'Quizoor@gmail.com',
      EMAIL_HEADER: 'Quizoor',
      EMAIL_USERNAME: 'Quizoor@gmail.com',
      EMAIL_PASSWORD: '3333Quiz',
      EMAIL_CLIENT_ID: '658837219271-3t8q0lhtl85knbjjqf9cf2j5hj731gsq.apps.googleusercontent.com',
      EMAIL_CLIENT_SECRET: 'wIjwoztJOUNGoohWaTF_PMA5',
      EMAIL_REFRESH_TOKEN: '1/wdgFI9votWWLKhW12z69toSJRlKQ7GtkYC-nbTOhI3A'
    },

    DATABASE_URL: ''

  },

  default: {

    email: {
      EMAIL_FROM: 'Quizoor@gmail.com',
      EMAIL_HEADER: 'Quizoor',
      EMAIL_USERNAME: 'Quizoor@gmail.com',
      EMAIL_PASSWORD: '3333Quiz',
      EMAIL_CLIENT_ID: '658837219271-3t8q0lhtl85knbjjqf9cf2j5hj731gsq.apps.googleusercontent.com',
      EMAIL_CLIENT_SECRET: 'wIjwoztJOUNGoohWaTF_PMA5',
      EMAIL_REFRESH_TOKEN: '1/wdgFI9votWWLKhW12z69toSJRlKQ7GtkYC-nbTOhI3A'
    },

    DATABASE_URL: 'mongodb://localhost/labbaik'

  }

}

export function get(env) {
  return config[env] || config.default;
}