import { generate } from './gen-service';


const main = async () => {
    console.log(process.argv);
    const url = process.argv[2]
    const path = process.argv[3]
    const serviceName = process.argv[4]
    await generate(url, path, serviceName);
};

main()
    .then(() => console.log('Generator started'))
    .finally();