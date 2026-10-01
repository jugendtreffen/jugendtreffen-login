// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build

const path = require('path')

require('dotenv-defaults').config({
  path: path.join(__dirname, '../.env'),
  defaults: path.join(__dirname, '../.env.defaults'),
})

// Redwood leitet für Tests nur DATABASE_URL und die directUrl auf die Test-DB um.
// schema.prisma liest die Verbindung aber aus SUPABASE_TRANSACTION_POOLER_URL –
// ohne diese Umleitung würden Scenario-Tests gegen die echte Datenbank laufen
// und dort Daten anlegen und löschen.
if (!process.env.TEST_DATABASE_URL) {
  throw new Error(
    'TEST_DATABASE_URL ist nicht gesetzt. Die API-Tests brauchen eine eigene ' +
      'Postgres-Testdatenbank (siehe README, Abschnitt "Tests").'
  )
}
process.env.SUPABASE_TRANSACTION_POOLER_URL = process.env.TEST_DATABASE_URL
process.env.SUPABASE_SESSION_POOLER_URL =
  process.env.TEST_DIRECT_URL || process.env.TEST_DATABASE_URL

// Externe Dienste werden in den Tests gemockt, die Module brauchen beim Import aber Werte
process.env.SUPABASE_URL ||= 'http://localhost:54321'
process.env.SUPABASE_SECRET_KEY ||= 'test-secret-key'
process.env.BREVO_API_KEY ||= 'test-brevo-key'

const config = {
  rootDir: '../',
  preset: '@redwoodjs/testing/config/jest/api',
}

module.exports = config
