"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const axios_1 = require("axios");
const fs_1 = require("fs");
const getSwaggerData = async (baseUrl) => {
    const response = await axios_1.default.get(baseUrl, {
        headers: {
            Accept: "application/json",
        },
    });
    const jsonText = JSON.stringify(response.data).replaceAll("#/components/schemas/", "");
    const json = JSON.parse(jsonText);
    const paths = json["paths"];
    const allEndpoints = [];
    for (const key in paths) {
        if (Object.prototype.hasOwnProperty.call(paths, key)) {
            const path = key;
            const value = paths[key];
            for (const childKey in value) {
                if (Object.prototype.hasOwnProperty.call(value, childKey)) {
                    const child = value[childKey];
                    const httpVerb = childKey;
                    allEndpoints.push({
                        path: path,
                        verb: httpVerb,
                        data: child,
                    });
                }
            }
        }
    }
    return allEndpoints;
};
const transformToCamelCase = (name) => {
    const controller = name.split("_")[0];
    const method = name.split("_")[1];
    return `${controller.charAt(0).toLowerCase()}${controller.substring(1)}${method.charAt(0).toUpperCase()}${method.substring(1)}`;
};
const extractResponse = (responses) => {
    if (responses.default?.content) {
        return responses.default?.content["application/json"]["schema"].items
            ? `${responses.default?.content["application/json"]["schema"].items["$ref"]}[]`
            : responses.default.content["application/json"]["schema"]["$ref"];
    }
    if (responses["200"]?.content) {
        return responses["200"]?.content["application/json"]["schema"].items
            ? `${responses["200"]?.content["application/json"]["schema"].items["$ref"]}[]`
            : responses["200"].content["application/json"]["schema"]["$ref"];
    }
    if (responses["201"]?.content) {
        return responses["201"]?.content["application/json"]["schema"].items
            ? `${responses["201"]?.content["application/json"]["schema"].items["$ref"]}[]`
            : responses["201"].content["application/json"]["schema"]["$ref"];
    }
    return "any";
};
const generateModels = (allEndpoints) => {
    const models = allEndpoints.map((e) => {
        const responseType = extractResponse(e.data.responses);
        const body = e.data.requestBody?.content
            ? e.data.requestBody?.content["application/json"]["schema"]["$ref"]
            : "any";
        return [responseType, body];
    });
    return [
        ...new Set(models
            .flat()
            .filter((m) => m !== "any" && m)
            .map((m) => m.replace("[]", ""))),
    ];
};
const generateService = (serviceName, modelImports, methodCalls) => {
    const content = `
import { Injectable } from '@angular/core';

import { ApiService, HttpOptions } from './api.service';
${modelImports}

@Injectable({
    providedIn: 'root'
})
export class ${serviceName.charAt(0).toUpperCase()}${serviceName.substring(1)}Service {
    constructor(private apiService: ApiService) { }

${methodCalls.join("\n")}
}`;
    return content;
};
const generateIndex = (serviceName) => {
    return `
export * from './{_serviceName}.module';
export * from './{_serviceName}.service';
export * from './models';

`;
};
const generate = async (baseUrl, pathToSave, serviceName) => {
    const allEndpoints = await getSwaggerData(baseUrl);
    const methodCalls = allEndpoints.map((e) => {
        const method = `    ${transformToCamelCase(e.data.operationId)} =`;
        const methodParameters = e.data.parameters.map((p) => `${p.name}${!p.required ? "?" : ""}: ${p.schema.type}`);
        const apiCallParameters = [`\`${e.path.replaceAll("{", "${")}\``];
        const bodyType = e.data.requestBody?.content
            ? e.data.requestBody?.content["application/json"]["schema"]["$ref"]
            : "any";
        if (e.verb !== "get" && e.data.requestBody?.content) {
            methodParameters.push(`data: ${bodyType}`);
            apiCallParameters.push("data");
        }
        methodParameters.push("options: HttpOptions = null");
        apiCallParameters.push("options");
        const responseType = extractResponse(e.data.responses);
        const response = `Promise<${responseType}>`;
        const apiCallResponse = responseType === "any" ? "" : `<${responseType}>`;
        return `${method} async (${methodParameters.join(", ")}): ${response} => this.apiService.${e.verb}${apiCallResponse}(${apiCallParameters.join(", ")});`;
    });
    const models = generateModels(allEndpoints);
    console.log(models);
    const serviceContent = generateService(serviceName, `import { ${models.join(", ")} } from '../generated-models';`, methodCalls);
    const indexContent = generateIndex(serviceName);
    (0, fs_1.writeFileSync)(`${pathToSave}/${serviceName}.service.ts`, serviceContent);
    (0, fs_1.writeFileSync)(`${pathToSave}/index.ts`, indexContent);
};
exports.generate = generate;
//# sourceMappingURL=gen-service.js.map