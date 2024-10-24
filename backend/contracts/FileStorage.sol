// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string fileHash;
        address owner;
        uint256 timestamp;
    }

    mapping(string => File) private files;

    event FileUploaded(string fileHash, address owner, uint256 timestamp);

    function uploadFile(string memory _fileHash) public {
        require(bytes(_fileHash).length > 0, "File hash cannot be empty");
        files[_fileHash] = File(_fileHash, msg.sender, block.timestamp);
        emit FileUploaded(_fileHash, msg.sender, block.timestamp);
    }

    function getFile(string memory _fileHash) public view returns (string memory, address, uint256) {
        File memory file = files[_fileHash];
        return (file.fileHash, file.owner, file.timestamp);
    }
}
