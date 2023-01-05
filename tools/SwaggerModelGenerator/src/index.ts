import { readFileSync } from "fs";
import { resolve } from "path";
import { isObject } from "lodash";

import { get } from "http";
import { writeFile } from "fs";

import { GeneratorOptions } from "./options";
import { Swagger } from "./swagger";
import { ENCODING } from "./utils";
import { generateModelTSFiles } from "./model-generator";

const TEMPLATE_FOLDER = resolve(__dirname, "templates");

/**
* Generate TypeScript files based on the given SwaggerFile and some templates
*
* @param {string} swaggerInput The fileName of the swagger.json file including path
* @param {object} options Options which are used during generation
*                 .modelFolder: the name of the folder (path) to generate the models in.
                                each model class is generated in its own file.
*                 .enumTSFile: the name of the enum TS file including path
*                 .enumI18NHtmlFile: the name of the HTML file including path to generate enum values for translation.
*                 .enumLanguageFiles: array with the names of the enum languages file including path
*                 .modelModuleName: the name of the model module (aka namespace)
*                 .enumModuleName: the name of the enum module (aka namespace)
*/
function generateTSFiles(
  swaggerInput: string | Swagger,
  options: GeneratorOptions
) {
  options = enrichConfig(options);

  if (!swaggerInput) {
    throw "swaggerFileName must be defined";
  }
  if (!isObject(options)) {
    throw "options must be defined";
  }

  let swagger =
    typeof swaggerInput === "string"
      ? (JSON.parse(readFileSync(swaggerInput, ENCODING).trim()) as Swagger)
      : swaggerInput;

  if (typeof swagger !== "object") {
    throw new TypeError("The given swagger input is not of type object");
  }

  // let folder = path.normalize(options.modelFolder);
  // utils.removeFolder(folder);

  generateModelTSFiles(swagger, options);
}

function enrichConfig(options: GeneratorOptions) {
  const templates = options.templates;
  delete options.templates;
  return {
    generateBarrelFiles: true,
    generateClasses: true,
    generateValidatorFile: true,
    subTypePropertyName: options.subTypePropertyName || "$type",
    templates: {
      models: `${TEMPLATE_FOLDER}/generate-model-ts.hbs`,
      barrel: `${TEMPLATE_FOLDER}/generate-barrel-ts.hbs`,
      ...templates
    },
    ...options
  } as GeneratorOptions;
}

export function generateModels(fileName: string, serverUrl: string, modelFolder: string) {
  const localFileName =  `${__dirname}/${fileName}`;

  get(serverUrl, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error: Error;
    if (statusCode !== 200) {
      error = new Error(`Request to server ${serverUrl} Failed.\nStatus Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`Invalid content-type.\n Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        writeFile(localFileName, rawData, function (err) {
          console.log(`The file ${localFileName} was saved!`);
          if (err) {
            return console.log(err);
          }

          console.log(`Generating Typescript models from ${localFileName}...`);
          generateTSFiles(
            localFileName,
            {
              modelFolder: modelFolder,
              typeNameSuffixesToRemove: ['Nullable'],
            }
          );
        });
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}
