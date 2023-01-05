"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gen_service_1 = require("./gen-service");
const main = async () => {
    console.log(process.argv);
    const url = process.argv[2];
    const path = process.argv[3];
    const serviceName = process.argv[4];
    await (0, gen_service_1.generate)(url, path, serviceName);
};
main()
    .then(() => console.log('Generator started'))
    .finally();
//# sourceMappingURL=index.js.map