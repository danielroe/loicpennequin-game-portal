/* eslint-disable no-console */
import { resolve } from 'path';
import { format, resolveConfig } from 'prettier';
import fs from 'fs-extra';
import dedent from 'dedent';
import chalk from 'chalk';
import fg from 'fast-glob';
import { camelCase, startCase } from 'lodash-es';

export const generateInjectables = async () => {
  const injectables = (await fg('**/*.injectable.ts')).map(path => ({
    name: camelCase(path.split('/').at(-1)?.replace('.injectable.ts', '')),
    importPath: path.replace('src', '@').replace('.ts', '')
  }));

  const importBlocks = injectables.map(
    ({ name, importPath }) => `import ${name} from '${importPath}';`
  );

  const injectablesBlocks = injectables.map(({ name }) => {
    return dedent`${name}: asFunction(${name})`;
  });

  const injectablesTypes = injectables.map(({ name }) => {
    return dedent`export type ${startCase(camelCase(name)).replace(
      / /g,
      ''
    )} = ReturnType<typeof ${name}>;`;
  });

  const outputPath = resolve(process.cwd(), 'src/generated/injectables.ts');
  fs.ensureFileSync(outputPath);

  const template = dedent`
  /* 
    THIS IS A GENERATED FILE. DO NOT EDIT
    This file is automatically generated when bootstraping the application
  */
  import { asFunction } from 'awilix';  
  ${importBlocks.join('\n')}
  
  export { AuthenticatedEvent } from '@/modules/core/utils/types'
  
  ${injectablesTypes.join('\n')}

  export const injectables = {
    ${injectablesBlocks.join(',\n\t')}
  } as const;
  `;

  fs.writeFileSync(
    outputPath,
    format(template, {
      ...(await resolveConfig(outputPath)),
      parser: 'typescript'
    })
  );

  console.log(chalk.green('[  DI  ]'), ' - Injectables generated.');
};
