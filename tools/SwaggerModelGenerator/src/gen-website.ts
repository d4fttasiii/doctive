import { generateModels } from './index';
console.log(process.argv);
const url = process.argv[2]
const modelPath = process.argv[3]
generateModels('swagger-website.json',
    url,
    modelPath,
);
