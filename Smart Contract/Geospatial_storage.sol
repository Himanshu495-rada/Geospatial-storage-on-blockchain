// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract main{
    string[] arr = ["0x3197BD5CE6f3e81Eb047c1bC00B30F48c5183721"];
    string[] arr2;
    string[] arr3 = ["No data"];

    function check(string memory addr) public view returns(string[] memory) {
        for (uint i=0; i<arr.length; i++) {
            if (keccak256(abi.encodePacked(arr[i])) == keccak256(abi.encodePacked(addr))){
                return arr2;
            } 
        }
        return arr3;
    }

    function upload_hash(string memory addr, string memory hash_cid) public returns(string memory){
        
        for (uint i=0; i<arr.length; i++) {
            if (keccak256(abi.encodePacked(arr[i])) == keccak256(abi.encodePacked(addr))){
                arr2.push(hash_cid);
                return "Done";
            } 
        }
        return "Not authorised";
    }

    function remove_hash(uint indx) public{
        for(uint i = indx; i < arr2.length-1; i++){
            arr2[i] = arr2[i+1];      
        }
        arr2.pop();
    }

    function return_array() public view returns(string[] memory){
        return arr2;
    }

}