export class PrintFunctionVariablesDto {
    pathTemplate: string;
    fillPath: string;
    httpVerb: string;
    controllerName: string;
    methodName: string;
    params: Array<{ name: string, type: string }>;
    bBodyParam: { name: string, type: string };
    response: string;
}

export class EndpointParamDtoSchema {
    type: string
}

export class EndpointParamDto {
    name: string;
    in: string;
    required: string;
    format: string;
    schema: EndpointParamDtoSchema
}

export class EndpointResponseDtoSchemaWrapper {
    content: Record<string, EndpointResponseDto>;
}

export class EndpointResponseDto {
    schema: EndpointResponseDtoSchema;
}

export class EndpointResponseDtoSchema {
    ref: string;
    Type: string;
    items: EndpointResponseArrayItemDtoSchema;
}

export class EndpointResponseArrayItemDtoSchema {
    ref: string;
    type: string;
}

export class EndpointDto {
    tags: string[];
    operationId: string;
    consumes: string[];
    produces: string[];
    parameters: EndpointParamDto[];
    requestBody: EndpointResponseDtoSchemaWrapper;
    responses: any;

}