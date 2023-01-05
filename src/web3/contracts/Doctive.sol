// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Doctive {
    enum ApprovalStatus {
        Open,
        Approved,
        Declined,
        Canceled
    }

    struct Patient {
        address patientAddress;
        uint64 recordCount;
        uint256 created;
        uint256 updated;
    }

    struct PatientRecord {
        string patientRecordRefId;
        address practitionerAddress;
        uint64 version;
        uint256 created;
        uint256 updated;
        bool isDeleted;
    }

    struct PatientRecordAccess {
        uint64 patientRecordId;
        uint256 created;
        uint256 updated;
        ApprovalStatus status;
        uint8 numberOfHours;
    }

    struct Practitioner {
        address practitionerAddress;
        uint256 created;
        uint256 updated;
    }

    address public ownerAddress;

    mapping(address => Patient) public patients;
    mapping(address => PatientRecord[]) public patientRecords;
    mapping(string => bool) public patientRecordKeys;
    mapping(address => mapping(address => mapping(uint256 => PatientRecordAccess)))
        public patientRecordAccess;
    mapping(address => Practitioner) public practitioners;
    mapping(address => mapping(address => bool))
        public patientPractitionerConnection;
    mapping(address => bool) public trustedAccounts;

    constructor() {
        ownerAddress = msg.sender;
        addTrustedAccount(msg.sender);
    }

    // ---------- EVENTS ----------

    event PatientRegistered(address indexed patient);
    event PatientRecordCreated(
        address indexed pracitioner,
        address indexed patient,
        uint256 patientRecordId
    );
    event PractitionerRegistered(address indexed pracitioner);

    // ---------- MODIFIERS ----------

    function _onlyOwner() private view {
        require(
            msg.sender == ownerAddress,
            "Caller must be the contract owner!"
        );
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    function _onlyTrustedAccounts() private view {
        require(
            trustedAccounts[msg.sender],
            "Caller must be a trusted account!"
        );
    }

    modifier onlyTrustedAccounts() {
        _onlyTrustedAccounts();
        _;
    }

    function _onlyPatient() private view {
        require(
            patients[msg.sender].patientAddress == msg.sender,
            "Caller must be the patient!"
        );
    }

    modifier onlyPatient() {
        _onlyPatient();
        _;
    }

    function _onlyPractitioner() private view {
        require(
            practitioners[msg.sender].practitionerAddress == msg.sender,
            "Caller must be the practitioner!"
        );
    }

    modifier onlyPractitioner() {
        _onlyPractitioner();
        _;
    }

    // ---------- CONTRACT MANAGEMENT ----------

    function addTrustedAccount(address _newAccount) public onlyOwner {
        trustedAccounts[_newAccount] = true;
    }

    function toggleTrustedAccount(address _account) external onlyOwner {
        trustedAccounts[_account] = !trustedAccounts[_account];
    }

    // ---------- PATIENT ----------

    function registerPatient() external {
        require(
            patients[msg.sender].patientAddress == address(0),
            "Patient already exists!"
        );

        Patient memory patient = Patient(
            msg.sender,
            0,
            block.timestamp,
            block.timestamp
        );
        patients[msg.sender] = patient;

        emit PatientRegistered(msg.sender);
    }

    function addPatientRecord(
        address _patientAddress,
        string memory _patientRecordRefId
    ) external onlyPractitioner returns (uint64) {
        require(
            patients[_patientAddress].patientAddress == _patientAddress,
            "Patient address doesn't exist"
        );
        require(
            !patientRecordKeys[_patientRecordRefId],
            "Record already exists"
        );

        patientRecordKeys[_patientRecordRefId] = true;
        patients[_patientAddress].recordCount++;
        PatientRecord memory record = PatientRecord(
            _patientRecordRefId,
            msg.sender,
            1,
            block.timestamp,
            block.timestamp,
            false
        );
        patientRecords[_patientAddress].push(record);
        uint64 patientRecordCount = patients[_patientAddress].recordCount;
        emit PatientRecordCreated(
            msg.sender,
            _patientAddress,
            patientRecordCount
        );

        return patientRecordCount;
    }

    function approvePatientRecordsAccess(
        address _practitionerAddress,
        uint64[] memory _patientRecordIds
    ) external onlyPatient {
        for (uint256 i = 0; i < _patientRecordIds.length; i++) {
            _approvePatientRecordAccess(
                _practitionerAddress,
                _patientRecordIds[i]
            );
        }
    }

    function declinePatientRecordsAccess(
        address _practitionerAddress,
        uint64[] memory _patientRecordIds
    ) external onlyPatient {
        for (uint256 i = 0; i < _patientRecordIds.length; i++) {
            _declinePatientRecordAccess(
                _practitionerAddress,
                _patientRecordIds[i]
            );
        }
    }

    // ---------- PRACTIIONER ----------

    function registerPractitioner() external {
        require(
            practitioners[msg.sender].practitionerAddress == address(0),
            "Practitioner already exists!"
        );

        Practitioner memory practitioner = Practitioner(
            msg.sender,
            block.timestamp,
            block.timestamp
        );
        practitioners[msg.sender] = practitioner;

        emit PractitionerRegistered(msg.sender);
    }

    function requestPatientRecordsAccess(
        address _patientAddress,
        uint64[] memory _patientRecordIds,
        uint8 _numberOfHours
    ) external onlyPractitioner {
        for (uint256 i = 0; i < _patientRecordIds.length; i++) {
            _requestPatientRecordAccess(
                _patientAddress,
                _patientRecordIds[i],
                _numberOfHours
            );
        }
    }

    // ---------- HELPERS ----------

    function _requestPatientRecordAccess(
        address _patientAddress,
        uint64 _patientRecordId,
        uint8 _numberOfHours
    ) internal {
        if (
            patientRecordAccess[msg.sender][_patientAddress][_patientRecordId]
                .created == 0
        ) {
            patientRecordAccess[msg.sender][_patientAddress][
                _patientRecordId
            ] = PatientRecordAccess(
                _patientRecordId,
                block.timestamp,
                0,
                ApprovalStatus.Open,
                _numberOfHours
            );
        } else {
            patientRecordAccess[msg.sender][_patientAddress][_patientRecordId]
                .updated = block.timestamp;
            patientRecordAccess[msg.sender][_patientAddress][_patientRecordId]
                .status = ApprovalStatus.Open;
            patientRecordAccess[msg.sender][_patientAddress][_patientRecordId]
                .numberOfHours = _numberOfHours;
        }
    }

    function _approvePatientRecordAccess(
        address _practitionerAddress,
        uint64 _patientRecordId
    ) internal {
        patientRecordAccess[_practitionerAddress][msg.sender][_patientRecordId]
            .updated = block.timestamp;
        patientRecordAccess[_practitionerAddress][msg.sender][_patientRecordId]
            .status = ApprovalStatus.Approved;
    }

    function _declinePatientRecordAccess(
        address _practitionerAddress,
        uint64 _patientRecordId
    ) internal {
        patientRecordAccess[_practitionerAddress][msg.sender][_patientRecordId]
            .updated = block.timestamp;
        patientRecordAccess[_practitionerAddress][msg.sender][_patientRecordId]
            .status = ApprovalStatus.Declined;
    }
}
