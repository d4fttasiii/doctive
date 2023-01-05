const Doctive = artifacts.require("Doctive");
const Web3 = require('web3');
const { v4: uuidv4 } = require('uuid');


contract("Doctive", (accounts) => {

    it("should not exceed max contract size of 24.576KB", async () => {
        const doctive = await Doctive.deployed();
        var bytecode = doctive.constructor._json.bytecode;

        assert.isAtMost(
            bytecode.length / 2,
            24576,
            "Max contract size exceeded"
        )
    });

    it("should set default addresses correctly", async () => {
        const doctive = await Doctive.deployed();
        const ownerAddress = await doctive.ownerAddress.call();

        assert.equal(
            ownerAddress,
            accounts[0],
            "Deployer is not the owner"
        );

        const isTrustedAccount = await doctive.trustedAccounts.call(accounts[0]);
        assert.isTrue(
            isTrustedAccount,
            "Owner is not a trusted account"
        );
    });

    it("should register practitioner", async () => {
        const doctive = await Doctive.deployed();

        await doctive.registerPractitioner({ from: accounts[1] });
        const practitioner = await doctive.practitioners(accounts[1]);
        assert.equal(
            practitioner.practitionerAddress,
            accounts[1],
            "Practitioner registration failed"
        );
    });

    it("should register patient", async () => {
        const doctive = await Doctive.deployed();

        await doctive.registerPatient({ from: accounts[0] });
        const patient = await doctive.patients(accounts[0]);
        assert.equal(
            patient.patientAddress,
            accounts[0],
            "Patient registration failed"
        );
    });

    it("should create patient record", async () => {
        const doctive = await Doctive.deployed();
        const recordId = uuidv4();

        await doctive.addPatientRecord(accounts[0], recordId, { from: accounts[1] });
        
        const patient = await doctive.patients(accounts[0]);
        assert.equal(
            patient.recordCount,
            1,
            "Failed to create record"
        );
        const patientRecord = await doctive.patientRecords(accounts[0], 0);
        assert.equal(
            patientRecord.patientRecordRefId,
            recordId,
            "Record id incorrect"
        );
    });

    it("should create patient record access request", async () => {
        const doctive = await Doctive.deployed();

        await doctive.requestPatientRecordsAccess(accounts[0], [0], 8, { from: accounts[1] });
        
        const patientRecordAccess = await doctive.patientRecordAccess(accounts[1], accounts[0], 0);
        assert.isAbove(
            patientRecordAccess.created.toNumber(),
            0,
            "Patient record access request was not created correctly"
        );
    });

    it("should approve patient record access request", async () => {
        const doctive = await Doctive.deployed();

        await doctive.approvePatientRecordsAccess(accounts[1], [0], { from: accounts[0] });
        
        const patientRecordAccess = await doctive.patientRecordAccess(accounts[1], accounts[0], 0);
        assert.equal(
            patientRecordAccess.status,
            1,
            "Patient record access status not set correctly"
        );
        assert.isAbove(
            patientRecordAccess.updated.toNumber(),
            0,
            "Patient record access request was not approved correctly"
        );
    });
});