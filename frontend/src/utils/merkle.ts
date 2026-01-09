import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

export function buildMerkle(addresses: string[]) {
  const leaves = addresses.map(addr =>
    keccak256(addr.toLowerCase())
  );

  const tree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
  });

  return {
    root: tree.getHexRoot(),
    getProof: (address: string) =>
      tree.getHexProof(keccak256(address.toLowerCase())),
  };
}

