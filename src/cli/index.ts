import cac from 'cac'
import consola from 'consola'

import { version } from '../../package.json'

import { build, BuildCommandOptions } from './commands/build'
import { changelog } from './commands/changelog'

const cli = cac('packager')

const run = async <A extends (...args: any[]) => Promise<void>>(
  action: A,
  ...args: Parameters<A>
) => {
  await action(...args).catch(err => {
    consola.error(err)
    process.exit(1)
  })
}

cli
  .command('build [...packages]', 'Bundle input files')
  .option('--watch', 'Watch files in bundle and rebuild on changes', {
    default: false,
  })
  .option('--dev', 'Build development bundle (only CJS)', {
    default: false,
  })
  .action((packages: string[], options: BuildCommandOptions) =>
    run(build, { ...options, packages })
  )

cli.command('changelog', 'Generate changelog').action(() => run(changelog))

cli.version(version)
cli.help()

cli.parse()

process.on('unhandledRejection', err => {
  consola.error(err)
  process.exit(1)
})
